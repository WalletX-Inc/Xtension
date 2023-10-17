import React, { useState } from "react";
import remove from "../../src/assets/x.png";
import search from "../../src/assets/search.svg";
import { TokenData } from "./dummyTokenData";
import { useRecoilState } from "recoil";
import { transferState } from "../../src/state/TransferState";

type searchTokenPara = {
  isOpen: boolean;
  onClose: Function;
  uid: string;
};
type TokenData = [
  tokenName: string | undefined,
  tokenSymbol: string | undefined,
  tokenAddress: string | undefined,
  price: number | undefined,
  balance: number | undefined,
  tokenDecimal: number | undefined
];
const SearchToken = ({ isOpen, onClose, uid }: searchTokenPara) => {
  const [transferData, setTransferData] = useRecoilState(transferState);

  const [selectedToken, setSelectedToken] = useState<TokenData>();
  const [tokenIsSelected, setTokenIsSelected] = useState<boolean>(false);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(); // can also use token id for this
  const [balanceOfToken, setBalanceOfToken] = useState<number>(); // use it in handelAddButton
  const [enteredAmount, setEnteredAmount] = useState<number>(0);

  const handelSelectedToken = ([
    tokenName,
    tokenSymbol,
    tokenAddress,
    price,
    balance,
    tokenDecimal,
  ]: TokenData) => {
    setSelectedToken([
      tokenName,
      tokenSymbol,
      tokenAddress,
      price,
      balance,
      tokenDecimal,
    ]);
    setBalanceOfToken(balance);
  };

  const handelAmountInput = (e: any) => {
    setEnteredAmount(e.target.value);
    console.log(enteredAmount);
  };

  const handelAddButton = () => {
    console.log(selectedToken);
    const tokenName = selectedToken && selectedToken[0];
    const tokenSymbol = selectedToken && selectedToken[1];
    const tokenAddress = selectedToken && selectedToken[2];
    const tokenBalance = selectedToken && selectedToken[4];
    const tokenDecimal = selectedToken && selectedToken[5];
    if (enteredAmount > 0) {
      setTransferData((prevData) =>
        prevData.map((transferDetails) =>
          transferDetails.uid === uid
            ? {
                ...transferDetails,
                tokenName,
                tokenSymbol,
                tokenAddress,
                tokenBalance,
                tokenDecimal,
                amount: enteredAmount,
              }
            : transferDetails
        )
      );
      console.log(transferData);
      setTokenIsSelected(false);
      onClose();
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 bg-black bg-opacity-50 ">
      <div className="relative w-[335px] mx-auto border border-black shadow-lg rounded-lg bg-white  text-black mt-10 ">
        <>
          <h1 className="m-4 text-xl font-semibold ">Select Token</h1>
          <button
            onClick={() => onClose()}
            className="absolute right-2 top-3 opacity-60"
          >
            <img className=" h-8  " src={remove} alt="closeModal " />
          </button>
        </>

        {/* SEARCH BOX  */}
        <div className="flex items-center max-w-[95%] mx-auto border border-gray-300 rounded-lg my-4 p-2">
          <button className="min-w-fit pb-1 pr-1 opacity-60">
            <img className="h-5" src={search} alt="searchIcon" />
          </button>
          <input
            type="text"
            placeholder="Search..."
            className="w-full focus:outline-none pl-1"
            value=""
            //   onChange={handleInputChange}
            //   onFocus={handleFocus}
          />
        </div>
        {/* TOKEN CARD  */}
        <div className="overflow-y-scroll  max-h-[250px]">
          {TokenData.map((token, index) => {
            return (
              <div
                onClick={() => {
                  handelSelectedToken([
                    token?.tokenName,
                    token?.tokenSymbol,
                    token?.tokenAddress,
                    token?.price,
                    token?.balance,
                    token?.tokenDecimal,
                  ]);
                  setSelectedTokenIndex(index);
                  if (selectedTokenIndex == index) {
                    setSelectedTokenIndex(undefined);
                    setTokenIsSelected(false);
                  } else {
                    setTokenIsSelected(true);
                  }
                }}
                className="max-w-[95%] mx-auto m-3"
              >
                <div
                  className={`${
                    index === selectedTokenIndex
                      ? "border-2 border-solid border-black border-opacity-80"
                      : ""
                  } flex flex-row items-center bg-white rounded-xl shadow-md px-4 py-2 border `}
                >
                  <div className=" min-w-[20%]">
                    <img
                      src=""
                      alt="token Logo"
                      className=" w-12 h-12 rounded-full object-cover mr-4 border-2"
                    />
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">
                        {token?.tokenName}
                      </p>
                      <p className="text-lg font-semibold overflow-hidden text-gray-600">
                        {token?.balance}
                      </p>
                    </div>
                    <div>
                      <p title="Current Market Price">
                        <span>₹</span>
                        {token?.price}
                      </p>
                      <p title="Amount of Tokens in wallet">
                        <span>₹</span>
                        {}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/*Add Amount and proceed */}
        <div className="flex item-center gap-5 justify-between border-t border-black bg-gray-50 px-5 rounded-b-lg">
          {tokenIsSelected ? (
            <>
              <div className=" flex  justify-center item-center my-2 ">
                <h1 className="font-semibold text-xl">Amount: </h1>
                <input
                  onChange={handelAmountInput}
                  type="number"
                  min={0.00001}
                  className=" ml-2 py-1 outline-none  border-black border-b-2 bg-transparent max-w-[80px]  "
                />
              </div>
            </>
          ) : (
            <></>
          )}
          <button
            onClick={() => {
              handelAddButton();
            }}
            disabled={tokenIsSelected && enteredAmount ? false : true}
            className={`${
              !tokenIsSelected ? "bg-gray-800" : " bg-green-500 "
            } text-xl  rounded-lg py-2 font-semibold border px-10  border-black m-2  text-white `}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchToken;
