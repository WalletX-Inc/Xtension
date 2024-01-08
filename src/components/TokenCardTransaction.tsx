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

  clickedTokenData: (data?: any) => any;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isSelected,
  clickedTokenData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index,
}: tokenCardParams) => {
  const [balance, setBalance] = useState<any>(0);
  const { provider } = useConfig();

  useEffect(() => {
    async function getBalance() {
      if (provider) {
        const tokenBalance = await getTokenBalance(
          tokenAddress,
          provider,
          userAddress,
        );

        setBalance(tokenBalance);
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
      className=" mx-auto "
    >
      <div
        className={
          "flex gap-1 flex-row items-center hover:bg-gray-700  hover:bg-opacity-50  px-4 pt-3 pb-4  "
        }
      >
        <div>
          <img
            src={tokenIcon}
            alt="token Logo"
            className=" w-9 rounded-full object-cover mr-4 border-2"
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <div>
            <p className="text-[14px] font-semibold">{tokenName}</p>
            <p className="text-[12px] font-semibold overflow-hidden text-gray-600">
              {tokenSymbol}
            </p>
          </div>
          <div className="items-end text-base">
            <p title="current Balance">{Number(balance).toFixed(5)}</p>
            <p title="balance in dollars"></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCardTransaction;
