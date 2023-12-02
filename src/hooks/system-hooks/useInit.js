import { useState, useEffect } from "react";

import initiateSmartWallet from "./initiateSmartWallet";
import initiateEOA from "./initiateEOA";
import { getItemFromStorage, getChainDetails } from "../../utils/helper";
import { useAuth } from "./useAuth";

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
  const [isInitialized, setisInitialized] = useState(false);
  const [chainData, setChainData] = useState(null);

  const auth = useAuth();

  const { isLoggedIn } = auth;

  function init(_chainId, _deviceName) {
    setIsConnected(false);
    const _chainData = getChainDetails(_chainId);

    setRpcUrl(_chainData.rpc);
    setBundlerUrl(_chainData.bundlerUrl);
    setChainId(_chainData.chainId);
    setPaymasterUrl(_chainData.paymasterUrl);
    setChainData(_chainData);

    const devices = getItemFromStorage("devices");
    const filter = devices.filter((d) => d.name === _deviceName)?.[0];

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
    setEOABalance,
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
    isInitialized,
    deviceId,
  );

  useEffect(() => {
    if (deviceId || chainId) {
      getEOA();
    }
  }, [deviceId, chainId]);

  useEffect(() => {
    if (provider) {
      setisInitialized(true);
      getSmartWalletHandler();
    } else {
      // setIsL
    }
  }, [provider]);

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
    isInitialized,
    chainData,
  };
}
