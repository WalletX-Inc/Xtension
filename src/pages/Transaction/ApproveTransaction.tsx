import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { ethers } from "ethers";
import { SyncLoader, BeatLoader } from "react-spinners";
import { ArrowLeft } from "react-feather";

import { transferState } from "../../state/TransferState";
import { constructFinalUserOpForGasless, generateAddressIcon, getShortDisplayString } from "../../utils/helper";
import { gasState } from "../../state/GasState";
import RemoveModal from "../../components/Modal";
import fingerPrint from "../../assets/biometric-identification.svg";
import selectArrow from "../../assets/angleDown.svg";
import maticLogo from "../../assets/matic-logo.png";
import {
  constructTransactionData,
  constructFinalUserOp,
} from "../../utils/helper";
import { useConfig } from "../../context/ConfigProvider";
import TransactionModal from "../../components/TransactionModal";
import {
  getItemFromStorage,
  generateSHA256Hash,
  log,
} from "../../utils/helper";
import { validateBiometric } from "../../hooks/functional-hooks";
import GasTokenSelectionDrawer from "../../components/GasTokenSelectionDrawer";
import Modal from "../../components/common/Modal";
import { getAdHash } from "../../utils/getAdHash";

type selectedTokenForGas = {
  icon: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenGasValue: number;
};

const ApproveTransaction = () => {
  const [transactionInProcess, setTransactionInProcess] =
    useState<boolean>(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] =
    useState<boolean>(false);
  const [transferData, setTransferData] = useRecoilState(transferState);
  const [isCancelAllTransactionModalOpen, setIsCancelAllTransactionModalOpen] =
    useState<boolean>(false);
  const [isGasDrawerVisible, setIsGasDrawerVisible] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState<string>("");

  const [gasData, setGasData] = useRecoilState(gasState);
  const biometricAuth = validateBiometric();
  const allDevices = getItemFromStorage("devices");

  // const dName = getItemFromStorage(generateSHA256Hash("device"));

  const [selectedTokenForGas, setSelectedTokenForGas] =
    useState<selectedTokenForGas>({
      icon: `${maticLogo}`,
      tokenName: "PolygonMatic",
      tokenSymbol: "MATIC",
      tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      tokenGasValue: 0,
    });

  const navigate = useNavigate();
  const { smartAccountProvider, smartAccountAddress,provider } = useConfig();

  // Cancel the whole transaction
  const clearAllTransactions = () => {
    setTransferData([]);
    setIsCancelAllTransactionModalOpen(false);
    navigate("/dashboard");
  };

  const openCancelAllTransactionsModal = () => {
    setIsCancelAllTransactionModalOpen(true);
  };

  const closeCancelAllTransactionsModal = () => {
    setIsCancelAllTransactionModalOpen(false);
  };

  // FUNCTIONS RELATED TO GAS

  const openGasSelectionDrawer = () => {
    setIsGasDrawerVisible(true);
  };

  const closeGasSelectionDrawer = () => {
    setIsGasDrawerVisible(false);
  };

  const updateSelectedTokenForGas = ({
    icon,
    tokenName,
    tokenSymbol,
    tokenAddress,
    tokenGasValue,
  }: selectedTokenForGas) => {
    //takes the values in the parameter and then sets it up in the selectedTokenForGas
    setSelectedTokenForGas({
      icon,
      tokenName,
      tokenSymbol,
      tokenAddress,
      tokenGasValue,
    });
    closeGasSelectionDrawer();
  };

  const supportedTokensForGas = async (transferData: any) => {
    let rawTransaction: any[] = [];

    transferData.forEach((data: any) => {
      let obj: any = {};
      console.log('DATA:::::',data,transferData)
      const isCoin =
        data.tokenAddress.toString() ===
        "0x0000000000000000000000000000000000001010";

      obj.to = isCoin ? data.address : data.tokenAddress;
      obj.args = isCoin
        ? []
        : [
            data.address,
            ethers.utils
              .parseUnits(data.amount.toString(), data.tokenDecimal)
              .toString(),
          ];
      obj.value = isCoin
        ? ethers.utils.parseEther(data.amount).toString()
        : "0";
      obj.from = smartAccountAddress;

      rawTransaction.push(obj);
    });

    const txns = constructTransactionData(rawTransaction);
    const userOp = await smartAccountProvider.buildUserOp(txns);

    const paymaster = smartAccountProvider.paymaster;
    const feeQuotesResponse = await paymaster.getPaymasterFeeQuotesOrData(
      userOp,
      { mode: "SPONSORED", tokenList: [] }
    );

    let supportedTokens: any = [];

    feeQuotesResponse.feeQuotes.map((token: any) => {
      const tokenObj = {
        name: token.symbol,
        symbol: token.symbol,
        address: token.tokenAddress,
        logoUri: token.logoUrl,
        maxGasFee: token.maxGasFee,
        maxGasFeeUSD: token.maxGasFeeUSD,
      };

      return supportedTokens.push(tokenObj);
    });

    log("Fee Quotes : ", supportedTokens, "info");

    const uuid = crypto.randomUUID();
    const gasDataWithValues = supportedTokens.map((token: any) => {
      return {
        tokenUID: uuid,
        tokenLogo: token.logoUri,
        tokenName: token.name,
        tokenSymbol: token.symbol,
        tokenAddress: token.address,
        tokenBalance: 0,
        tokenGas: token.maxGasFee.toFixed(5),
        tokenGasValue: token.maxGasFeeUSD.toFixed(5),
      };
    });

    setGasData(gasDataWithValues);

    log("Gas Data : ", gasData, "info");
  };

  useEffect(() => {
    supportedTokensForGas(transferData);
  }, [transferData]);

  async function sendBatchTransaction(transferData: any,gas?:string) {
    const smartAcc=getItemFromStorage('smartAccount')
    const filterDevice = allDevices.filter(
      (d: any) => d.address === smartAcc
    )?.[0];
    console.log(gas,'filtered device',filterDevice)
    const isValid = await biometricAuth(filterDevice.id);
    console.log(gas,'inside trn',transferData)
    if (!isValid) {
      setAuthError("Authentication Failed");
      return;
    }

    let rawTransaction: any[] = [];
    setTransactionInProcess(true);

    transferData.forEach((data: any) => {
      let obj: any = {};
      const isCoin =
        data.tokenAddress.toString() ===
        "0x0000000000000000000000000000000000001010";

      obj.to = isCoin ? data.address : data.tokenAddress;
      obj.args = isCoin
        ? []
        : [
            data.address,
            ethers.utils.parseUnits(data.amount, data.tokenDecimal).toString(),
          ];
      obj.value = isCoin
        ? ethers.utils.parseEther(data.amount).toString()
        : "0";
      obj.from = smartAccountAddress;

      rawTransaction.push(obj);
    });

    const txns = constructTransactionData(rawTransaction);
      console.log('Txns',txns)
    const partialUserOp = await smartAccountProvider.buildUserOp(txns);
    let finalUserOp = partialUserOp;

    log("Selected token For gas : ", selectedTokenForGas, "info");

    if (
      selectedTokenForGas.tokenAddress.toString() !==
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    ) {
      console.log(' finalUserOp ',finalUserOp)
      if(gas==='gas'){
        finalUserOp = await constructFinalUserOpForGasless(
          smartAccountProvider,
          finalUserOp,
          selectedTokenForGas.tokenAddress
        );
        console.log("FINAL USEROP : Gasless",finalUserOp)
      }else{
      finalUserOp = await constructFinalUserOp(
        smartAccountProvider,
        finalUserOp,
        selectedTokenForGas.tokenAddress
        
      );
      log("FINAL USEROP : ", finalUserOp, "info");

      }
    }
    else if(gas==='gas'){
      finalUserOp = await constructFinalUserOpForGasless(
        smartAccountProvider,
        finalUserOp,
        selectedTokenForGas.tokenAddress
      );
      console.log("FINAL USEROP : Gasless",finalUserOp)
    }

    try {
      const userOpResponse = await smartAccountProvider.sendUserOp(finalUserOp);
      const transactionDetails = await userOpResponse.wait();

      setTransactionHash(transactionDetails.receipt.transactionHash);

      log("Transaction Details : ", transactionDetails, "success");
      setIsTransactionModalOpen(true);
    } catch (e) {
      log("Error while sending batch txn : ", e, "error");
    }
  }

  if (transferData.length === 0) navigate("/dashboard");

  return (
    <>
      <div className=" max-w-[350px] mx-auto mt-2 bg-[#1f1f20] overflow-y-hidden">
        {/* <iframe title='video' width={350} height={400}> */}
      
        {/* </iframe> */}
        <header className="mb-4 flex justify-between  ">
          <div className="flex flex-row items-center">
            <button
              disabled={transactionInProcess}
              onClick={() => navigate("/dashboard/transaction/add-tokens")}
            >
              <ArrowLeft color="white" className="h-11 w-6 mx-3" />
            </button>
            <h1 className="text-xl font-semibold text-white">Edit</h1>
          </div>
          <div className="felx justify-center item-center text-base font-semibold mr-2">
            <button
              disabled={transactionInProcess}
              onClick={openCancelAllTransactionsModal}
              title="Cancel all transaction"
              className="border px-2 py-1 rounded-lg bg-gray-800 text-white hover:bg-red-500"
            >
              Cancel
            </button>
          </div>
        </header>
        {/* OverView */}
        <div className=" max-w-[325px] mx-auto">
          <div className="relative  mt-5">
            <hr className="border rounded-lg border-white opacity-70 " />
            <h1 className="absolute top-[-15px] bg-[#1f1f20]  px-4 rounded-lg left-1/2 transform -translate-x-1/2 font-semibold text-xl text-white">
              Review
            </h1>
          </div>
          <div className="mt-5 overflow-y-scroll  max-h-[375px] px-2">
            {transferData.map((transferData) => {
              return (
                <div className="flex flex-col gap-2 bg-gray-800 max-w-[325px] border rounded-xl py-2 px-2 border-gray-700 mx-auto mt-5 text-white shadow-md text-base">
                  <div className=" bg-gray-700 border border-gray-700 py-2 px-2 rounded-lg">
                    <div className="flex justify-center item-center gap-2">
                      <img
                        className="h-7 border rounded-lg my-auto"
                        src={generateAddressIcon(transferData.address)}
                        alt="generate it from the token"
                      />
                      <p className="font-medium">
                        {getShortDisplayString(transferData.address)}
                      </p>
                    </div>
                  </div>
                  <div className="flex bg-gray-700 border-gray-700 py-3  gap-2 rounded-lg px-4   justify-between w-full items-center   ">
                    <div className="flex justify-center items-center gap-2">
                      <img
                        className="h-8 w-8 "
                        src={transferData.tokenLogo}
                        alt="tokenIcon"
                      />

                      <div className="flex flex-col items-start ">
                        <p>{transferData.tokenSymbol}</p>
                        <p className="text-sm">{transferData.tokenName}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end ">
                      <input
                        className="bg-transparent  border-black outline-none max-w-[80px] text-right"
                        type="number"
                        value={transferData.amount}
                        readOnly
                      />
                      <p className="text-sm ">$0.25</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Gas and  Approve   */}
        <div className="fixed left-1/2 translate-x-[-50%] bottom-0 flex flex-col item-center justify-center  py-2   max-w-[350px] bg-transparent text-2xl font-bold w-full mx-auto">
          {/* FETCH THE TOKEN DETAILS FOR GAS FROM THE SELECTED TOKEN FOR GAS  */}
          <div className="flex w-[85%] items-center  justify-between text-white  text-base py-2 ">
            <h1 className="font-sans font-semibold text-lg">Gas</h1>
            <button
              className="flex  item-center gap-1"
              disabled={transactionInProcess}
              onClick={() => openGasSelectionDrawer()}
            >
              <p className="font-sans text-sm  font-semibold">
                {" "}
                {`~$${selectedTokenForGas.tokenGasValue}`}{" "}
              </p>
              <img
                className="h-6"
                src={selectedTokenForGas.icon}
                alt="selected gas token icon"
              />
              <p className="font-sans text-sm font-bold ">
                {selectedTokenForGas.tokenSymbol}
              </p>
              <img className="h-8" src={selectArrow} alt="selectArrow" />
            </button>
          </div>
          <div
            className="text-white w-[90%] rounded-xl p-2 text-center cursor-pointer bg-gray-800 my-4 tracking-wider font-semibold text-base border-2 border-gray-950"
            onClick={async() => {
              const res=await getAdHash(provider, '0x4E4968c25572d58b7fE9E440fd392e399F36CE2c',[
                {
                  "inputs": [],
                  "stateMutability": "nonpayable",
                  "type": "constructor"
                },
                {
                  "inputs": [
                    {
                      "internalType": "string",
                      "name": "walletName",
                      "type": "string"
                    }
                  ],
                  "name": "getAdDetails",
                  "outputs": [
                    {
                      "internalType": "string",
                      "name": "",
                      "type": "string"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "getIntegratorsList",
                  "outputs": [
                    {
                      "internalType": "string[]",
                      "name": "",
                      "type": "string[]"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "getPoolsList",
                  "outputs": [
                    {
                      "internalType": "address[]",
                      "name": "",
                      "type": "address[]"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "owner",
                  "outputs": [
                    {
                      "internalType": "address",
                      "name": "",
                      "type": "address"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "factoryContract",
                      "type": "address"
                    }
                  ],
                  "name": "setFactoryContract",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "newOwner",
                      "type": "address"
                    }
                  ],
                  "name": "transferOwnership",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                }
              ])
              console.log('res',res)
              setShowIframe(res || 'https://bafybeiaewqmznmdb2r73vcrm32jmhf5babixhmf6j7bwlam6jw7wo2sqe4.ipfs.dweb.link/');

            }}
          >
            Go Gasless
          </div>
          {/* Approve button  */}
          <div className="flex  w-[90%] border-2 border-gray-500 px-2 py-2 rounded-lg bg-gray-950 hover:bg-black items-center justify-center  text-xl text-white min-w-[325px] max-w-[350px] h-[55px] ">
            <button
              disabled={transactionInProcess}
              onClick={() => {
                sendBatchTransaction(transferData)
              }}
            >
              {transactionInProcess === true ? (
                <div className="pt-2">
                  <SyncLoader
                    size={9}
                    margin={7}
                    loading={transactionInProcess}
                    speedMultiplier={0.6}
                    color="#4b5563"
                  />
                </div>
              ) : (
                <div className="flex gap-3 w-full">
                  <p>{authError || "Approve Transaction"}</p>
                  <img className="h-8" src={fingerPrint} alt="fingerPring" />
                </div>
              )}
            </button>
          </div>

        </div>

        <GasTokenSelectionDrawer
          isOpen={isGasDrawerVisible}
          updateGasToken={updateSelectedTokenForGas}
          selectedTokenForGas={selectedTokenForGas}
          onClose={closeGasSelectionDrawer}
        />

        <TransactionModal
          isOpen={isTransactionModalOpen}
          transactionHash={transactionHash}
        />
        <RemoveModal
          isOpen={isCancelAllTransactionModalOpen}
          onCancel={closeCancelAllTransactionsModal}
          onRemove={clearAllTransactions}
          message="Do you want to delete all the transactions?"
          actionBtnName="Delete"
        />
         <Modal
          isOpen={showIframe!==''}
          onClose={() => {
            sendBatchTransaction(transferData,'gas');
            setShowIframe('');
          }}
          modalClass="fixed inset-0 flex items-center justify-center z-50 p-4"
          // headerText="Advertised by X company"
          headerClass="text-white"
        >
          <iframe
            // width="357"
            // height="400"
            src={showIframe}
            title={"YouTube video player"}
            referrerPolicy="no-referrer-when-downgrade"

            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"

            allowFullScreen
          ></iframe>
        </Modal>
      </div>
    </>
  );
};

export default ApproveTransaction;
