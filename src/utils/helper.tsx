/* eslint-disable array-callback-return */
import { toSvg } from "jdenticon";
import { ethers } from "ethers";
import { sha256 } from 'js-sha256';

import Chains from '../constants/chains';
import erc20ABI from "../constants/erc20ABI";

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

export const constructTransactionData: any = (transactions: any) => {
  let txns: any = [];

  transactions.map(({ to, args, value, from }: any) => {
    const contract = args.length ? new ethers.utils.Interface(erc20ABI) : null;
    const data = contract ? contract.encodeFunctionData('transfer', args) : '0x';
    const txn = { from, to, data, value: value ? ethers.utils.parseEther(value).toString() : '0' };

    txns.push(txn);
  });

  return txns;
}

export const constructFinalUserOp: any = async (smartAccountInstance: any, partialUserOp: any, gasFeeAddress: string) => {
  const paymaster = smartAccountInstance.paymaster;
  const feeQuotesResponse = await paymaster.getPaymasterFeeQuotesOrData(partialUserOp, { mode: 'ERC20', tokenList: [gasFeeAddress] });
  const requiredFeeQuotes = feeQuotesResponse.feeQuotes[0];
  const spender = feeQuotesResponse.tokenPaymasterAddress || '';

  let finalUserOp = await smartAccountInstance.buildTokenPaymasterUserOp(partialUserOp, { feeQuote: requiredFeeQuotes, spender, maxApproval: false });
  let paymasterServiceData = { mode: 'ERC20', feeTokenAddress: requiredFeeQuotes.tokenAddress };

  try {
    const paymasterAndDataWithLimits = await paymaster.getPaymasterAndData(finalUserOp, paymasterServiceData);
    finalUserOp.paymasterAndData = paymasterAndDataWithLimits.paymasterAndData;
  
    if (paymasterAndDataWithLimits.callGasLimit && paymasterAndDataWithLimits.verificationGasLimit && paymasterAndDataWithLimits.preVerificationGas) {
      finalUserOp.callGasLimit = paymasterAndDataWithLimits.callGasLimit;
      finalUserOp.verificationGasLimit = paymasterAndDataWithLimits.verificationGasLimit + 15000;
      finalUserOp.preVerificationGas = paymasterAndDataWithLimits.preVerificationGas;
    }
  
    return finalUserOp;
  } catch (e) {
    console.log('Error in constructing final user op : ', e);
    return null;
  }
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

  const contract = new ethers.Contract(tokenAddress, erc20ABI, provider);

  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = await contract.decimals();

  let balance = await contract.balanceOf(userAddress);
  balance = ethers.utils.formatUnits(balance, decimals);

  return { name, symbol, balance, decimals };
}

export const getTokenBalance = async (tokenAddress: string, provider: any, userAddress: string) => {
  const contract = new ethers.Contract(tokenAddress, erc20ABI, provider);
  const decimals = await contract.decimals();

  let balance = await contract.balanceOf(userAddress);
  balance = ethers.utils.formatUnits(balance, decimals);

  return balance.toString();
}

export const generateSHA256Hash = (data: string) => {
  return sha256(data);
}