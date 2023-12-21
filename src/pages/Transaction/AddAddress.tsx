import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "react-feather";
import AddressesCard from "../../components/AddressCard";
import paste from "../../assets/paste.svg";
import search from "../../assets/search.svg";
import { transferState } from "../../state/TransferState";
import RemoveModal from "../../components/Modal";
import { log } from "../../utils/helper";

const AddAddresses = () => {
  const [transferData, setTransferData] = useRecoilState(transferState);

  const [enteredAddresses, setEnteredAddresses] = useState<string>("");
  const [sendToAddresses, setSendToAddresses] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const [cardAddress, setCardAddress] = useState<string>("");
  const [isCardSelected, setIsCardSelected] = useState<boolean>(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

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

  const receivedAddress = (address: string) => {
    setSendToAddresses(address);
  };

  const handleCardClick = (index: any) => {
    if (selectedCardIndex === index) {
      setSelectedCardIndex(null);
      setSendToAddresses("");
    } else {
      setSelectedCardIndex(index);
    }
    setEnteredAddresses("");
  };

  const isEthereumAddress = (address: any) => {
    try {
      return ethers.utils.isAddress(address);
    } catch (error) {
      return false;
    }
  };

  const pasteAddresses = async () => {
    try {
      setSendToAddresses("");
      handleCardClick(null);
      const address:string = await navigator.clipboard.readText();
      setEnteredAddresses(address);
      setIsValid(isEthereumAddress(address));
    } catch (error) {
      log("Copy failed due to: ", error, "error");
    }
  };

  const generateAddressCard = (enteredAddresses: string) => (
    <AddressesCard
      name="Shakti"
      addresses={enteredAddresses}
      isSelected={selectedCardIndex === 1}
      getClickedAddress={receivedAddress}
      onClick={() => {
        handleCardClick(1);
        setIsCardSelected(true);

        if (isEthereumAddress(enteredAddresses)) {
          setSendToAddresses(enteredAddresses);
        }
        handelProceed(enteredAddresses);
      }}
    />
  );

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setEnteredAddresses(inputValue);
    setCardAddress(inputValue);
  };

  const handleFocus = () => {
    setSendToAddresses("");
    handleCardClick(null);
  };

  const handelProceed = (address: string) => {
    const uuid = crypto.randomUUID();
    setTransferData((prevAddresses) => [
      ...prevAddresses,
      {
        uid: uuid,
        address: sendToAddresses || address,
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
    log("Transfer Data : ", transferData, "info");
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
    <div className="max-w-[350px] mx-auto overflow-hidden no-scrollbar bg-[#1f1f20] h-full text-white">
      <header className="mb-4">
        <div className="flex flex-row items-center">
          <button onClick={() => openBackModal()}>
            <ArrowLeft color="white" className="h-11 w-6 mx-3" />
          </button>
          <h1 className="text-xl font-semibold mx-auto">Select Address</h1>
          {transferData.length > 0 && (
            <button onClick={() => goToAddTokens()}>
              <ArrowRight color="white" className="h-11 w-6 mx-3" />
            </button>
          )}
        </div>
      </header>

      <div className="flex items-center max-w-[325px] mx-auto border border-gray-300 rounded-lg my-4 p-2">
        <button className="min-w-fit pb-1 pr-1 opacity-60 ">
          <img className="h-6 mt-1" src={search} alt="searchIcon" />
        </button>
        <input
          type="text"
          placeholder="Paste or enter an address"
          className="w-full focus:outline-none pl-1 bg-transparent pr-2"
          value={enteredAddresses}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
        <button onClick={pasteAddresses} className="min-w-fit">
          <img className="h-6 opacity-70" src={paste} alt="pasteIcon" />
        </button>
      </div>

      {(enteredAddresses && sendToAddresses) || isValid ? (
        <>
          {isValid ? (
            <>{generateAddressCard(cardAddress)}</>
          ) : (
            <p className="text-red-500 text-center mt-10">
              Oops, the address is not valid
            </p>
          )}
        </>
      ) : (
        <>
          {transferData.length > 0 && (
            <div>
              <p className=" text-xl text-center font-semibold text-gray-500">
                Add Addresses
              </p>
              {transferData.map((address, index) => (
                <AddressesCard
                  key={index}
                  name={address.name}
                  addresses={address.address}
                  isSelected={selectedCardIndex === index}
                  getClickedAddress={receivedAddress}
                  onClick={() => {
                    handleCardClick(index);
                    setIsCardSelected(true);
                    if (isEthereumAddress(address.address)) {
                      setSendToAddresses(address.address);
                    }
                    handelProceed(address.address);
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

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
