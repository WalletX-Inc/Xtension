/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useRecoilState } from "recoil";

import { transferState } from "../../state/TransferState";

import { useConfig } from "../../context/ConfigProvider";
import { useCoinBalance } from "../../hooks/functional-hooks";
import Chains from "../../constants/chains";
import QRCodeModal from "../../components/QRCodeModal";
import Loader from "../../components/common/Loader";
import {
  generateAddressIcon,
  getItemFromStorage,
  getShortDisplayString,
  getChainDetails,
} from "../../utils/helper";

import swap from "../../assets/swap.png";
import bridge from "../../assets/rainbow.png";
import receive from "../../assets/arrow-down.png";
import send from "../../assets/arrow-up.png";
import copyAndPaste from "../../assets/copy.svg";
import localforage from "localforage";

function Dashboard() {
  const [transferData, setTransferData] = useRecoilState(transferState);
  const [smartWalletAddress, setSmartWalletAddress] = useState<string>("");
  const [currentCoinName, setCurrentCoinName] = useState<string>("");
  const [qrcodemodal, setQrcodemodal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [currentCoinBalance, setCurrentCoinBalance] = useState<string>();
  const balanceFromIndexedDB: any = localforage.getItem("coinBalance");

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

  const { balance } = useCoinBalance(
    SCW || smartAccountAddress,
    true,
    chainDetails.wssRpc
  );

  const setBalanceInStorage = () => {
    const key = "coinBalance";
    localforage.getItem(key).then((coinData: any) => {
      console.log("The coin Data is #################### ", coinData);

      if (coinData && coinData[chainId]) {
        console.log(
          "The balance of current chain &&&&&&&&&&&&&&&&&&&&&&&&&&&&& ",
          coinData[chainId]
        );

        const savedBalance = coinData[chainId];
        console.log(savedBalance);

        // setCurrentCoinBalance(savedBalance);
        if (balance !== savedBalance) {
          console.log(
            "This is in the if state ment ||||||||||||||||||||||||| ",
            balance,
            savedBalance
          );

          // setCurrentCoinBalance(balance);
          const updatedObject = { ...coinData, [chainId]: balance };

          localforage.setItem(key, updatedObject);
        }
      } else {
        const newObject = { ...coinData, [chainId]: balance };
        localforage.setItem(key, newObject);
        // setCurrentCoinBalance(balance);
      }
    });
  };

  useEffect(() => {
    console.log(
      "THIS IS THE USE EFFECT FOR BALANCE UPDATE AND SAVE IN THE INDEXED DB"
    );

    setBalanceInStorage();
  }, [chainId, balance]);

  /// COIN BALANCE STORING IN  Indexed DB

  // const setCoinBalanceInStorage = async (coinData: any) => {
  //   let key = "coinBalance";

  //   const coinBalance: any = await localforage.getItem(key);
  //   if (coinBalance) {
  //     coinBalance[coinData.chain] = coinData.balance;
  //     await localforage.setItem(key, coinBalance);
  //     console.log(coinBalance);
  //   } else {
  //     const newCoinBlance = { [coinData.chain]: coinData.balance };
  //     await localforage.setItem(key, newCoinBlance);
  //     console.log(newCoinBlance);
  //   }
  // };

  // const getAndSetCoinBalanceInStorage = () => {
  //   let key = "coinBalance";
  //   localforage.getItem(key).then((balanceData: any) => {
  //     if (balanceData && balanceData[chainId]) {
  //       const currentBalanceData: any = balanceData[chainId];
  //       setCurrentCoinBalance(currentBalanceData); // this will update the current balance form the saved balance in the indexed db

  //       console.log("The balance is ############################", balance);
  //       console.log(
  //         "The currentCoinBalance is  ############################",
  //         currentCoinBalance
  //       );

  //       if (balance !== currentCoinBalance) {
  //         setCurrentCoinBalance(balance);
  //         console.log(
  //           "balance in getAndSetCoinBalanceInStorage function",
  //           balance
  //         );

  //         setCoinBalanceInStorage({ chain: chainId, balance: balance });
  //       }
  //     } else {
  //       console.log("This is the ELSE PART ");

  //       setCoinBalanceInStorage({ chain: chainId, balance: balance });
  //       setCurrentCoinBalance(balance);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   console.log("This is balance useEffect");
  //   getAndSetCoinBalanceInStorage();
  //   console.log(
  //     "This is the balance in the use effect of balance",
  //     currentCoinBalance
  //   );

  //   return () => {
  //     setCoinBalanceInStorage({ chain: chainId, balance: balance });
  //   };
  // }, [chainId, balance, currentCoinBalance]);

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

  async function sendTx() {
    navigate(`/dashboard/transaction/add-address`);
  }

  useEffect(() => {
    async function initializeSmartWallet() {
      if (!smartAccountAddress) {
        init(chainId);
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

  useEffect(() => {
    // This is to clear the state if the user restarts the app and is on the dashboard.
    // Optimize it for better UX by using a chorme hook and calling a modal for cancel confirmation.
    setTransferData([]);
  }, []);

  // console.log("Current coin balance is ", currentCoinBalance);
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
            className="h-5 ml-1 cursor-pointer"
            src={copyAndPaste}
            alt="copy"
          />
          <Toaster position="top-center" reverseOrder={false} />
        </div>
        <h3 className="text-center text-3xl font-extrabold">
          {!balanceFromIndexedDB[chainId] ? 0 : balanceFromIndexedDB[chainId]}{" "}
          {currentCoinName}
        </h3>

        {/* Features Buttons  */}
        <div className="flex gap-8 justify-center item-center mt-10 text-center">
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
        </div>
      </div>
      <QRCodeModal
        isOpen={qrcodemodal}
        onClose={closeQrModal}
        walletAddress={smartWalletAddress}
      />

      {isLoading || !isConnected ? <Loader /> : <></>}
    </>
  );
}

export default Dashboard;
