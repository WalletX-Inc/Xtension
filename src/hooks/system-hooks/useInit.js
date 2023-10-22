/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

import { initiateSmartWallet } from "./initiateSmartWallet";
import { initiatePush } from "./initiatePush";
import { initiateEOA } from "./initiateEOA";
import { getItemFromStorage } from "../../utils/helper";
import { useAuth } from "./useAuth";
import { getChainDetails } from "../../utils/helper";

export default function useInit() {
  const [signer, setSigner] = useState(null);
  const [smartAccountProvider, setSmartAccountProvider] = useState(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState(null);
  const [pushUser, setPushUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [rpcUrl, setRpcUrl] = useState(null);
  const [bundlerUrl, setBundlerUrl] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [paymasterUrl, setPaymasterUrl] = useState(null);
  const [EOA, setEOA] = useState(null);
  const [EOABalance, setEOABalance] = useState(null);
  const [SCWBalance, setSCWBalance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const auth = useAuth();

  const isLoggedIn = auth.isLoggedIn;
  
  useEffect(() => {
    if (deviceId || chainId) {
      getEOA();
      setTimeout(async () => {
        await getPushInitializer()
      }, 2000);
    }
  }, [deviceId, chainId]);

  useEffect(() => {
    if (provider) {
      getSmartWalletHandler();
    }
  }, [provider]);

  function init(chainId) {
    setIsConnected(false)
    const chainData = getChainDetails(chainId);

    setRpcUrl(chainData.rpc);
    setBundlerUrl(chainData.bundlerUrl);
    setChainId(chainData.chainId);
    setPaymasterUrl(chainData.paymasterUrl);

    const device = getItemFromStorage('device');

    if (device?.id) {
      setDeviceId(device.id);
    }
  }

  const getEOA = initiateEOA(deviceId, setSigner, rpcUrl, setProvider, setEOA, setEOABalance);
  const getSmartWalletHandler = initiateSmartWallet(rpcUrl, bundlerUrl, chainId, paymasterUrl, signer, auth.login, setSmartAccountProvider, setSmartAccountAddress, provider, setSCWBalance, setIsConnected);
  const getPushInitializer = initiatePush(signer, setPushUser);

  return {
    isLoggedIn,
    smartAccountProvider,
    smartAccountAddress,
    provider,
    getSmartWalletHandler,
    getEOA,
    getPushInitializer,
    init,
    EOA,
    chainId,
    EOABalance,
    SCWBalance,
    isConnected,
  };
}