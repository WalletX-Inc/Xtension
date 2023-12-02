import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { ethers } from "ethers";
import { SyncLoader } from "react-spinners";
import { ArrowLeft } from "react-feather";

import { transferState } from "../../state/TransferState";
import {
  generateAddressIcon,
  getShortDisplayString,
  constructTransactionData,
  constructFinalUserOp,
  getItemFromStorage,
  generateSHA256Hash,
  log,
} from "../../utils/helper";
import gasState from "../../state/GasState";
import RemoveModal from "../../components/Modal";
import fingerPrint from "../../assets/biometric-identification.svg";
import selectArrow from "../../assets/angleDown.svg";
import maticLogo from "../../assets/matic-logo.png";
import { useConfig } from "../../context/ConfigProvider";
import TransactionModal from "../../components/TransactionModal";
import { validateBiometric } from "../../hooks/functional-hooks";
import GasTokenSelectionDrawer from "../../components/GasTokenSelectionDrawer";

type selectedTokenForGasType = {
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
  const [transferDataList, setTransferDataList] = useRecoilState(transferState);
  const [isCancelAllTransactionModalOpen, setIsCancelAllTransactionModalOpen] =
    useState<boolean>(false);
  const [isGasDrawerVisible, setIsGasDrawerVisible] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [gasData, setGasData] = useRecoilState(gasState);
  const biometricAuth = validateBiometric();

  const dName = getItemFromStorage(generateSHA256Hash("device"));

  const [selectedTokenForGas, setSelectedTokenForGas] =
    useState<selectedTokenForGasType>({
      icon: `${maticLogo}`,
      tokenName: "PolygonMatic",
      tokenSymbol: "MATIC",
      tokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      tokenGasValue: 0,
    });

  const navigate = useNavigate();
  const { smartAccountProvider, smartAccountAddress } = useConfig();

  // Cancel the whole transaction
  const clearAllTransactions = () => {
    setTransferDataList([]);
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
  }: selectedTokenForGasType) => {
    // takes the values in the parameter and then sets it up in the selectedTokenForGasType
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
    const rawTransaction: any[] = [];

    transferData.forEach((data: any) => {
      const obj: any = {};
      const isCoin =
        data.tokenAddress.toString() ===
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

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

    const { paymaster } = smartAccountProvider;
    const feeQuotesResponse = await paymaster.getPaymasterFeeQuotesOrData(
      userOp,
      { mode: "ERC20", tokenList: [] },
    );

    const supportedTokens: any = [];

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
    const gasDataWithValues = supportedTokens.map((token: any) => ({
      tokenUID: uuid,
      tokenLogo: token.logoUri,
      tokenName: token.name,
      tokenSymbol: token.symbol,
      tokenAddress: token.address,
      tokenBalance: 0,
      tokenGas: token.maxGasFee.toFixed(5),
      tokenGasValue: token.maxGasFeeUSD.toFixed(5),
    }));

    setGasData(gasDataWithValues);

    log("Gas Data : ", gasData, "info");
  };

  useEffect(() => {
    supportedTokensForGas(transferDataList);
  }, [transferDataList]);

  async function sendBatchTransaction(transferData: any) {
    const isValid = await biometricAuth(dName.id);

    if (!isValid) {
      setAuthError("Authentication Failed");
      return;
    }

    const rawTransaction: any[] = [];

    setTransactionInProcess(true);

    transferData.forEach((data: any) => {
      const obj: any = {};
      const isCoin =
        data.tokenAddress.toString() ===
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

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

    const partialUserOp = await smartAccountProvider.buildUserOp(txns);
    let finalUserOp = partialUserOp;

    log("Selected token For gas : ", selectedTokenForGas, "info");

    if (
      selectedTokenForGas.tokenAddress.toString() !==
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    ) {
      finalUserOp = await constructFinalUserOp(
        smartAccountProvider,
        finalUserOp,
        selectedTokenForGas.tokenAddress,
      );
      log("FINAL USEROP : ", finalUserOp, "info");
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

  if (transferDataList.length === 0) navigate("/dashboard");

  return (
    <>
      <div className=" max-w-[350px] mx-auto mt-2 bg-[#1f1f20] overflow-y-hidden">
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
            {transferDataList.map((transferData) => (
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
            ))}
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

          {/* Approve button  */}
          <div className="flex  w-[90%] border-2 border-gray-500 px-2 py-2 rounded-lg bg-gray-950 hover:bg-black items-center justify-center  text-xl text-white min-w-[325px] max-w-[350px] h-[55px] ">
            <button
              disabled={transactionInProcess}
              onClick={() => {
                sendBatchTransaction(transferDataList);
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
      </div>
    </>
  );
};

export default ApproveTransaction;
