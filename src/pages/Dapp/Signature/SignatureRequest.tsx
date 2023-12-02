import { useEffect, useState } from "react";
import Store from "../../../dapp-connection/js/components/StoreComponent";
import icon128 from "../../../assets/icons/mainLogo.png";
import EthProvider from '../../../dapp-connection/js/services/EthProvider'

type SignatureRequestDataType = {
  address: String;
  message: String;
  connect_title: String | null;
  connect_origin: String | null;
};

export default function SignatureRequest() {
  const [dappData, setDappData] = useState<SignatureRequestDataType>({
    address: "",
    message: "",
    connect_title: null,
    connect_origin: null,
  });

  useEffect(() => {
    const data = Store.getState();
    console.log({ data });
    setDappData(dappData);
  }, [Store.getState()]);

  const rejectSignRequest = () => {
    EthProvider.onCancel();
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center">
            WalletX Signature Request
          </h2>
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
            >
              Sign
            </button>
            <button className="w-1/2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md ml-4" onClick={rejectSignRequest}>
              Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
