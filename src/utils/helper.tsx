import { ethers } from "ethers";
import { toSvg } from "jdenticon";

import Chains from "../constants/chains";
import Erc20ABI from "../constants/erc20ABI";

export const getItemFromStorage: any = (
  key: string,
  storage: string = "localStorage"
) => {
  let _window = window as any;
  const item: any = _window[storage].getItem(key);
  let result = null;
  try {
    result = item ? JSON.parse(item) : null;
  } catch {
    result = item;
  }
  return result;
};

export const setItemInStorage: any = (
  name: any,
  data: any,
  storage = "localStorage"
) => {
  let _window = window as any;
  _window[storage].setItem(name, JSON.stringify(data));
};

export const removeItemFromStorage: any = (
  name: any,
  storage = "localStorage"
) => {
  let _window = window as any;
  _window[storage].removeItem(name);
};

export const getShortDisplayString: any = (address: string) => {
  const firstFourDigit = address.slice(0, 4);
  const lastFourDigit = address.slice(address.length - 4);

  return (
    <>
      {firstFourDigit}...{lastFourDigit}
    </>
  );
};

export const generateAddressIcon = (address: string) => {
  const svgString = toSvg(address, 100);
  const svg = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svg);
  return url;
};

export const getChainDetails: any = (chainId: number) => {
  let chainData;

  Chains.forEach((chain: any) => {
    if (chain.chainId === chainId) {
      chainData = chain;
    }
  });

  return chainData;
}

const isValidContract = async (address: string, provider: any) => {
  const code = await provider.getCode(address);

  if (code === "0x") {
    return false;
  }

  return true;
}

export const getTokenData = async (tokenAddress: string, provider: any, userAddress: string) => {
  const isValid = await isValidContract(tokenAddress, provider);

  if (!isValid) {
    return null;
  }

  const contract = new ethers.Contract(tokenAddress, Erc20ABI, provider);

  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = await contract.decimals();

  let balance = await contract.balanceOf(userAddress);
  balance = ethers.utils.formatUnits(balance, decimals);

  return { name, symbol, balance, decimals };
}