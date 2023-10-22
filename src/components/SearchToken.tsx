import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { transferState } from "../../src/state/TransferState";
import { Search } from "react-feather";
import Tokens from "../constants/tokens";
import { useConfig } from "../context/ConfigProvider";
import { getItemFromStorage } from "../utils/helper";
import localforage from "localforage";

type searchTokenPara = {
  isOpen: boolean;
  onClose: Function;
  uid: string;
};

type Token = [
  name: string,
  symbol: string,
  address: string,
  decimals: number | string,
  logoUri: string
];

type tokenDataT = {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogoUrl: string;
  tokenDecimal: number;
};

const SearchToken = ({ isOpen, onClose, uid }: searchTokenPara) => {
  const { chainId } = useConfig();

  const [transferData, setTransferData] = useRecoilState(transferState);

  const [selectedToken, setSelectedToken] = useState<Token>();
  const [tokenIsSelected, setTokenIsSelected] = useState<boolean>(false);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(); // can also use token id for this
  const [balanceOfToken, setBalanceOfToken] = useState<number>(); // use it in handelAddButton
  const [tokenListFromIndexedDB, setTokenListFromIndexedDB] = useState<any>([]);

  const addToken = ([
    _tokenName,
    _tokenSymbol,
    _tokenAddress,
    _tokenDecimal,
    _tokenLogoUri,
  ]: Token) => {
    const tokenName = _tokenName;
    const tokenSymbol = _tokenSymbol;
    const tokenAddress = _tokenAddress;
    const tokenDecimal = _tokenDecimal;
    const tokenLogo = _tokenLogoUri;

    setTransferData((prevData) =>
      prevData.map((transferDetails) =>
        transferDetails.uid === uid
          ? {
              ...transferDetails,
              tokenName,
              tokenSymbol,
              tokenAddress,
              tokenDecimal,
              tokenLogo,
            }
          : transferDetails
      )
    );
    setTokenIsSelected(false);
    onClose();
  };

  const chain = getItemFromStorage("network");
  const chainID = chain.toString();

  // function to fetch the data form Indexed DB using localFORage
  const getTokenDataForKey = async (key: string) => {
    try {
      const data = await localforage.getItem(key);
      setTokenListFromIndexedDB(data);
      return data || [];
    } catch (error) {
      console.error("Error getting token data:", error);
      return [];
    }
  };

  useEffect(() => {
    async function fetchData() {
      const retrievedData = await getTokenDataForKey(chainId); // put chainID
      setTokenListFromIndexedDB(retrievedData);
    }
    fetchData();
  }, []);

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
          <Search className="h-5 mx-auto my-auto" />
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
        {Tokens[chainId].map((token, index) => {
          return (
            <div
              onClick={() => {
                addToken([
                  token?.name,
                  token?.symbol,
                  token?.address,
                  token?.decimals,
                  token?.logoUri,
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
                    src={token?.logoUri}
                    alt="token Logo"
                    className=" w-12 h-12 rounded-full object-cover mr-4 border-2"
                  />
                </div>
                <div className="w-full flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{token?.symbol}</p>
                    <p className="text-lg font-semibold overflow-hidden text-gray-600">
                      {token?.name}
                    </p>
                  </div>
                  <div className="items-end">
                    <p title="current Balance">0000</p>
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
        {tokenListFromIndexedDB &&
          tokenListFromIndexedDB.map((tokens: tokenDataT, index: any) => {
            return (
              <div
                onClick={() => {
                  addToken([
                    tokens.tokenName,
                    tokens.tokenSymbol,
                    tokens.tokenAddress,
                    tokens.tokenDecimal,
                    tokens.tokenLogoUrl,
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
                      src={tokens.tokenLogoUrl}
                      alt="token Logo"
                      className=" w-12 h-12 rounded-full object-cover mr-4 border-2"
                    />
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">
                        {tokens.tokenSymbol}
                      </p>
                      <p className="text-lg font-semibold overflow-hidden text-gray-600">
                        {tokens.tokenName}
                      </p>
                    </div>
                    <div className="items-end">
                      <p title="current Balance">0000</p>
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
