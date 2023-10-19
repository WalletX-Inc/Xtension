import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useAuth } from "../../hooks/useAuth";
import Modal from "../../components/common/Modal";
import logoIcon from "../../assets/icons/icon16.png";
import menuIcon from "../../assets/icons/menu.png";
import Button from "../../components/common/Button";
import { useConfig } from "../../context/ConfigProvider";
import { getItemFromStorage, getShortDisplayString, setItemInStorage } from "../../utils/helper";
import Chains from "../../constants/chains";
import {  ChevronDown, Plus } from "react-feather";

const navbarData = [
  {
    title: "Setup Recovery",
    subTitle: "coming soon",
    href: "/",
    cname:
      "font-medium opacity-60 w-full flex justify-center p-2.5 md:border-none md:p-0 md:w-auto pointer-events-none",
  },
  {
    title: "Setup MultiSig",
    subTitle: "coming soon",
    href: "/",
    cname:
      "font-medium opacity-60 w-full flex justify-center p-2.5 md:border-none md:p-0 md:w-auto pointer-events-none",
  },
  {
    title: "Log Out",
    href: "/logout",
    cname:
      "font-medium w-full flex justify-center p-2.5 md:border-none md:p-0 md:w-auto",
  },
];

export default function Header() {
  const [toggle, setToggle] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState<boolean>(false);
  const [openNetworkModal, setOpenNetworkModal] = useState<boolean>(false);
  const [balance, setBalance] = useState(0);
  const [defaultChainId] = useState<number>(80001);
  const [currentChainLogo, setCurrentChainLogo] = useState<string>("");
  const [currentCoinName, setCurrentCoinName] = useState<string>("");

  const [smartWalletAddress, setSmartWalletAddress] = useState<string>("")

  const item = getItemFromStorage("smartAccount");
  const storageChainId = getItemFromStorage("network");
  const [SCW] = useState(item || null);
  const [chainId, setChainId] = useState(storageChainId);

  const { smartAccountAddress, provider, init, EOA } = useConfig();

  useEffect(() => {
    if (storageChainId) {
      const currentChain = Chains.filter((ch) => ch.chainId === storageChainId);
      setCurrentChainLogo(currentChain?.[0]?.chainUri);
      setCurrentCoinName(currentChain?.[0]?.nativeAsset);
    } else {
      setCurrentChainLogo(Chains[0]?.chainUri);
      setCurrentCoinName(Chains?.[0]?.nativeAsset);
    }
  }, [storageChainId]);

  useEffect(() => {
    async function initializeSmartWallet() {
      if (!smartAccountAddress) {
        init(chainId || defaultChainId);
      } else {
        let balance = await provider.getBalance(SCW || smartAccountAddress);
        balance = ethers.utils.formatEther(balance);

        setBalance(balance);
      }
    }

    setSmartWalletAddress(SCW || smartAccountAddress);

    initializeSmartWallet();
  },[smartAccountAddress, smartWalletAddress]);

  const handleNetworkSwitch=(chainId: number, chainUri: string, nativeAsset: string)=> {
    setCurrentChainLogo(chainUri);
    setChainId(chainId);
    setCurrentCoinName(nativeAsset);
    init(chainId);
    setItemInStorage('network',chainId)
  }

  const navigate = useNavigate();
  const { logout } = useAuth();

  const showNav = (key?: string) => {
    if (key === "/logout") {
      logout();
      setItemInStorage("isLoggedIn", false);
      navigate("/register");
    }
    setToggle(!toggle);
  };

  // start mobile first plus facile
  return (
    <nav className="text-white fixed top-0 w-full bg-gray-700 items-center flex p-4">
      <div className="flex justify-between items-center w-full flex-wrap md:flex-nowrap">
        <h1
          className="flex align-center justify-center rounded text-xl font-bold cursor-pointer  hover:opacity-70 bg-black p-[5px]"
          onClick={() => {
            setOpenNetworkModal(true);
          }}
        >
          <img
            className="w-4 h-4 m-auto rounded-full"
            src={currentChainLogo}
            alt="ETH"
          />
          <ChevronDown className="ml-2" />
        </h1>
        <h1
          className="text-xl font-bold flex items-center cursor-pointer hover:opacity-70  hover:border-1 hover:border-gray-600 hover:shadow-lg rounded p-[3px]"
          onClick={() => {
            setOpenAccountModal(true);
          }}
        >
          Wallets
          <ChevronDown className="mx-3" />
        </h1>

        <button
          className="flex justify-end  hover:opacity-70"
          onClick={() => showNav()}
        >
          <img className="w-6" src={menuIcon} alt="X" />
        </button>
        <ul
          className={`${
            toggle
              ? "fixed flex flex-col top-[61px] right-0 text-white bg-gray-700 rounded-md"
              : " hidden"
          }  `}
        >
          {toggle &&
            navbarData.map((link, index) => {
              return (
                <li
                  key={index}
                  className={`relative flex flex-row items-center h-9 focus:outline-none  border-l-4 border-transparent pr-6 ${link.cname}`}
                >
                  <Link
                    className="inline-flex justify-center items-center ml-4"
                    to={link.href}
                    onClick={() => showNav(link.href)}
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
      <Modal
        isOpen={openAccountModal}
        onClose={() => {
          setOpenAccountModal(false);
        }}
        headerText="Select an Account"
      >
        <div
          className="py-3 px-3 sm:py-4 shadow-lg cursor-pointer"
          onClick={() => {
            setOpenAccountModal(false);
          }}
        >
          <div className="flex items-center space-x-4" style={{paddingTop: "20px", paddingBottom: "20px"}}>
            <div className="flex-shrink-0">
              <img
                className="w-8 h-8 rounded-full"
                src={logoIcon}
                alt="Wallet x"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate dark:text-white" >Smart Account</p>
              <p className="text-sm truncate dark:text-gray-400">
                {getShortDisplayString(SCW || setSmartWalletAddress)}
              </p>
            </div>
            <div className="flex flex-col text-right text-md">
              <div className="inline-flex items-center text-base font-semibold dark:text-white">
                {balance} {currentCoinName}
              </div>
            </div>
          </div>
          <hr />
          <div className="flex items-center space-x-4" style={{paddingTop: "20px", paddingBottom: "20px"}}>
            <div className="flex-shrink-0">
              <img
                className="w-8 h-8 rounded-full"
                src={logoIcon}
                alt="Wallet x"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate dark:text-white">EOA</p>
              <p className="text-sm truncate dark:text-gray-400">
                {EOA && getShortDisplayString(EOA)}
              </p>
            </div>
            <div className="flex flex-col text-right text-md">
              <div className="inline-flex items-center text-base font-semibold dark:text-white">
                {balance} {currentCoinName}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={openNetworkModal}
        onClose={() => {
          setOpenNetworkModal(false);
        }}
        headerText="Select an Network"
      >
        <div
          className="py-3 px-3 sm:py-4 shadow-lg cursor-pointer max-h-60 overflow-auto"
          onClick={() => {
            setOpenNetworkModal(false);
          }}
        >

          { Chains.map((chain) => {
            return (
              <button
                onClick={() =>
                  handleNetworkSwitch(chain.chainId, chain.chainUri, chain.nativeAsset)
                }
              >
                <div
                  className={`flex items-center space-x-4 ${
                    chain.chainId === storageChainId
                      ? "border-l-4 rounded border-gray-400"
                      : ""
                  } `}
                >
                  <div className="flex-shrink-0 ml-2">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={chain.chainUri}
                      alt="ETH"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate dark:text-white">
                      {chain.name}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          className="text-white bg-gray-900 border hover:bg-gray-950 rounded-3xl flex justify-center m-auto
        transition duration-500 hover:scale-110 mt-10"
          onClick={() => {
            setOpenNetworkModal(true);
          }}
        >
          <div className="p-2 flex justify-between items-center gap-5 font-bold">
            <Plus /> Add Network
          </div>
        </Button>
      </Modal>
    </nav>
  );
}
