import React, { useEffect, useState } from "react";
import TokenCardTransaction from "../TokenCardTransaction";
import Tokens from "../../constants/tokens";
import { generateSHA256Hash, getItemFromStorage } from "../../utils/helper";
import { useConfig } from "../../context/ConfigProvider";
import localforage from "localforage";
import { Plus } from "react-feather";
import ImportTokenDrawer from "../ImportTokenDrawer";

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

type tokenListParams = {
  isImportTokenDrawerAvaliable: boolean;
};

const TokenList = ({ isImportTokenDrawerAvaliable }: tokenListParams) => {
  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [tokenListFromIndexedDB, setTokenListFromIndexedDB] = useState<any>([]);
  const [isImportTokenDrawerOpen, setIsImportTokenDrawerOpen] =
    useState<boolean>(false);
  const chain = getItemFromStorage("network");
  const chainId = chain.toString();

  const { smartAccountAddress } = useConfig();
  const SCW = getItemFromStorage("smartAccount");

  const openImportTokenModal = () => {
    setIsImportTokenDrawerOpen(true);
  };
  const closeImportTokenDrawer = () => {
    setIsImportTokenDrawerOpen(false);
  };

  // function to fetch the data form Indexed DB using localFORage
  const getTokenDataForKey = async (key: string) => {
    try {
      const data = await localforage.getItem(
        generateSHA256Hash(key.toString())
      );
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

    if (!tokenListFromIndexedDB.length) fetchData();
  }, [chainId]);

  return (
    <>
      <div className="max-h-[275px] overflow-y-scroll  px-3">
        {tokens &&
          tokens.map((token: Token) => (
            <>
              <TokenCardTransaction
                tokenIcon={token.logoUri}
                tokenName={token.name}
                tokenSymbol={token.symbol}
                tokenAddress={token.address}
                tokenDecimal={token.decimals}
                userAddress={SCW || smartAccountAddress}
                isSelected={false}
                clickedTokenData={() => {}}
                index={0}
              />
            </>
          ))}
        {tokenListFromIndexedDB &&
          tokenListFromIndexedDB.map((token: tokenDataT) => (
            <>
              <TokenCardTransaction
                tokenIcon={token.tokenLogoUrl}
                tokenName={token.tokenName}
                tokenSymbol={token.tokenSymbol}
                tokenAddress={token.tokenAddress}
                tokenDecimal={token.tokenDecimal}
                userAddress={""}
                isSelected={false}
                clickedTokenData={() => {}}
                index={0}
              />
            </>
          ))}
        {isImportTokenDrawerAvaliable === true ? (
          <>
            <div className="flex flex-col gap-2 my-5 pb-5">
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
          </>
        ) : (
          <></>
        )}
      </div>

      <ImportTokenDrawer
        isOpen={isImportTokenDrawerOpen}
        onClose={closeImportTokenDrawer}
      />
    </>
  );
};

export default TokenList;
