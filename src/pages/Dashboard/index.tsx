/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  generateAddressIcon,
  getItemFromStorage,
  getShortDisplayString,
} from "../../utils/helper";
import { useConfig } from "../../context/ConfigProvider";
import Chains from "../../constants/chains";
import { useRecoilState } from "recoil";
import { transferState } from "../../state/TransferState";
import QRCodeModal from "../../components/QRCodeModal";

import swap from "../../assets/swap.png";
import bridge from "../../assets/rainbow.png";
import receive from "../../assets/arrow-down.png";
import send from "../../assets/arrow-up.png";

import copyAndPaste from "../../assets/copy.svg";

import toast, { Toaster } from "react-hot-toast";
import Loader from "../../components/common/Loader";

function Dashboard() {
  const [transferData, setTransferData] = useRecoilState(transferState);
  const [smartWalletAddress, setSmartWalletAddress] = useState<string>("");
  const [currentCoinName, setCurrentCoinName] = useState<string>("");
  const [qrcodemodal, setQrcodemodal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const item = getItemFromStorage("smartAccount");
  const chain = getItemFromStorage("network");

  const [SCW] = useState(item || null);
  const [chainId] = useState(chain || null);

  const { smartAccountAddress, provider, init, balance: { SCW: SCWBalance }, isConnected } = useConfig();
  const navigate = useNavigate();

  const storageChainId = getItemFromStorage("network");

  // Receve Button functions
  const openQrModal = () => {
    setQrcodemodal(true);
  };

  const closeQrModal = () => {
    setQrcodemodal(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(SCW || smartAccountAddress);
      toast.success("Text Copied To clipboard");
    } catch (error) {
      console.error("Copy failed due to: ", error);
    }
  };

  useEffect(() => {
    console.log({ isConnected });
    if (isConnected) {
      setIsLoading(false);
      console.log('CHANGED : ', { isConnected });
    }
  }, [isConnected]);

  useEffect(() => {
    async function initializeSmartWallet() {
      if (!smartAccountAddress) {
        init(chainId);
      }
    }

    setSmartWalletAddress(SCW || smartAccountAddress);

    initializeSmartWallet();

    // This is to clear the state if the user restarts the app and is on the dashboard.
    // Optimize it for better UX by using a chorme hook and calling a modal for cancel confirmation.
    setTransferData([]);

    if (provider && smartAccountAddress) setIsLoading(false);
  }, [smartAccountAddress, smartWalletAddress]);

  useEffect(() => {
    if (storageChainId) {
      const currentChain = Chains.filter((ch) => ch.chainId === storageChainId);
      setCurrentCoinName(currentChain?.[0]?.nativeAsset);
    } else {
      setCurrentCoinName(Chains?.[0]?.nativeAsset);
    }
  }, [storageChainId]);

  async function sendTx() {
    navigate(`/dashboard/transaction/add-address`);
  }

  return (
    <>
      <div className=" text-white mt-24 min-h-[210px]">
        <div className="flex justify-center mb-7 items-center">
          <img
            className=" h-7 rounder mr-3 border rounded-lg "
            src={generateAddressIcon(SCW || smartWalletAddress)}
            alt="address icon"
          />
          <h2 className="text-base font-bold">
            {getShortDisplayString(SCW || smartWalletAddress)}
          </h2>
          <img
            onClick={() => copyToClipboard()}
            className="h-5 ml-1"
            src={copyAndPaste}
            alt="copy"
          />
          <Toaster position="top-center" reverseOrder={false} />
        </div>
        <h3 className="text-center text-3xl font-extrabold">
          {SCWBalance} {currentCoinName}
        </h3>

        {/* Features Buttons  */}
        <div className="flex gap-8 justify-center item-center mt-10 text-center">
          <div className="flex flex-col justify-center item-center gap-2">
            <img
              onClick={() => openQrModal()}
              className="h-8 bg-white rounded-full p-1 shadow-lg border hover:bg-gray-100 hover:bg-opacity-90"
              src={receive}
              alt="receiveButton"
            />
            <h1 className="text-{15px} font-thin tracking-wider">Receive</h1>
          </div>
          <div className="flex flex-col justify-center item-center gap-2">
            <img
              onClick={() => sendTx()}
              className="h-8 bg-white rounded-full p-1 shadow-lg border hover:bg-gray-100 hover:bg-opacity-90"
              src={send}
              alt="sendButton"
            />
            <h1 className="text-{15px} font-thin tracking-wider">Send</h1>
          </div>
          <div className="flex flex-col justify-center item-center gap-2">
            <img
              className="h-8 bg-white rounded-full p-1 shadow-lg border hover:bg-gray-100 hover:bg-opacity-90"
              src={swap}
              alt="swapButton"
            />
            <h1 className="text-{15px} font-thin tracking-wider">Swap</h1>
          </div>
          <div className="flex flex-col justify-center item-center gap-2">
            <img
              className="h-8 bg-white rounded-full p-1 shadow-lg border hover:bg-gray-100 hover:bg-opacity-90"
              src={bridge}
              alt="bridgeButton"
            />
            <h1 className="text-{15px}  font-thin tracking-wider">Bridge</h1>
          </div>
        </div>
      </div>
      <QRCodeModal
        isOpen={qrcodemodal}
        onClose={closeQrModal}
        walletAddress={smartWalletAddress}
      />

      {isLoading ? <Loader /> : <></>}
    </>
  );
}

export default Dashboard;
