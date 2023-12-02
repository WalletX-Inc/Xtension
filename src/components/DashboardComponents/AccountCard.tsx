import { useState, useEffect } from "react";
import {
  generateAddressIcon,
  getItemFromStorage,
  getShortDisplayString,
  getChainDetails,
} from "../../utils/helper";
import { useCoinBalance } from "../../hooks/functional-hooks";
import { useConfig } from "../../context/ConfigProvider";
import toast from "react-hot-toast";
import Chains from "../../../src/constants/chains";

import copy from "../../../src/assets/copy.svg";

const AccountCard = () => {
  const [smartWalletAddress, setSmartWalletAddress] = useState<string>("");
  const [currentChainLogo, setCurrentChainLogo] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentCoinName, setCurrentCoinName] = useState<string>("");
  const { getSmartWalletHandler, smartAccountAddress, provider, init } =
    useConfig();
  const item = getItemFromStorage("smartAccount");
  const chainIDFromStorage = getItemFromStorage("network");

  const [SCW] = useState(item || null);
  const [chainId] = useState(chainIDFromStorage || null);
  const chainDetails = getChainDetails(chainIDFromStorage);

  const { balance } = useCoinBalance(
    SCW || smartAccountAddress,
    true,
    chainDetails.wssRpc,
  );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(SCW || smartAccountAddress);
      toast.success("Text Copied To clipboard");
    } catch (error) {
      console.error("Copy failed due to: ", error);
    }
  };

  useEffect(() => {
    async function initializeSmartWallet() {
      if (!smartAccountAddress) {
        init(chainId);
      }
    }

    setSmartWalletAddress(SCW || smartAccountAddress);

    initializeSmartWallet();
    getSmartWalletHandler();

    if (provider && smartAccountAddress) setIsLoading(false);
  }, [smartAccountAddress, smartWalletAddress]);

  useEffect(() => {
    if (chainIDFromStorage) {
      const currentChain = Chains.filter(
        (ch) => ch.chainId === chainIDFromStorage,
      );
      setCurrentCoinName(currentChain?.[0]?.nativeAsset);
    } else {
      setCurrentCoinName(Chains?.[0]?.nativeAsset);
    }
  }, [chainIDFromStorage]);

  useEffect(() => {
    if (chainIDFromStorage) {
      const currentChain = Chains.filter(
        (ch) => ch.chainId === chainIDFromStorage,
      );
      setCurrentChainLogo(currentChain?.[0]?.chainUri);
      setCurrentCoinName(currentChain?.[0]?.nativeAsset);
    } else {
      setCurrentChainLogo(Chains[0]?.chainUri);
      setCurrentCoinName(Chains?.[0]?.nativeAsset);
    }
  }, [currentChainLogo, chainIDFromStorage]);

  return (
    <>
      <div className="flex flex-col  border shadow-md bg-gray-800 rounded-xl px-2 py-2 max-w-[300px] mx-auto text-white  mb-7">
        {/* Account Details  */}
        <div className=" flex justify-between  mb-4 mt-1 ">
          <div className="w-[75%] flex gap-3 m-auto ">
            <div className="flex justify-center item-center">
              <img
                className="h-10 border rounded-lg ml-2"
                src={generateAddressIcon(SCW || smartWalletAddress)}
                alt="profile icon"
              />
            </div>
            <div className="flex flex-col justify-center mx-auto">
              <p className="flex text-xl font-semibold text-gray-200  ">
                {getShortDisplayString(SCW || smartWalletAddress)}
                <span className=" m-auto">
                  <img
                    onClick={() => copyToClipboard()}
                    className="h-6 ml-1 m-auto"
                    src={copy}
                    alt="copy and paste"
                  />
                </span>
              </p>
            </div>
          </div>
        </div>
        <hr className="w-[95%] mx-auto" />
        {/* Account Balance  */}
        <div className="text-center font-extrabold mt-2 text-2xl text-gray-200">
          {!balance ? 0 : balance} {currentCoinName}
        </div>
      </div>
    </>
  );
};

export default AccountCard;
