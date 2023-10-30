import { useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import { ethers } from "ethers";
import localforage from "localforage";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

import TokenCard from "./TokenCard";
import { useConfig } from "../context/ConfigProvider";
import { getTokenData } from "../utils/helper";
import { getItemFromStorage, generateSHA256Hash } from "../utils/helper";

type importTokenParam = {
  onClose: Function;
  isOpen: boolean;
};

type tokenData = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoUri: string;
  balance: string;
};

const ImportTokenDrawer = ({ isOpen, onClose }: importTokenParam) => {
  const [isValidAddress, setIsValidAddress] = useState<any>(null);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [isValidTokenContract, setIsValidTokenContract] = useState<any>(null);

  const { chainId, provider, smartAccountAddress } = useConfig();
  const SCW = getItemFromStorage("smartAccount");

  const [tokenData, setTokenData] = useState<tokenData>({
    name: "",
    symbol: "",
    address: "",
    decimals: 0,
    logoUri: "",
    balance: "",
  });

  const emptyTokenData = {
    name: "",
    symbol: "",
    address: "",
    decimals: 0,
    logoUri: "",
    balance: "",
  };

  const isEthereumAddress = (address: string) => {
    try {
      const validAddress = ethers.utils.isAddress(address);
      return validAddress;
    } catch (error) {
      return false;
    }
  };

  const closeDrawer = () => {
    onClose();
    setTokenData(emptyTokenData);
    setTokenAddress("");
    setIsValidTokenContract(null);
    setIsValidAddress(null);
  };

  const handelContractAddressInput = async (e: any) => {
    const inputAddress = e.target.value;
    isEthereumAddress(inputAddress);
    setTokenAddress(inputAddress);

    if (!isEthereumAddress(inputAddress)) {
      setIsValidAddress(false);
      return;
    }

    setIsValidAddress(true);
    setIsValidTokenContract("LOADING");

    const tokenData = await getTokenData(
      inputAddress,
      provider,
      smartAccountAddress
    );

    if (!tokenData) {
      setIsValidTokenContract(false);
    } else {
      setIsValidTokenContract(true);
      setTokenData({
        name: tokenData.name,
        symbol: tokenData.symbol,
        address: inputAddress,
        decimals: tokenData.decimals,
        logoUri: `https://ui-avatars.com/api/?background=fff&color=000&rounded=true&bold=true&name=${tokenData.symbol}`,
        balance: tokenData.balance,
      });
    }
  };

  /// ADDING TOKEN IN THE CURRENT CHAIN ID

  const updateTokensInIndexedDB = (data: {}) => {
    localforage.getItem("TokensList").then((tokensList: any) => {
      console.log("This is data in importtokenDrawer", data);
      if (tokensList && tokensList[chainId]) {
        const currentTokens = tokensList[chainId];
        currentTokens.push(data);
        tokensList[chainId] = currentTokens;

        localforage.setItem("TokensList", tokensList);
      } else {
        // Ig it should through an error for the chain where we dont have any tokens seeded as it will show an error of undefined
        console.log(
          "TokensList or specified chainId does not exist in IndexedDB."
        );
      }
    });
  };

  const addToken = () => {
    updateTokensInIndexedDB(tokenData);
    toast.success("Token Added Successfully");
    setTokenData(emptyTokenData);
    onClose();
    setTokenAddress("");
    setIsValidTokenContract(null);
    setIsValidAddress(null);
  };

  useEffect(() => {
    setTokenData(emptyTokenData);
  }, [isValidAddress]);

  return (
    <>
      <div
        className={`${
          isOpen ? "bottom-0" : " translate-y-full"
        }  fixed  bottom-0 left-1/2 translate-x-[-50%]  w-[95%] h-[80%] bg-[#1f1f20] border border-gray-400 rounded-t-3xl  text-white  mt-10 px-4 py-5 transition duration-1000  transform z-50 `}
      >
        <div className=" flex items-center">
          <h1 className=" ml-5 text-2xl  font-semibold self-center  ">
            Import Tokens
          </h1>
          <button
            onClick={() => closeDrawer()}
            className="absolute right-2 top-6 opacity-90"
          >
            <ChevronDown size={30} />
          </button>
        </div>
        <div className=" my-10  ">
          <p className="font-semibold text-xl">Enter Token Address</p>
          <input
            className="border border-gray-300 bg-transparent w-[95%] focus:outline-none mt-2 rounded-lg px-3 py-2"
            onChange={handelContractAddressInput}
            type="text"
            value={tokenAddress}
          />
        </div>
        {tokenData.symbol && isValidTokenContract === true ? (
          <TokenCard
            tokenIcon={tokenData.logoUri}
            tokenName={tokenData.name}
            tokenSymbol={tokenData.symbol}
            tokenAddress={tokenData.address}
            tokenBalance={Number(tokenData.balance)}
            userAddress={SCW || smartAccountAddress}
          />
        ) : (
          <></>
        )}

        <button
          onClick={addToken}
          disabled={
            isValidAddress === true && isValidTokenContract === true
              ? false
              : true
          }
          className={` fixed left-1/2 translate-x-[-50%] bottom-2  flex justify-center items-center shadow-lg text-white    border-2    rounded-lg  py-2 min-w-[300px] max-w-[315px] bg-gray-950 hover:bg-black ${
            isValidAddress === true && isValidTokenContract === true
              ? "border-white text-white "
              : " text-opacity-50 bg-gray-950 border-gray-500"
          }`}
        >
          <h1 className="text-xl font-semibold tracking-wider">
            {isValidTokenContract === "LOADING" ? (
              <BeatLoader size={5} loading={true} color="#ffffff" />
            ) : isValidAddress === false && tokenData.address ? (
              " Invalid Address"
            ) : isValidTokenContract === false || isValidAddress === false ? (
              "Invalid Token"
            ) : (
              " Add Token "
            )}
          </h1>
        </button>
      </div>
    </>
  );
};

export default ImportTokenDrawer;
