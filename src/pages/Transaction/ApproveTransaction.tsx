import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { transferState } from "../../state/TransferState";
import { getShortDisplayString } from "../../utils/helper";
import { gasState } from "../../state/GasState";
import { tokenData } from "../../utils/tokenData/tokenData";

import RemoveModal from "../../components/Modal";

import fingerPrint from "../../assets/biometric-identification.svg";
import backIcon from "../../assets/angle.svg";
import del from "../../assets/delete.svg";
import gas from "../../assets/gas.svg";
import selectArrow from "../../assets/angleDown.svg";
import maticLogo from "../../assets/matic-logo.png";

type selectedTokenForGas = {
  icon: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenGasValue: number;
};

const ApproveTransacton = () => {
  const [transferData, setTransferData] = useRecoilState(transferState);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [uidToRemoveAddress, setUidToRemoveAddress] = useState<string>("");
  const [isCancelAllTransactionModalOpen, setIsCancelAllTransactionModalOpen] =
    useState<boolean>(false);

  const [isGasModalVisible, setIsGasModalVisible] = useState<boolean>(true);

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

  // removing individual transactions for the batch
  const handleRemove = () => {
    // Logic to handle remove action
    setTransferData((prevAddresses) =>
      prevAddresses.filter(
        (transferDetails) => transferDetails.uid !== uidToRemoveAddress
      )
    );
    setIsRemoveModalOpen(false); // Close the modal after removing
  };

  const openDeleteModal = (uid: string) => {
    setIsRemoveModalOpen(true);
    setUidToRemoveAddress(uid);
  };

  const closeDeleteModal = () => {
    setIsRemoveModalOpen(false);
  };

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
    setIsGasModalVisible(!isGasModalVisible);
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
    setIsGasModalVisible(!isGasModalVisible);
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
      tokenGas: 200,
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

  useEffect(() => {
    updateTokenData(); // it update the icon, name , address, give uiid

    updateGasData(); // it update the gas, gasValue in dollars and
  }, [transferData]);

  if (transferData.length == 0) navigate("/dashboard");



  return (
    <>
      <div className=" max-w-[350px] mx-auto mt-2">
        <header className="mb-4 flex justify-between  ">
          <div className="flex flex-row items-center">
            <button
              onClick={() => navigate("/dashboard/transaction/add-address")}
            >
              <img className="h-12" src={backIcon} alt="backIcon" />
            </button>
            <h1 className="text-2xl font-semibold text-white">Edit</h1>
          </div>
          <div className="felx justify-center item-center text-base font-semibold mr-2">
            <button
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
            <hr className="border-2 rounded-lg border-white opacity-70 " />
            <h1 className="absolute top-[-15px] bg-black  px-4 rounded-lg left-1/2 transform -translate-x-1/2 font-semibold text-2xl text-white">
              OverView
            </h1>
          </div>
          <div className="mt-7">
            {transferData.map((transaction) => {
              return (
                <div className="flex flex-row justify-center item-center text-center gap-2 border-2 border-white rounded-lg px-1 py-1 text-xl divide-x-2 divide-white mt-4 text-white">
                  <p className="w-[50%] tracking-wider font-semibold text-xl ">
                    {getShortDisplayString(transaction.address)}
                  </p>
                  <p className="w-[20%]  font-semibold ">
                    {transaction.amount}
                  </p>
                  <p className="w-[20%] font-semibold ">
                    {transaction.tokenSymbol}
                  </p>
                  <button
                    onClick={() => openDeleteModal(transaction.uid)}
                    className="flex item-center justify-center w-[10%]"
                  >
                    <img className="h-7" src={del} alt="delete button" />
                  </button>
                  <RemoveModal
                    isOpen={isRemoveModalOpen}
                    onCancel={closeDeleteModal}
                    onRemove={handleRemove}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Gas and  Approve   */}

        <div className="fixed left-1/2 translate-x-[-50%] bottom-0 flex flex-col item-center justify-center px-2 py-2   max-w-[350px] bg-transparent text-2xl font-bold w-full mx-auto">
          {/* FETCH THE TOKEN DETAILS FOR GAS FROM THE SELECTED TOKEN FOR GAS  */}
          <div className="flex w-[85%] items-center  justify-between text-white  text-base py-2 ">
            <h1 className="font-sans font-semibold text-lg">Gas</h1>
            <div
              className="flex  item-center gap-1"
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
            </div>
          </div>

          <div className="flex  w-[90%] border-2 border-gray-400 px-2 py-2 rounded-lg bg-gray-800 hover:bg-gray-900 items-center justify-center gap-3 text-xl text-white">
            <button
              onClick={() => {
                console.log(transferData);
              }}
            >
              Approve Transaction
            </button>
            <img className="h-8" src={fingerPrint} alt="fingerPring" />
          </div>
        </div>

        {/* Select token for gas component andt it should be componetizeEd */}

        <div
          className={`${
            !isGasModalVisible ? "bottom-0" : " translate-y-full"
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
                        />
                        {token.tokenGas}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
