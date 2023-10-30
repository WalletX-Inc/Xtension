import { useEffect, useState } from "react";

import { getItemFromStorage, getChainDetails } from "../utils/helper";
import { useTokenBalance } from "../hooks/functional-hooks";
import localforage from "localforage";
import { useConfig } from "../context/ConfigProvider";

type tokenCardParams = {
  tokenIcon: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenBalance: number;
  userAddress: string;
};

const TokenCard = ({
  tokenIcon,
  tokenName,
  tokenSymbol,
  tokenAddress,
  tokenBalance,
  userAddress,
}: tokenCardParams) => {
  // const storageChainId = getItemFromStorage("network"); // can use the chain id from the context given below
  const { chainId } = useConfig();
  const chainDetails = getChainDetails(chainId);

  const { balance } = useTokenBalance(
    tokenAddress,
    userAddress,
    true,
    chainDetails.wssRpc
  );

  const updateBalanceInLocalForage = (newBalance: number) => {
    localforage.getItem("TokensList").then((tokensList: any) => {
      if (tokensList && tokensList[chainId]) {
        const updatedTokens = tokensList[chainId].map((token: any) => {
          if (token.address === tokenAddress) {
            console.log(token.address);
            console.log("New Balance", newBalance);

            return { ...token, balance: newBalance };
          }
          return token;
        });

        tokensList[chainId] = updatedTokens;

        localforage.setItem("TokensList", tokensList);
      }
    });
  };

  useEffect(() => {
    updateBalanceInLocalForage(Number(balance));
  }, [balance]);

  return (
    <div className="flex border item-center py-2 px-3 gap-3 bg-gray-800 rounded-xl text-white border-gray-500 hover:bg-black mt-2">
      <img className="h-8" src={tokenIcon} alt="token icon" />
      <div className="flex justify-between w-full">
        <div className="flex flex-col ">
          <p className="font-semibold tracking-wide">{tokenName}</p>
          <p className="text-sm font-semibold tracking-wide">{tokenSymbol}</p>
        </div>
        <p className="font-semibold place-self-center">
          {tokenBalance > 0 ? tokenBalance.toFixed(8) : 0}
        </p>
      </div>
    </div>
  );
};

export default TokenCard;
