import { useEffect, useState } from "react";
import Store from "../../../dapp-connection/js/components/StoreComponent";
import icon128 from "../../../assets/icons/mainLogo.png";
import EthProvider from "../../../dapp-connection/js/services/EthProvider";
import { useConfig } from "../../../context/ConfigProvider";
import {
  getItemFromStorage,
  getShortDisplayString,
  log,
} from "../../../utils/helper";
import { validateBiometric } from "../../../hooks/functional-hooks";

type SignatureRequestDataType = {
  address: string;
  message: string;
  connect_title: string | null;
  connect_origin: string | null;
};

export default function SignatureRequest() {
  const [smartWalletAddress, setSmartWalletAddress] = useState<string>("");
  const [dappData, setDappData] = useState<SignatureRequestDataType>({
    address: "",
    message: "",
    connect_title: null,
    connect_origin: null,
  });
  const biometricAuth = validateBiometric();
  const devices = getItemFromStorage("devices");
  const dName = devices[0];

  const {
    smartAccountProvider,
    getSmartWalletHandler,
    smartAccountAddress,
    init,
  } = useConfig();
  const item = getItemFromStorage("smartAccount");
  const chainIDFromStorage = getItemFromStorage("network");

  const [SCW] = useState(item || null);
  const [chainId] = useState(chainIDFromStorage || null);

  useEffect(() => {
    const data: any = Store.getTempState();

    log("SignatureRequest useEffect", { data });
    if (data)
      setDappData({
        address: data.address,
        message: data.message,
        connect_title: data.connect_title,
        connect_origin: data.connect_origin,
      });
  }, [
    dappData.address,
    dappData.message,
    dappData.connect_title,
    dappData.connect_origin,
  ]);

  const rejectSignRequest = (reason: string | null = null) => {
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

  const userSignMessage = async () => {
    if (dappData.address !== (SCW || smartAccountAddress)) {
      rejectSignRequest("Not the correct signer address");
      return;
    }

    const isValid = await biometricAuth(dName.id);

    if (!isValid) {
      rejectSignRequest("Authentication Failed");
      return;
    }

    const signMessageResponse = await smartAccountProvider.signMessage(
      dappData?.message,
    );

    EthProvider.onAccept(signMessageResponse);
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center">
            WalletX Signature Request
          </h2>
          <h1> {getShortDisplayString(SCW || smartWalletAddress)}</h1>
          <img src={icon128} alt="WalletX" className="h-16 m-auto my-8" />
          <h2 className="text-xl text-center mb-2">Signature Request</h2>
          <p className="text-center mb-3">
            Only sign this message if you fully understand the content and trust
            the requesting site.
          </p>
          <hr className="my-2" />
          <p className="text-center text-lg font-bold">You are signing:</p>
          <div className="bg-gray-500 my-3 text-center rounded-lg">
            <h4>Message</h4>
            <pre className="text-center overflow-auto rounded-md p-3">
              {dappData?.message}
            </pre>
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="w-1/2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg flex justify-center m-auto
          transition duration-500 hover:scale-110 p-2"
              onClick={userSignMessage}
            >
              Sign
            </button>
            <button
              className="w-1/2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md ml-4"
              onClick={() => rejectSignRequest(null)}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
