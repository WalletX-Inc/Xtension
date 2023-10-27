import { useState, useEffect } from "react";

import Tab from "./";
import TabContainer from "./Tabs";
import TokenCard from "../TokenCard";
import Tokens from "../../constants/tokens";
import { useConfig } from "../../context/ConfigProvider";

import { Plus } from "react-feather";
import ImportTokenDrawer from "../ImportTokenDrawer";
import localforage from "localforage";
import { getItemFromStorage, generateSHA256Hash } from "../../utils/helper";

type Token = {
  name: string;
  symbol: string;
  address: string;
  decimals: number | string;
  logoUri: string;
};
type tokenDataT = {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenLogoUrl: string;
  tokenDecimal: number;
};
const TabHandler = () => {
  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [isImportTokenDrawerOpen, setIsImportTokenDrawerOpen] =
    useState<boolean>(false);
  const [tokenListFromIndexedDB, setTokenListFromIndexedDB] = useState<any>([]);

  const openImportTokenModal = () => {
    setIsImportTokenDrawerOpen(true);
  };

  const closeImportTokenDrawer = () => {
    setIsImportTokenDrawerOpen(false);
  };

  const chain = getItemFromStorage("network");
  const chainId = chain.toString();

  const { smartAccountAddress } = useConfig();
  const SCW = getItemFromStorage('smartAccount');

  // function to fetch the data form Indexed DB using localFORage
  const getTokenDataForKey = async (key: string) => {
    try {
      const data = await localforage.getItem(generateSHA256Hash(key.toString()));
      setTokenListFromIndexedDB(data);
      return data || [];
    } catch (error) {
      console.error("Error getting token data:", error);
      return [];
    }
  };

  useEffect(() => {
    const tokenList = Tokens[chainId] || [];
    setTokens(tokenList);

    async function fetchData() {
      const retrievedData = await getTokenDataForKey(chainId);
      setTokenListFromIndexedDB(retrievedData);
    }
    fetchData();
  }, [chainId, tokenListFromIndexedDB]);

  return (
    <div>
      <TabContainer>
        <Tab label="Tokens">
          <div className="max-h-[235px] overflow-y-scroll py-2 px-3">
            {tokens &&
              tokens.map((token: Token) => (
                <>
                  <TokenCard
                    tokenIcon={token.logoUri}
                    tokenName={token.name}
                    tokenSymbol={token.symbol}
                    tokenAddress={token.address}
                    userAddress={SCW || smartAccountAddress}
                  />
                </>
              ))}
            {tokenListFromIndexedDB &&
              tokenListFromIndexedDB.map((tokens: tokenDataT) => (
                <>
                  <TokenCard
                    tokenIcon={tokens.tokenLogoUrl}
                    tokenName={tokens.tokenName}
                    tokenSymbol={tokens.tokenSymbol}
                    tokenAddress={tokens.tokenAddress}
                    userAddress={SCW || smartAccountAddress}
                  />
                </>
              ))}

            <div className="flex flex-col gap-2 my-5">
              <button
                onClick={() => openImportTokenModal()}
                className="flex gap-1 justify-center items-center"
              >
                <Plus />
                <p className="hover:border-b border-gray-300 text-[17px] font-semibold">
                  Import Tokens
                </p>
              </button>
            </div>
          </div>
          <ImportTokenDrawer
            isOpen={isImportTokenDrawerOpen}
            onClose={closeImportTokenDrawer}
          />
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
