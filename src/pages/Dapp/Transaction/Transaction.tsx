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

export default function SignatureRequest() {
  const [smartWalletAddress, setSmartWalletAddress] = useState<string>("");
  const [transactionData, setTransactionData] = useState<any>({});
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

    log("SignatureRequest useEffect", { data, transactionData });
    if (data)
      setTransactionData({
        ...data.transactionData,
      });
  }, [
    transactionData.data,
    transactionData.from,
    transactionData.to,
    transactionData.value,
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

  const sendTransaction = async () => {
    if (
      transactionData?.from.toLowerCase() !==
      (SCW.toLowerCase() || smartAccountAddress.toLowerCase())
    ) {
      setTimeout(() => {
        rejectSignRequest("Not the correct signer address");
      }, 6000);
      return;
    }

    const isValid = await biometricAuth(dName.id);

    if (!isValid) {
      rejectSignRequest("Authentication Failed");
      return;
    }

    const transactions: any[] = [];
    const obj: any = {};

    obj.to = transactionData.to;
    obj.value = transactionData.value;
    obj.from = transactionData.from;
    obj.data = transactionData.data;

    transactions.push(obj);

    const partialUserOp = await smartAccountProvider.buildUserOp(transactions);
    const finalUserOp = partialUserOp;

    // log("Selected token For gas : ", selectedTokenForGas, "info");

    // if (
    //   selectedTokenForGas.tokenAddress.toString() !==
    //   "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    // ) {
    //   finalUserOp = await constructFinalUserOp(
    //     smartAccountProvider,
    //     finalUserOp,
    //     selectedTokenForGas.tokenAddress,
    //   );
    //   log("FINAL USEROP : ", finalUserOp, "info");
    // }

    try {
      const userOpResponse = await smartAccountProvider.sendUserOp(finalUserOp);

      const transactionDetails = await userOpResponse.wait();

      log("Transaction Details : ", transactionDetails, "success");
      EthProvider.onAccept(transactionDetails);
    } catch (e: any) {
      log("Error while sending batch txn : ", { e, msg: e.message }, "error");
      EthProvider.onCancel(e.message);
    }
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
              {JSON.stringify(transactionData)}
            </pre>
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="w-1/2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg flex justify-center m-auto
          transition duration-500 hover:scale-110 p-2"
              onClick={sendTransaction}
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
