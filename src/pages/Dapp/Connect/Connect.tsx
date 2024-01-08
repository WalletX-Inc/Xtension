import { useEffect, useState } from "react";
import Store from "../../../dapp-connection/js/components/StoreComponent";
import EthProvider from "../../../dapp-connection/js/services/EthProvider";
import { useConfig } from "../../../context/ConfigProvider";
import {
  generateAddressIcon,
  getItemFromStorage,
  getShortDisplayString,
  getChainDetails,
} from "../../../utils/helper";
import {
  validateBiometric,
  useCoinBalance,
} from "../../../hooks/functional-hooks";

type ConnectRequestDataType = {
  connect_title: string | null;
  connect_origin: string | null;
};

export default function DappConnect() {
  const [smartWalletAddress, setSmartWalletAddress] = useState<string>("");
  const [dappData, setDappData] = useState<ConnectRequestDataType>({
    connect_title: null,
    connect_origin: null,
  });
  const biometricAuth = validateBiometric();
  const devices = getItemFromStorage("devices");
  const dName = devices[0];

  const { getSmartWalletHandler, smartAccountAddress, init } = useConfig();
  const item = getItemFromStorage("smartAccount");
  const chainIDFromStorage = getItemFromStorage("network");

  const [SCW] = useState(item || null);
  const [chainId] = useState(chainIDFromStorage || null);

  const chainDetails = getChainDetails(chainIDFromStorage);

  const { balance } = useCoinBalance(
    SCW || smartAccountAddress,
    true,
    chainDetails.wssRpc,
  );

  useEffect(() => {
    const data: any = Store.getTempState();

    // log("Connect dapp request useEffect", { data, dappData });
    if (data)
      setDappData({
        connect_title: data.connect_title,
        connect_origin: data.connect_origin,
      });
  }, [dappData.connect_title, dappData.connect_origin]);

  const rejectConnectionRequest = (reason: string | null = null) => {
    EthProvider.onCancel(reason);
  };

  useEffect(() => {
    async function initializeSmartWallet() {
      if (!smartAccountAddress) {
        init(chainId);
      }
    }

    setSmartWalletAddress(SCW || smartAccountAddress);

    initializeSmartWallet();
    getSmartWalletHandler();

    // if (provider && smartAccountAddress) setIsLoading(false);
  }, [smartAccountAddress, smartWalletAddress]);

  const connectWallet = async () => {
    const isValid = await biometricAuth(dName.id);

    if (!isValid) {
      rejectConnectionRequest("Authentication Failed");
      return;
    }

    EthProvider.onAccept({
      address: SCW || smartAccountAddress,
      chainId,
      isConnected: true,
      balance,
      chainDetails,
    });
  };

  return (
    <div className="container mt-3">
      <a
        href={`${dappData.connect_origin}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center mb-6"
      >
        <span className=" mt-2 rounded-t-3xl bg-gray-700 underline mb-4  py-3 px-6 font-medium">
          {dappData.connect_origin}
        </span>{" "}
      </a>
      <h2 className="text-2xl font-bold text-center mb-8">
        Connect with {dappData.connect_title}
      </h2>
      <div className="max-w-[86%] mx-auto m-3 mb-">
        <div
          className={`flex flex-row gap-3 items-center bg-gray-800 text-white rounded-xl shadow-md px-4 py-2 border border-gray-700  border-solid
          `}
        >
          <div className="flex items-center">
            <input
              checked
              id="checked-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="checked-checkbox"
              className="text-sm font-medium text-gray-900 dark:text-gray-300"
            ></label>
          </div>
          <img
            src={generateAddressIcon("bhumik")}
            alt="Address Logo"
            className="w-12 rounded-xl object-cover mr-3 border"
          />

          <div className="min-w-[80%] text-lg">
            <p className=" font-semibold">
              Account 1
              <span className="font-semibold overflow-hidden ">
                {getShortDisplayString(SCW || smartWalletAddress)}
              </span>{" "}
            </p>
            <p>0 MATIC</p>
          </div>
        </div>
      </div>
      <h2 className="text-lg text-center mb-2 mt-[110px] ">
        Only connect with the sites you trust.
        <span className="text-blue-500 ml-1 cursor-pointer">Learn more</span>
      </h2>
      <hr className="my-3 mx-7 text-gray-700" />
      <div className="flex justify-center mt-8">
        <button
          className="w-36 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md ml-4"
          onClick={() => rejectConnectionRequest()}
        >
          Cancel
        </button>
        <button
          className="w-36 text-white bg-gray-700 hover:bg-gray-600 rounded-lg flex justify-center m-auto
          transition duration-500 hover:scale-110 p-2"
          onClick={connectWallet}
        >
          Connect
        </button>
      </div>
    </div>
  );
}
