/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import toast, { Toaster } from "react-hot-toast";
import { transferState } from "../../state/TransferState";
import {
  generateAddressIcon,
  getItemFromStorage,
  getShortDisplayString,
  getChainDetails,
  log,
} from "../../utils/helper";
import { useConfig } from "../../context/ConfigProvider";
import Chains from "../../constants/chains";
import QRCodeModal from "../../components/QRCodeModal";
import { useCoinBalance } from "../../hooks/functional-hooks";

import copyAndPaste from "../../assets/copy.svg";

import Loader from "../../components/common/Loader";
import Footer from "../DashboardLayout/Footer";
import AccountCard from "../../components/DashboardComponents/AccountCard";
import Header from "../DashboardLayout/Header";
import TokenList from "../../components/DashboardComponents/TokenList";
import ImportTokenDrawer from "../../components/ImportTokenDrawer";

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

  const {
    getSmartWalletHandler,
    smartAccountAddress,
    provider,
    init,
    isConnected,
  } = useConfig();
  const navigate = useNavigate();
  const storageChainId = getItemFromStorage("network");
  const chainDetails = getChainDetails(storageChainId);
  const allDevices = getItemFromStorage("devices");
  const smartAddress = getItemFromStorage("smartAccount");
  const { balance } = useCoinBalance(
    SCW || smartAccountAddress,
    true,
    chainDetails.wssRpc,
  );

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
      log("Copy failed due to: ", error, "error");
    }
  };

  useEffect(() => {
    async function initializeSmartWallet() {
      if (!smartAccountAddress) {
        const myDevice = allDevices?.filter(
          (d: any) => d.address === smartAddress,
        )?.[0];

        init(chainId, myDevice?.name);
      }
    }

    setSmartWalletAddress(SCW || smartAccountAddress);

    setTransferData([]);

    initializeSmartWallet();
    getSmartWalletHandler();

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
      {/* <Header /> */}

      <Header />
      {/* The below div is used because the accoutCard is called at 2 places and mt-20 breaks it there */}
      <div className="mt-20">
        <AccountCard />
      </div>
      <div className=" pb-36 ">
        <h1 className="text-xl font-semibold tracking-wider pb-2 px-5">
          Tokens
        </h1>

        <TokenList isImportTokenDrawerAvaliable={true} />
      </div>

      <>
        {/* <div className="flex justify-center mb-7 items-center">
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
            className="h-5 ml-1 cursor-pointer"
            src={copyAndPaste}
            alt="copy"
          />
          <Toaster position="top-center" reverseOrder={false} />
        </div>
        <h3 className="text-center text-3xl font-extrabold">
          {!balance ? 0 : balance} {currentCoinName}
        </h3> */}

        {/* Features Buttons  */}
        {/* <div className="flex gap-8 justify-center item-center mt-10 text-center">
          <div className="flex flex-col justify-center item-center gap-2 cursor-pointer">
            <img
              onClick={() => openQrModal()}
              className="h-8 bg-white rounded-full  p-1 shadow-lg border hover:bg-gray-100 hover:bg-opacity-90"
              src={receive}
              alt="receiveButton"
            />
            <h1 className="text-{15px} font-thin tracking-wider">Receive</h1>
          </div>
          <div className="flex flex-col justify-center item-center gap-2 cursor-pointer">
            <img
              onClick={() => sendTx()}
              className="h-8 bg-white rounded-full p-1 shadow-lg border hover:bg-gray-100 hover:bg-opacity-90"
              src={send}
              alt="sendButton"
            />
            <h1 className="text-{15px} font-thin tracking-wider">Transfer</h1>
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
        </div> */}
        {/* <QRCodeModal
        isOpen={qrcodemodal}
        onClose={closeQrModal}
        walletAddress={smartWalletAddress}
      /> */}
      </>

      {/* <Footer /> */}
      {isLoading || !isConnected ? <Loader /> : <></>}
    </>
  );
}

export default Dashboard;
