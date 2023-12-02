import { useEffect, useState } from "react";
import backIcon from "../../assets/angle.svg";
import AddressesCard from "../../components/AddressCard";
import paste from "../../assets/paste.svg";
import search from "../../assets/search.svg";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";
import { transferState } from "../../state/TransferState";
import { useNavigate } from "react-router-dom";
import RemoveModal from "../../components/Modal";
import { ArrowLeft, ArrowRight } from "react-feather";

const AddAddresses = () => {
  const [transferData, setTransferData] = useRecoilState(transferState);

  const [enteredAddresses, setEnteredAddresses] = useState<string>("");
  const [sendToAddresses, setSendToAddresses] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  );
  const [cardAddress, setCardAddress] = useState<string>("");
  const [isCardSelected, setIsCardSelected] = useState<boolean>(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // function to go back to the dashboard and forward to the add token page
  const openBackModal = () => {
    if (transferData.length > 0) {
      setIsBackModalOpen(true);
    } else {
      navigate("/dashboard");
    }
  };

  const goToAddTokens = () => {
    navigate("/dashboard/transaction/add-tokens");
  };

  const closeBackModal = () => {
    setIsBackModalOpen(false);
  };

  const handleBack = () => {
    setTransferData([]);
    navigate("/dashboard");
  };

  //function for opning the add Addresses modal
  const [isAddAddressesModalVisible, setIsAddAddressesModalVisible] =
    useState(false);

  const openAddAddressesModal = () => {
    setIsAddAddressesModalVisible(true);
  };
  const closeAddAddressesModal = () => {
    setIsAddAddressesModalVisible(false);
  };

  //call back functions that receives the address and index form the addressesCard component
  const receivedAddress = (address: string) => {
    setSendToAddresses(address);
  };

  const handleCardClick = (index: number | null) => {
    if (selectedCardIndex === index) {
      setSelectedCardIndex(null);
      setSendToAddresses("");
    } else {
      setSelectedCardIndex(index);
    }
    setEnteredAddresses("");
  };

  // Search Box functions
  const isEthereumAddress = (address: string) => {
    try {
      const validAddress = ethers.utils.isAddress(address);
      return validAddress;
    } catch (error) {
      return false;
    }
  };

  // this function is not beign use cause of manifest v3 problem on build
  const pasteAddresses = async () => {
    try {
      setSendToAddresses("");
      handleCardClick(null);
      const address: string = await navigator.clipboard.readText();
      setEnteredAddresses(address);
      setIsValid(isEthereumAddress(address));
    } catch (error) {
      console.log("Copy failed due to: ", error);
    }
  };
  const generateAddressCard = (enteredAddresses: string) => {
    return (
      <>
        <AddressesCard
          // key={1}
          name="Shakti"
          addresses={enteredAddresses}
          isSelected={selectedCardIndex === 1}
          getClickedAddress={receivedAddress}
          onClick={() => {
            handleCardClick(1);
            setIsCardSelected(!isCardSelected);
          }}
        />
      </>
    );
  };

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setEnteredAddresses(inputValue);
    setCardAddress(inputValue);
  };
  const handleFocus = () => {
    setSendToAddresses("");
    handleCardClick(null);
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
        tokenLogo: "",
      },
    ]);
    console.log("Transfer Data : ", transferData);
    navigate("/dashboard/transaction/add-tokens");
  };

  useEffect(() => {
    setIsValid(isEthereumAddress(enteredAddresses));
    setIsValid(isEthereumAddress(cardAddress));
    if (isValid === true) {
      setSendToAddresses(cardAddress);
    }
  }, [enteredAddresses, cardAddress, selectedCardIndex, sendToAddresses]);

  return (
    <div className=" max-w-[350px] mx-auto overflow-hidden no-scrollbar bg-[#1f1f20] h-full text-white">
      <header className="mb-4">
        <div className="flex flex-row items-center">
          <button onClick={() => openBackModal()}>
            <ArrowLeft color="white" className="h-11 w-6 mx-3" />
          </button>
          <h1 className="text-xl font-semibold mx-auto">Select Address</h1>
          {transferData.length > 0 ? (
            <>
              <button onClick={() => goToAddTokens()}>
                <ArrowRight color="white" className="h-11 w-6 mx-3" />
              </button>
            </>
          ) : (
            <></>
          )}

          {/* <button
            onClick={openAddAddressesModal}
            title="Add More Addresses"
            className="mr-5"
          >
            <img className="h-8" src={add} alt="add addresses button" />
          </button> */}
        </div>
      </header>

      <h1>THIS IS SIGN MESSAGE SCREEN</h1>

      <button
        onClick={handelProceed}
        disabled={sendToAddresses && isCardSelected ? false : true}
        className={` ${
          isValid === false && enteredAddresses
            ? " bg-red-500 border-red-700"
            : " bg-gray-950 hover:bg-black"
        }  
        fixed left-1/2 translate-x-[-50%] bottom-2  flex justify-center items-center shadow-lg text-white    border-2    rounded-lg  py-2 min-w-[325px] max-w-[350px]  ${
          sendToAddresses && isCardSelected
            ? "border-white text-white "
            : " text-opacity-50 bg-gray-950 border-gray-500"
        }`}
      >
        <h1 className="text-xl font-semibold tracking-wider">
          {isValid === false && enteredAddresses
            ? " Invalid Address"
            : " Next "}
        </h1>
      </button>

      <RemoveModal
        isOpen={isBackModalOpen}
        onCancel={closeBackModal}
        onRemove={handleBack}
        message="Do you want to delete all the transactions?"
        actionBtnName="Delete"
      />
    </div>
  );
};

export default AddAddresses;
