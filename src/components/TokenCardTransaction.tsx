import { useEffect, useState } from "react";

import { getTokenBalance } from "../utils/helper";
import { useConfig } from "../context/ConfigProvider";

type tokenCardParams = {
  tokenIcon: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenDecimal: string | number;

  userAddress: string;

  clickedTokenData: Function;
  isSelected?: boolean;
  index?: number;
};

const TokenCardTransaction = ({
  tokenIcon,
  tokenName,
  tokenSymbol,
  tokenAddress,
  tokenDecimal,

  userAddress,

  isSelected,
  clickedTokenData,
  index,
}: tokenCardParams) => {
  const [balance, setBalance] = useState<any>(0);
  const { provider } = useConfig();

  useEffect(() => {
    async function getBalance() {
      if (provider) {
        const balance = await getTokenBalance(
          tokenAddress,
          provider,
          userAddress,
        );
        setBalance(balance);
      }
    }

    getBalance();
  }, [provider]);

  return (
    <div
      onClick={() => {
        clickedTokenData([
          tokenName,
          tokenSymbol,
          tokenAddress,
          tokenDecimal,
          tokenIcon,
          balance,
        ]);
      }}
      className="max-w-[95%] mx-auto m-3"
    >
      <div
        className={`${
          isSelected
            ? ""
            : "border-2 border-solid border-black border-opacity-80"
        } flex gap-1 flex-row items-center bg-gray-800 rounded-xl shadow-md px-4 pt-2 pb-1 border `}
      >
        <div className=" min-w-[20%]">
          <img
            src={tokenIcon}
            alt="token Logo"
            className=" w-12 h-12 rounded-full object-cover mr-4 border-2"
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">{tokenSymbol}</p>
            <p className="text-lg font-semibold overflow-hidden text-gray-600">
              {tokenName}
            </p>
          </div>
          <div className="items-end">
            <p title="current Balance">{Number(balance).toFixed(5)}</p>
            <p title="balance in dollars"></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCardTransaction;
