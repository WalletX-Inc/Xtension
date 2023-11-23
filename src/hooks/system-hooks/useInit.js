/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

import { initiateSmartWallet } from "./initiateSmartWallet";
import { initiateEOA } from "./initiateEOA";
import { getItemFromStorage } from "../../utils/helper";
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
  const [isInitialised, setIsInitialised] = useState(false);
  const [chainData, setChainData] = useState(null);

  const auth = useAuth();

  const isLoggedIn = auth.isLoggedIn;

  useEffect(() => {
    if (deviceId || chainId) {
      console.log("in getEOA");
      getEOA();
    }
  }, [deviceId, chainId]);

  useEffect(() => {
    if (provider) {
      setIsInitialised(true);
      getSmartWalletHandler();
    } else {
      // setIsL
    }
  }, [provider]);

  function init(chainId, deviceName) {
    setIsConnected(false);
    const chainData = getChainDetails(chainId);
    setRpcUrl(chainData.rpc);
    setBundlerUrl(chainData.bundlerUrl);
    setChainId(chainData.chainId);
    setPaymasterUrl(chainData.paymasterUrl);
    setChainData(chainData);

    const devices = getItemFromStorage("devices");
    const filter = devices.filter((d) => d.name === deviceName)?.[0];
    // const device = getItemFromStorage(generateSHA256Hash('device'));
    if (filter?.id) {
      setDeviceId(filter.id);
    }
  }

  const getEOA = initiateEOA(
    deviceId,
    setSigner,
    rpcUrl,
    setProvider,
    setEOA,
    setEOABalance
  );
  const getSmartWalletHandler = initiateSmartWallet(
    rpcUrl,
    bundlerUrl,
    chainId,
    paymasterUrl,
    signer,
    auth.login,
    setSmartAccountProvider,
    setSmartAccountAddress,
    provider,
    setSCWBalance,
    setIsConnected,
    isInitialised,
    deviceId
  );

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
    chainData,
  };
}
