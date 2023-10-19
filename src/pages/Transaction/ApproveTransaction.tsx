import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { transferState } from "../../state/TransferState";
import { generateAddressIcon, getShortDisplayString } from "../../utils/helper";
import { gasState } from "../../state/GasState";
import { tokenData } from "../../utils/tokenData/tokenData";

import RemoveModal from "../../components/Modal";

import fingerPrint from "../../assets/biometric-identification.svg";
import backIcon from "../../assets/angle.svg";
import gas from "../../assets/gas.svg";
import selectArrow from "../../assets/angleDown.svg";
import maticLogo from "../../assets/matic-logo.png";

import { SyncLoader, BeatLoader } from "react-spinners";
import TransactionModal from "../../components/TransactionModal";

type selectedTokenForGas = {
  icon: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenGasValue: number;
};

const ApproveTransacton = () => {
  const [transactionInProcess, setTransactionInProcess] =
    useState<boolean>(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] =
    useState<boolean>(false);
  const [transferData, setTransferData] = useRecoilState(transferState);
  const [isCancelAllTransactionModalOpen, setIsCancelAllTransactionModalOpen] =
    useState<boolean>(false);

  const [isGasDrawerVisible, setIsGasDrawerVisible] = useState<boolean>(true);

  const [gasData, setGasData] = useRecoilState(gasState);

  const [selectedTokenForGas, setSelectedTokenForGas] =
    useState<selectedTokenForGas>({
      icon: `${maticLogo}`,
      tokenName: "PolygonMatic",
      tokenSymbol: "MATIC",
      tokenAddress: "0x000",
      tokenGasValue: 0,
    });

  const navigate = useNavigate();

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

  const toggleGasDrawer = () => {
    setIsGasDrawerVisible(!isGasDrawerVisible);
  };

  // FUNCTIONS RELATED TO GAS

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
    setIsGasDrawerVisible(!isGasDrawerVisible);
  };

  const updateTokenData = () => {
    const uuid = crypto.randomUUID();

    const updatedTokenData = tokenData.map((token) => {
      return {
        tokenUID: uuid,
        tokenLogo: token.tokenIcon,
        tokenName: token.tokenName,
        tokenSymbol: token.tokenSymbol,
        tokenAddress: token.tokenAddress,
        tokenBalance: 0,
        tokenGas: 0,
        tokenGasValue: 0,
      };
    });
    setGasData(updatedTokenData);
  };

  // This is a dummy data for the gas of the tokens it should be passed in the below function
  // Just change the name of before the map function
  // IMPORTANT : REMEMBER TO NAME THEN JUST LIKE BELOW tokenBalance,tokenGas,tokenGasValue as the function uses ES6
  const updates = [
    {
      tokenAddress: "0x000",
      tokenBalance: 100,
      tokenGas: 10,
      tokenGasValue: 5,
    },
    {
      tokenAddress: "0x123",
      tokenBalance: 50,
      tokenGas: 0,
      tokenGasValue: 30,
    },
  ];

  const updateGasData = () => {
    setGasData((prevGasData) =>
      prevGasData.map((gasToken) => {
        const update = updates.find(
          (token) => token.tokenAddress === gasToken.tokenAddress
        );
        return update ? { ...gasToken, ...update } : gasToken;
      })
    );
  };

  // Approve button funciton
  const handleApprove = () => {
    console.log(transferData);
    setTransactionInProcess(true);

    setTimeout(() => {
      setIsTransactionModalOpen(true);
    }, 5000);
  };

  useEffect(() => {
    updateTokenData(); // it update the icon, name , address, give uiid

    updateGasData(); // it update the gas, gasValue in dollars and
  }, [transferData]);

  if (transferData.length == 0) navigate("/dashboard");

  return (
    <>
      <div className=" max-w-[350px] mx-auto mt-2 bg-[#1f1f20] overflow-y-hidden">
        <header className="mb-4 flex justify-between  ">
          <div className="flex flex-row items-center">
            <button
              disabled={transactionInProcess}
              onClick={() => navigate("/dashboard/transaction/add-tokens")}
            >
              <img className="h-11" src={backIcon} alt="backIcon" />
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
              OverView
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
              onClick={() => toggleGasDrawer()}
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
                handleApprove();
              }}
            >
              {transactionInProcess == true ? (
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
                  <p>Approve Transaction</p>
                  <img className="h-8" src={fingerPrint} alt="fingerPring" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Select token for gas component andt it should be componetizeEd */}
        <div
          className={`${
            !isGasDrawerVisible ? "bottom-0" : " translate-y-full"
          }  fixed bottom-0   w-[350px] h-[350px] bg-slate-900 border-gray-300 text-white border rounded-t-3xl rounded-b-lg mt-10 px-4 py-5 transition duration-500  transform `}
        >
          <h1 className="text-center font-semibold text-xl">
            Select Token For Gas
          </h1>

          <div className="mt-5">
            {gasData.map((token) => {
              const tokenData: selectedTokenForGas = {
                icon: token.tokenLogo,
                tokenName: token.tokenName,
                tokenSymbol: token.tokenSymbol,
                tokenAddress: token.tokenAddress,
                tokenGasValue: token.tokenGasValue,
              };
              return (
                <div
                  onClick={() => updateSelectedTokenForGas(tokenData)}
                  className={` ${
                    token.tokenAddress === selectedTokenForGas.tokenAddress
                      ? "border-2 border-white"
                      : ""
                  } flex   mt-2 px-2 py-2 rounded-lg `}
                >
                  <div className="w-[20%] flex justify-center items-center">
                    <img
                      className="h-10"
                      src={token.tokenLogo}
                      alt="tokenImage"
                    />
                  </div>
                  <div className="w-[80%] flex  justify-between items-center px-2">
                    <div>
                      <p className="text-lg">{token.tokenSymbol}</p>
                      <p className="text-sm">{token.tokenBalance}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p>{`$ ${token.tokenGasValue}`}</p>
                      <p className="flex item-center text-xs gap-1 ">
                        <img
                          className="h-4 opacity-70"
                          src={gas}
                          alt="gasCanImage"
                        />{
                          token.tokenGas> 0? <>
                          {token.tokenGas}
                          </>:
                          <>
                          <BeatLoader size={5} loading={true} color="#ffffff"/>
                          </>
                        }
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <TransactionModal isOpen={isTransactionModalOpen} />
        <RemoveModal
          isOpen={isCancelAllTransactionModalOpen}
          onCancel={closeCancelAllTransactionsModal}
          onRemove={clearAllTransactions}
        />
      </div>
    </>
  );
};

export default ApproveTransacton;
