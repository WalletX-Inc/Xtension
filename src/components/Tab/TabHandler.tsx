import { useState, useEffect } from "react";

import Tab from "./";
import TabContainer from "./Tabs";
import TokenCard from "../TokenCard";
import Tokens from "../../constants/tokens";
import { useConfig } from "../../context/ConfigProvider";

type Token = {
  name: string;
  symbol: string;
  address: string;
  decimals: number | string;
  logoUri: string;
}

const TabHandler = () => {
  const [tokens, setTokens] = useState<Token[] | null>(null);

  const { chainId } = useConfig();

  useEffect(() => {
    const tokenList = Tokens[chainId] || [];
    setTokens(tokenList);
  }, [chainId])

  return (
    <div>
      <TabContainer>
        <Tab label="Tokens">
          <div className="pb-4">
            <h2 className="text-lg font-medium mb-2">Tokens</h2>
              {tokens && tokens.map((token: any) => (
                <TokenCard
                  tokenIcon={token.logoUri}
                  tokenName={token.name}
                  tokenSymbol={token.symbol}
                  tokenBalance={100}
                />
              ))}
          </div>
        </Tab>
        <Tab label="NFTs">
          <div className="py-4">
            <div className="relative mt-12">
              <h2 className="text-white text-3xl md:text-4xl font-bold flex flex-row justify-center items-center">
                Coming
                <div className="relative text-sm mx-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-caret-up-fill text-blue-500"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                  <div className="absolute -top-12 transform -rotate-45 text-blue-500">
                    <p className="font-light text-base text-white bg-blue-500 rounded-md px-2 py-0">
                      super
                    </p>
                  </div>
                </div>
                Soon
              </h2>
            </div>
          </div>
        </Tab>
        <Tab label="Transactions">
          <div className="py-4">
            <div className="relative mt-12">
              <h2 className="text-white text-3xl md:text-4xl font-bold flex flex-row justify-center items-center">
                Coming
                <div className="relative text-sm mx-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-caret-up-fill text-blue-500"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                  <div className="absolute -top-12 transform -rotate-45 text-blue-500">
                    <p className="font-light text-base text-white bg-blue-500 rounded-md px-2 py-0">
                      super
                    </p>
                  </div>
                </div>
                Soon
              </h2>
            </div>
          </div>
        </Tab>
      </TabContainer>
    </div>
  );
};

export default TabHandler;
