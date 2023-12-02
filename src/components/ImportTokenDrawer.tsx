import { useEffect, useRef, useState } from "react";
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

type tokenDataT = {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogoUrl: string;
  tokenDecimal: number;
  balance: string;
};

const ImportTokenDrawer = ({ isOpen, onClose }: importTokenParam) => {
  const [isValidAddress, setIsValidAddress] = useState<any>(null);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [isValidTokenContract, setIsValidTokenContract] = useState<any>(null);

  const { chainId, provider, smartAccountAddress } = useConfig();
  const SCW = getItemFromStorage("smartAccount");
  const drawer = useRef(null);

  const [tokenData, setTokenData] = useState<tokenDataT>({
    tokenAddress: "",
    tokenSymbol: "",
    tokenName: "",
    tokenLogoUrl: "",
    tokenDecimal: 0,
    balance: "",
  });

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
    setTokenData({
      tokenAddress: "",
      tokenSymbol: "",
      tokenName: "",
      tokenLogoUrl: "",
      tokenDecimal: 0,
      balance: "",
    });
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
      smartAccountAddress,
    );

    if (!tokenData) {
      setIsValidTokenContract(false);
    } else {
      setIsValidTokenContract(true);
      setTokenData({
        tokenAddress: inputAddress,
        tokenSymbol: tokenData.symbol,
        tokenName: tokenData.name,
        tokenLogoUrl: `https://ui-avatars.com/api/?background=fff&color=000&rounded=true&bold=true&name=${tokenData.symbol}`,
        tokenDecimal: tokenData.decimals,
        balance: tokenData.balance,
      });
    }
  };

  /// ADDING TOKEN IN THE CURRENT CHAIN ID

  const setTokenDataForKey = async (key: any, data: Array<{}>) => {
    try {
      const currentData: Array<{}> =
        (await localforage.getItem(generateSHA256Hash(key.toString()))) || [];
      const newTokenData = [...currentData, ...data];

      await localforage.setItem(
        generateSHA256Hash(key.toString()),
        newTokenData,
      );
    } catch (error) {
      console.error("Error setting token data:", error);
    }
  };

  const addToken = () => {
    setTokenDataForKey(chainId, [tokenData]);
    toast.success("Token Added Successfully");
    setTokenData({
      tokenAddress: "",
      tokenSymbol: "",
      tokenName: "",
      tokenLogoUrl: "",
      tokenDecimal: 0,
      balance: "",
    });
    onClose();
    setTokenAddress("");
    setIsValidTokenContract(null);
    setIsValidAddress(null);
  };

  useEffect(() => {
    setTokenData({
      tokenAddress: "",
      tokenSymbol: "",
      tokenName: "",
      tokenLogoUrl: "",
      tokenDecimal: 0,
      balance: "",
    });
  }, [isValidAddress]);

  useEffect(() => {
    const closeDrawerOnOutsideClick = (e: any) => {
      if (!(drawer.current as any).contains(e.target)) {
        closeDrawer();
      }
    };

    document.addEventListener("mousedown", closeDrawerOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeDrawerOnOutsideClick);
    };
  });

  return (
    <>
      <div
        ref={drawer}
        className={`${
          isOpen ? "bottom-0" : " translate-y-full"
        }  fixed  bottom-0 left-1/2 translate-x-[-50%]  w-[95%] h-[80%] bg-[#1f1f20] border border-gray-400 rounded-t-3xl  text-white  mt-10 px-4 py-5 transition duration-1000  transform z-[100] `}
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
        {tokenData.tokenSymbol && isValidTokenContract === true ? (
          <TokenCard
            tokenIcon={tokenData.tokenLogoUrl}
            tokenName={tokenData.tokenName}
            tokenSymbol={tokenData.tokenSymbol}
            tokenAddress={tokenData.tokenAddress}
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
            ) : isValidAddress === false && tokenData.tokenAddress ? (
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
