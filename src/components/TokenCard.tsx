import { useEffect, useState } from "react";

import { getItemFromStorage, getChainDetails } from "../utils/helper";
import { useTokenBalance } from "../hooks/functional-hooks";

type tokenCardParams = {
  tokenIcon: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  userAddress: string;
};

const TokenCard = ({
  tokenIcon,
  tokenName,
  tokenSymbol,
  tokenAddress,
  userAddress,
}: tokenCardParams) => {
  const storageChainId = getItemFromStorage("network");
  const chainDetails = getChainDetails(storageChainId);

  const { balance } = useTokenBalance(
    tokenAddress,
    userAddress,
    true,
    chainDetails.wssRpc,
  );

  return (
    <div className="flex border item-center py-2 px-3 gap-3 bg-gray-800 rounded-xl text-white border-gray-500 hover:bg-black mt-2">
      <img className="h-8" src={tokenIcon} alt="token icon" />
      <div className="flex justify-between w-full">
        <div className="flex flex-col ">
          <p className="font-semibold tracking-wide">{tokenName}</p>
          <p className="text-sm font-semibold tracking-wide">{tokenSymbol}</p>
        </div>
        <p className="font-semibold place-self-center">
          {Number(balance) > 0 ? Number(balance).toFixed(8) : 0}
        </p>
      </div>
    </div>
  );
};

export default TokenCard;
