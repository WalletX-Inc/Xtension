import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function useCoinBalance(
  address: string,
  isActive: boolean,
  wssRpc: string,
) {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const provider = new ethers.providers.WebSocketProvider(wssRpc);

    if (!isActive) {
      provider.removeAllListeners("block");
      return;
    }

    provider.on("block", async () => {
      const userBalance = await provider.getBalance(address);
      const balanceInEther = ethers.utils.formatEther(userBalance);

      setBalance(balanceInEther);
    });
  }, [address, isActive]);

  return { balance };
}
