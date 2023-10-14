import React, { useEffect, useState } from "react";
import backIcon from "../../assets/angle.svg";
import AddressesCard from "../../components/AddressCard";
import paste from "../../assets/copy&paste.png";
import search from "../../assets/search.png";
import add from "../../assets/add.png";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";
import { transferState } from "../../state/TransferState"
import { useNavigate } from "react-router";

import { toSvg } from "jdenticon";
const svgString = toSvg("helll", 100);
const svg = new Blob([svgString], { type: "image/svg+xml" });
const url = URL.createObjectURL(svg);


const AddAddresses = () => {
  const [transferData, setTransferData] = useRecoilState(transferState);

  const [enteredAddresses, setEnteredAddresses] = useState<string>("");
  const [sendToAddresses, setSendToAddresses] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const [isAddAddressesModalVisible, setIsAddAddressesModalVisible] =
    useState(false);
  const navigate = useNavigate();

  //function for opning the add Addresses modal

  const openAddAddressesModal = () => {
    setIsAddAddressesModalVisible(true);
  };
  const closeAddAddressesModal = () => {
    setIsAddAddressesModalVisible(false);
  };

  //call back functions that receives the address and index form the addressesCard component
  const receivedAddress = (address: string, index: number) => {
    setSendToAddresses(address);
  };

  const handleCardClick = (index: number | null) => {
    setEnteredAddresses("");
    if (selectedCardIndex === index) {
      setSelectedCardIndex(null);
      setSendToAddresses("");
    } else {
      setSelectedCardIndex(index);
    }
  };

  // Search Box functions
  const pasteAddresses = async () => {
    console.log("addressPasted");
    try {
      setSendToAddresses("");
      handleCardClick(null);
      console.log("lineBeforeClipboard  ");
      const address: string = await navigator.clipboard.readText();
      console.log("address");
      setEnteredAddresses(address);
      setIsValid(isEthereumAddress(address));
    } catch (error) {
      console.log("Copy failed due to: ", error);
    }
  };

  const isEthereumAddress = (address: string) => {
    console.log("chekcking the addresses");
    try {
      const validAddress = ethers.utils.isAddress(address);
      return validAddress;
    } catch (error) {
      return false;
    }
  };

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setEnteredAddresses(inputValue);
  };
  const handleFocus = () => {
    setSendToAddresses("");
    handleCardClick(null);
    console.log("focused hu");
  };

  const handelProceed = () => {
    const uuid = crypto.randomUUID();
    setTransferData((prevAddresses) => [
      ...prevAddresses,
      {
        uid: uuid,
        address: sendToAddresses,
        name: "",
        tokenName: "",
        tokenAddress: "",
        tokenSymbol: "",
        amount: 0,
        tokenDecimal: 0,
        tokenBalance: 0,
      },
    ]);
    console.log(transferData);
    navigate("/dashboard/send/add-tokens");
  };

  useEffect(() => {
    setIsValid(isEthereumAddress(enteredAddresses));
    if (isValid === true) setSendToAddresses(enteredAddresses);
  }, [enteredAddresses, selectedCardIndex, pasteAddresses, sendToAddresses]);

  return (
    <div className=" max-w-[350px] mx-auto overflow-hidden no-scrollbar">
      <header className="mb-4">
        <div className="flex flex-row items-center">
          <button onClick={() => navigate("/dashboard")}>
            <img className="h-12" src={backIcon} alt="backIcon" />
          </button>
          <h1 className="text-2xl font-semibold mx-auto">Select Address</h1>
          <button
            onClick={openAddAddressesModal}
            title="Add More Addresses"
            className="mr-5"
          >
            <img className="h-8" src={add} alt="add addresses button" />
          </button>
        </div>
      </header>

     

      {/* ######################## SEARCH BOX ########################  */}
      <div className="flex items-center max-w-[325px] mx-auto border border-gray-300 rounded-lg my-4 p-2">
        <button className="min-w-fit pb-1 pr-1 opacity-60">
          <img className="h-5" src={search} alt="searchIcon" />
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="w-full focus:outline-none pl-1"
          value={enteredAddresses}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
        <button onClick={pasteAddresses} className="min-w-fit">
          <img className="h-6 opacity-70" src={paste} alt="pasteIcon" />
        </button>
      </div>

      {/* ######################## ADDRESSES CARD ########################  */}
      <AddressesCard
        key={20}
        pfp={url}
        name="Shakti"
        addresses="0x6727b20B238d48B2258ACE334328570513B73f6e"
        isSelected={selectedCardIndex === 20}
        getClickedAddress={receivedAddress}
        onClick={() => {
          handleCardClick(20);
        }}
      />
    
        {/* BELOW WE ARE TAKING THE AN ARRAY OF OBJECTS WHICH HAS THE ADDRESS FOR THE RECENT TRANSACTIONS.  */}
      {/* <div className=" pb-16 ">
        {recentAddresses.map((addresses, index) => {
          return (
            <>
              <AddressesCard
                key={index}
                pfp={pfp}
                name={addresses.name}
                addresses={addresses.addresses}
                isSelected={selectedCardIndex === index}
                getClickedAddress={receivedAddress}
                onClick={() => {
                  handleCardClick(index);
                }}
              />
            </>
          );
        })}
      </div> */}

      {/* ######################## PROCEED SECTION ######################## */}

      <button
        onClick={handelProceed}
        disabled={sendToAddresses ? false : true}
        className={` ${
          isValid === false && enteredAddresses
            ? " bg-red-500 border-red-700"
            : " bg-blue-500 border-blue-700"
        }  
        fixed left-1/2 translate-x-[-50%] bottom-2  flex justify-center items-center shadow-lg  text-white  border-2    rounded-lg  py-3 min-w-[325px] max-w-[350px] ${
          sendToAddresses ? "" : "text-opacity-50 bg-blue-400 border-blue-700"
        }`}
      >
        <h1 className="text-2xl font-semibold tracking-wider">
          {isValid === false && enteredAddresses
            ? " Invalid Address"
            : " Next "}
        </h1>
      </button>
    </div>
  );
};

export default AddAddresses;
