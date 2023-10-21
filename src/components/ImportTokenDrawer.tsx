import { useState } from "react";
import { ChevronDown } from "react-feather";
import { ethers } from "ethers";
import TokenCard from "./TokenCard";
import localforage from "localforage";
import toast from "react-hot-toast";
import { useConfig } from "../context/ConfigProvider";

type importTokenParam = {
  onClose: Function;
  isOpen: boolean;
};

const ImportTokenDrawer = ({ isOpen, onClose }: importTokenParam) => {
  const [isValidAddress, setIsValidAddress] = useState<boolean>(false);
  const [tokenAddress , setTokenAddress] = useState<string>("");
  const {chainId}  = useConfig()

  const [tokenData, setTokenData] = useState({
    tokenAddress: "",
    tokenSymbol: "",
    tokenName: "",
    tokenLogoUrl: "",
    tokenDecimal: 0,
  });

  const isEthereumAddress = (address: string) => {
    try {
      const validAddress = ethers.utils.isAddress(address);
      return validAddress;
    } catch (error) {
      return false;
    }
  };

  const handelContractAddressInput = (e: any) => {
    const inputAddress = e.target.value;
    setIsValidAddress(isEthereumAddress(inputAddress));
    setTokenAddress(inputAddress)
    setTokenData({
      tokenAddress: inputAddress,
      tokenSymbol: "",
      tokenName: "",
      tokenLogoUrl: "",
      tokenDecimal: 0,
    });
  };

  /// ADDING TOKEN IN THE CURRENT CHAIN ID

  const setTokenDataForKey = async (key: any, data: Array<{}>) => {
    try {
      const currentData: Array<{}> = (await localforage.getItem(key)) || [];
      const newTokenData = [...currentData, ...data];

      await localforage.setItem(key, newTokenData);
      console.log("tokenData added", newTokenData);
    } catch (error) {
      console.error("Error setting token data:", error);
    }
  };

  const addToken = () => {
    console.log("tokenAdded");
    // Chain id should be given in the string below as parameter
    setTokenDataForKey(chainId, [tokenData]);
    toast.success("Token Added Sucessfully");
    setTokenData({
      tokenAddress: "",
      tokenSymbol: "",
      tokenName: "",
      tokenLogoUrl: "",
      tokenDecimal: 0,
    });
    onClose();
    setTokenAddress("")
  };

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
            onClick={() => onClose()}
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
        {tokenData.tokenSymbol ? (
          <TokenCard
            tokenIcon={tokenData.tokenLogoUrl}
            tokenName={tokenData.tokenName}
            tokenSymbol={tokenData.tokenSymbol}
            tokenBalance={0}
          />
        ) : (
          <></>
        )}

        <button
          onClick={addToken}
          disabled={isValidAddress ? false : true}
          className={` fixed left-1/2 translate-x-[-50%] bottom-2  flex justify-center items-center shadow-lg text-white    border-2    rounded-lg  py-2 min-w-[300px] max-w-[315px] bg-gray-950 hover:bg-black ${
            isValidAddress
              ? "border-white text-white "
              : " text-opacity-50 bg-gray-950 border-gray-500"
          }`}
        >
          <h1 className="text-xl font-semibold tracking-wider">
            {!isValidAddress == true && tokenData.tokenAddress
              ? " Invalid Address"
              : " Add Token "}
          </h1>
        </button>
      </div>
    </>
  );
};

export default ImportTokenDrawer;
