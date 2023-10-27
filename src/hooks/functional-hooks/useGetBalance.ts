import { ethers } from "ethers";

export async function useGetBalance(provider: any, address: string, setBalance: any) {
    if (!provider) {
        return;
    }

    let balance = await provider.getBalance(address);
    balance = ethers.utils.formatEther(balance);

    setBalance(balance);
}
