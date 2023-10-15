import { useState, useEffect } from "react";
import { ethers } from "ethers";

import logoIcon from "../../assets/icons/icon16.png";
import { getItemFromStorage, getShortDisplayString } from "../../utils/helper";
import { useConfig } from "../../context/ConfigProvider";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [smartWalletAddress, setSmartWalletAddress] = useState<string>("")

  const item = getItemFromStorage("smartAccount");
  const [SCW, setSCW] = useState(item || null);

  const { getSmartWalletHandler, smartAccountAddress, provider } = useConfig();

  useEffect(() => {
    async function initializeSmartWallet() {
      if (!SCW||!smartAccountAddress) {
        await getSmartWalletHandler();
        setSCW(smartAccountAddress);
      } else {
        let balance = await provider.getBalance(SCW || smartAccountAddress);
        balance = ethers.utils.formatEther(balance);

        setBalance(balance);
      }
    }

    setSmartWalletAddress(SCW || smartAccountAddress)

    initializeSmartWallet();
  }, [SCW, getSmartWalletHandler, provider, smartAccountAddress]);

  return (
    <>
      <div className=" text-white mt-24 min-h-[210px]">
        <div className="flex justify-center mb-7">
          <img className="w-7 h-7 rounder mr-3" src={logoIcon} alt="address" />
          <h2 className="text-2xl font-bold">
            {getShortDisplayString(SCW || smartWalletAddress)}
          </h2>
        </div>
        <h3 className="text-center text-3xl font-extrabold">{balance} ETH</h3>
      </div>
    </>
  );
}

export default Dashboard;
