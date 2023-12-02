import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { getTokenBalance } from "../../utils/helper";

export default function useTokenBalance(
  tokenAddress: string,
  userAddress: string,
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
      const tokenBalance = await getTokenBalance(
        tokenAddress,
        provider,
        userAddress,
      );

      setBalance(tokenBalance);
    });
  }, [tokenAddress, isActive]);

  return { balance };
}
