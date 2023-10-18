import React, { useState } from "react";
import remove from "../../src/assets/x.png";
import search from "../../src/assets/search.svg";
import maticLogo from "../../src/assets/matic-logo.png";
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

  const addToken = ([
    _tokenName,
    _tokenSymbol,
    _tokenAddress,
    _price,
    _balance,
    _tokenDecimal,
  ]: TokenData) => {
    const tokenName = _tokenName;
    const tokenSymbol = _tokenSymbol;
    const tokenAddress = _tokenAddress;
    const tokenBalance = _balance;
    const tokenDecimal = _tokenDecimal;

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
            }
          : transferDetails
      )
    );
    setTokenIsSelected(false);
    onClose();
  };

  return (
    <div
      className={`${
        isOpen ? "bottom-0" : " translate-y-full"
      }  fixed bottom-0 left-1/2 translate-x-[-50%]  w-[350px] h-[455px] bg-slate-900 border-gray-300 text-white border rounded-t-3xl rounded-b-lg mt-10 px-4 py-5 transition duration-500  transform z-50 `}
    >
      <h1
        onClick={() => onClose()}
        className="text-center font-semibold text-xl"
      >
        Select Token
      </h1>

      {/* SEARCH BOX  */}
      <div className="flex items-center max-w-[95%] mx-auto border border-gray-300 rounded-lg my-4 p-2">
        <button className="min-w-fit  pr-1 opacity-60">
          <img className="h-5 mx-auto my-auto" src={search} alt="searchIcon" />
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="w-full focus:outline-none pl-1 bg-transparent"
          value=""
          //   onChange={handleInputChange}
          //   onFocus={handleFocus}
        />
      </div>

      {/* TOKEN CARD  */}
      <div className="overflow-y-scroll  max-h-[315px]">
        {TokenData.map((token, index) => {
          return (
            <div
              onClick={() => {
                addToken([
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
                    ? ""
                    : "border-2 border-solid border-black border-opacity-80"
                } flex gap-1 flex-row items-center bg-gray-800 rounded-xl shadow-md px-4 pt-2 pb-1 border `}
              >
                <div className=" min-w-[20%]">
                  <img
                    src={maticLogo}
                    alt="token Logo"
                    className=" w-12 h-12 rounded-full object-cover mr-4 border-2"
                  />
                </div>
                <div className="w-full flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{token?.tokenName}</p>
                    <p className="text-lg font-semibold overflow-hidden text-gray-600">
                      {token?.tokenSymbol}
                    </p>
                  </div>
                  <div className="items-end">
                    <p title="current Balance">{token?.balance}</p>
                    <p title="balance in dollars">
                      <span>$</span>
                      00.00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchToken;
