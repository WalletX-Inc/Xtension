/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

import { initiateSmartWallet } from "./initiateSmartWallet";
import { initiateEOA } from "./initiateEOA";
import { getItemFromStorage, generateSHA256Hash } from "../../utils/helper";
import { useAuth } from "./useAuth";
import { getChainDetails } from "../../utils/helper";

export default function useInit() {
  const [signer, setSigner] = useState(null);
  const [smartAccountProvider, setSmartAccountProvider] = useState(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState(null);
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
  const [isInitialised, setIsInitialised] = useState(false)

  const auth = useAuth();

  const isLoggedIn = auth.isLoggedIn;
  
  useEffect(() => {
    if (deviceId || chainId) {
      getEOA();
    }
  }, [deviceId, chainId]);

  useEffect(() => {
    if (provider) {
      setIsInitialised(true)
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

    const device = getItemFromStorage(generateSHA256Hash('device'));

    if (device?.id) {
      setDeviceId(device.id);
    }
  }

  const getEOA = initiateEOA(deviceId, setSigner, rpcUrl, setProvider, setEOA, setEOABalance);
  const getSmartWalletHandler = initiateSmartWallet(rpcUrl, bundlerUrl, chainId, paymasterUrl, signer, auth.login, setSmartAccountProvider, setSmartAccountAddress, provider, setSCWBalance, setIsConnected,isInitialised);

  return {
    isLoggedIn,
    smartAccountProvider,
    smartAccountAddress,
    provider,
    getSmartWalletHandler,
    getEOA,
    init,
    EOA,
    chainId,
    EOABalance,
    SCWBalance,
    isConnected,
    isInitialised, 
  };
}