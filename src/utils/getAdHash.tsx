import { ethers } from "ethers";

export const getAdHash = async (provider: any, contractAddress: any, ABI: any) => {
    const contractInstance = new ethers.Contract(contractAddress, ABI, provider);
  
    const content = await contractInstance.getAdDetails('WalletX');
  
    return content;
  }