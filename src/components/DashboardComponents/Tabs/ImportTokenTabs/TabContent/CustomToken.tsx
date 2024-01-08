import { useEffect, useState } from "react";
import { Search } from "react-feather";
import { ethers } from "ethers";
import localforage from "localforage";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

import TokenCard from "../../../../TokenCard";
import { useConfig } from "../../../../../context/ConfigProvider";
import {
  getTokenData,
  getItemFromStorage,
  generateSHA256Hash,
  log,
} from "../../../../../utils/helper";

type tokenDataT = {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogoUrl: string;
  tokenDecimal: number;
  balance: string;
};

const CustomToken = () => {
  const [isValidAddress, setIsValidAddress] = useState<any>(null);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [isValidTokenContract, setIsValidTokenContract] = useState<any>(null);

  const { chainId, provider, smartAccountAddress } = useConfig();
  const SCW = getItemFromStorage("smartAccount");

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const closeDrawer = () => {
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

    const _tokenData = await getTokenData(
      inputAddress,
      provider,
      smartAccountAddress,
    );

    if (!_tokenData) {
      setIsValidTokenContract(false);
    } else {
      setIsValidTokenContract(true);
      setTokenData({
        tokenAddress: inputAddress,
        tokenSymbol: _tokenData.symbol,
        tokenName: _tokenData.name,
        tokenLogoUrl: `https://ui-avatars.com/api/?background=fff&color=000&rounded=true&bold=true&name=${_tokenData.symbol}`,
        tokenDecimal: _tokenData.decimals,
        balance: _tokenData.balance,
      });
    }
  };

  /// ADDING TOKEN IN THE CURRENT CHAIN ID

  const setTokenDataForKey = async (key: any, data: Array<any>) => {
    try {
      const currentData: Array<any> =
        (await localforage.getItem(generateSHA256Hash(key.toString()))) || [];
      const newTokenData = [...currentData, ...data];

      await localforage.setItem(
        generateSHA256Hash(key.toString()),
        newTokenData,
      );
    } catch (error) {
      log("Error setting token data:", error, "error");
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

  const getButtonText = () => {
    if (isValidTokenContract === "LOADING") {
      return <BeatLoader size={5} loading={true} color="#ffffff" />;
    }

    if (isValidAddress === false && tokenData.tokenAddress) {
      return "Invalid Address";
    }

    if (isValidTokenContract === false || isValidAddress === false) {
      return "Invalid Token";
    }

    return "Add Token";
  };

  return (
    <>
      <div className=" my-10  ">
        <p className="font-semibold text-[14px] text-center">
          Enter Token Address
        </p>

        <div className="flex items-center w-[90%] mx-auto border border-gray-300 rounded-lg mt-2 mb-3 p-2">
          <button className="min-w-fit  pr-1 opacity-60">
            <Search className="h-5 mx-auto my-auto" />
          </button>
          <input
            onChange={handelContractAddressInput}
            type="text"
            placeholder="Search..."
            className="w-full focus:outline-none pl-1 bg-transparent"
            value={tokenAddress}
            //   onChange={handleInputChange}
            //   onFocus={handleFocus}
          />
        </div>
      </div>
      <div className="flex justify-center max-w-[90%] mx-auto px-2">
        {tokenData.tokenSymbol && isValidTokenContract === true ? (
          <TokenCard
            tokenIcon={tokenData.tokenLogoUrl}
            tokenName={tokenData.tokenName}
            tokenSymbol={tokenData.tokenSymbol}
            tokenAddress={tokenData.tokenAddress}
            userAddress={SCW || smartAccountAddress}
          />
        ) : (
          <>
            <div className="font-medium text-center max-w-[80%] text-[14px]">
              Search using token address and then click on add token to add it
              to the token list
            </div>
          </>
        )}
      </div>

      <button
        onClick={addToken}
        disabled={!(isValidAddress === true && isValidTokenContract === true)}
        className={` fixed left-1/2 translate-x-[-50%] bottom-8  flex justify-center items-center shadow-lg text-white    border-2    rounded-lg  py-2 min-w-[300px] max-w-[315px] bg-gray-950 hover:bg-black ${
          isValidAddress === true && isValidTokenContract === true
            ? "border-white text-white "
            : " text-opacity-50 bg-gray-950 border-gray-500"
        }`}
      >
        <h1 className="text-xl font-semibold tracking-wider">
          {getButtonText()}
        </h1>
      </button>
    </>
  );
};

export default CustomToken;
