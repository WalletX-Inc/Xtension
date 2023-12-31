import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash } from "react-feather";

import SearchToken from "../../components/SearchToken";
import {
  generateAddressIcon,
  getShortDisplayString,
  getChainDetails,
} from "../../utils/helper";
import RemoveModal from "../../components/Modal";
import { useConfig } from "../../context/ConfigProvider";
import { transferState } from "../../state/TransferState";
import addMoreAddress from "../../assets/addUser.svg";

const AddTokens = () => {
  const { smartAccountAddress, chainId } = useConfig();
  const currentChainData = {
    name: getChainDetails(chainId).name,
    logo: getChainDetails(chainId).chainUri,
  };
  const [transferData, setTransferData] = useRecoilState(transferState);

  const navigate = useNavigate();
  const [isTokenModalOpen, setTokenModalOpen] = useState<boolean>(false);
  const [isRemoveAddressModalOpen, setIsRemoveAddressModalOpen] =
    useState(false);

  const [isTokenAddedForAddresses, setIsTokenAddedForAddresses] =
    useState(false);
  const [isTokenAmountValidForAddresses, setIsTokenAmountValidForAddresses] =
    useState<boolean>(false);
  const [uidToRemoveAddress, setUidToRemoveAddress] = useState<string>("");
  const [uidToAddTokenToAddress, setUidToAddTokenToAddress] =
    useState<string>("");
  const [isRemoveTokenModalOpen, setIsRemoveTokenModalOpen] = useState(false);

  const [uidToRemoveToken, setUidToRemoveToken] = useState<string>("");

  const [enteredAmount, setEnteredAmount] = useState<any>();
  const [isEnteredAmountValid, setIsEnteredAmountValid] = useState({
    valid: false,
    uid: "",
  });

  // ADD TOKEN FUNCTIONS
  const openAddTokenModal = (uid: string) => {
    setUidToAddTokenToAddress(uid);
    setTokenModalOpen(true);
  };

  const closeAddTokenModal = () => {
    setTokenModalOpen(false);
  };

  // Adding Amount

  const handelAmountChange = (e: any, uid: string) => {
    setIsEnteredAmountValid({
      valid: true,
      uid: uid,
    });
    const enteredAmount = e.target.value;

    const isAmountValid = transferData.some(
      (transferDetails) =>
        transferDetails.uid === uid &&
        transferDetails.tokenBalance &&
        transferDetails.tokenBalance >= enteredAmount
    );

    if (isAmountValid) {
      setEnteredAmount(enteredAmount);
    } else {
      setIsEnteredAmountValid({
        valid: false,
        uid: uid,
      });
    }
  };

  const updateAmount = (uid: string) => {
    setTransferData((prevData) =>
      prevData.map((transferDetails) =>
        transferDetails.uid === uid
          ? {
              ...transferDetails,
              amount: enteredAmount,
            }
          : transferDetails
      )
    );
  };

  //  REMOVE TOKEN FUNCIOTNS
  const openRemoveTokenModal = (uid: string) => {
    setUidToRemoveToken(uid);
    setIsRemoveTokenModalOpen(true);
  };

  const closeRemoveTokenModal = () => {
    setIsRemoveTokenModalOpen(false);
  };

  const handelRemoveToken = () => {
    setTransferData((prevData) =>
      prevData.map((transferDetails) =>
        transferDetails.uid === uidToRemoveToken
          ? {
              ...transferDetails,
              tokenName: "",
              tokenSymbol: "",
              tokenAddress: "",
              tokenBalance: 0,
              tokenDecimal: 0,
              amount: 0,
            }
          : transferDetails
      )
    );
    setIsRemoveTokenModalOpen(false);
  };

  // Reomve Address Functions
  const openRemoveAddressModal = (uid: string) => {
    setUidToRemoveAddress(uid);
    setIsRemoveAddressModalOpen(true);
  };

  const closeRemoveAddressModal = () => {
    setIsRemoveAddressModalOpen(false);
  };

  const handleRemoveAddress = () => {
    setTransferData((prevAddresses) =>
      prevAddresses.filter(
        (transferDetails) => transferDetails.uid !== uidToRemoveAddress
      )
    );
    setIsRemoveAddressModalOpen(false);

    // Check this line and remove it
    if (transferData.length == 0) {
      navigate("/dashboard/transaction/add-address");
    }
  };

  const handelProceedButton = () => {
    if (
      transferData.length > 0 &&
      isTokenAddedForAddresses &&
      isTokenAmountValidForAddresses
    ) {
      navigate("/dashboard/transaction/approve-transactions");
    }
  };

  const validateTransferDetails = () => {
    const propertyName = "tokenSymbol";
    const property2Name = "amount";

    const tokenIsAddedForAll = transferData.every(
      (address) => !!address[propertyName]
    );

    const tokenAmountIsGreaterThanZero = transferData.every(
      (address) => address[property2Name] > 0
    );

    setIsTokenAddedForAddresses(tokenIsAddedForAll);
    setIsTokenAmountValidForAddresses(tokenAmountIsGreaterThanZero);
  };

  useEffect(() => {
    validateTransferDetails();
  }, [transferData]);

  if (transferData.length === 0) navigate("/dashboard/transaction/add-address");
  return (
    <>
      <div className=" max-w-[350px] mx-auto  bg-[#1f1f20]  ">
        <header className="mb-4">
          <div className="flex flex-row items-center text-white">
            <button
              onClick={() => navigate("/dashboard/transaction/add-address")}
            >
              <ArrowLeft className="h-11 w-6 mx-3" />
            </button>
            <h1 className="text-xl font-semibold mx-auto">Add Tokens</h1>
          </div>
        </header>

        {/* Pass the address of our wallet  */}
        <div className="flex justify-between items-start bg-gray-800  border border-gray-700  w-full max-w-[325px] mx-auto py-2 px-3 rounded-xl text-gray-200">
          <div>
            <h1 className="text-xl text-gray-300 font-semibold">From</h1>
            <div className="flex gap-2 justify-center items-center">
              <img
                className="h-6 rounded-lg border  border-white"
                src={generateAddressIcon(smartAccountAddress)}
                alt="address icon "
              />
              <p className="text-base font-semibold tracking-wide ">
                {getShortDisplayString(smartAccountAddress)}
              </p>
            </div>
          </div>
          <div className="text-base text-gray-200 my-auto flex justify-center item-center gap-2 ">
            <img
              className="h-9 border rounded-full p-1 "
              src={currentChainData.logo}
              alt={currentChainData.name}
            />
            <p className="text-[15px] font-semibold w-[85px]">
              {currentChainData.name}{" "}
            </p>
          </div>
        </div>

        {/* CardSection  */}
        <div className="overflow-y-scroll max-h-[450px]  mt-2">
          {transferData.map((transferData) => {
            return (
              <>
                <div className="flex flex-col gap-2 bg-gray-800 max-w-[325px] border rounded-xl py-2 px-2 border-gray-700 mx-auto mt-5 text-white shadow-md text-base">
                  <div className=" flex  justify-between   bg-gray-700 border border-gray-700 py-2 px-2 rounded-lg">
                    <div className="flex justify-center item-center gap-2">
                      <img
                        className="h-7 border rounded-lg my-auto"
                        src={generateAddressIcon(transferData.address)}
                        alt="generate it from the token"
                      />
                      <p className="font-medium">
                        {getShortDisplayString(transferData.address)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        openRemoveAddressModal(transferData.uid);
                      }}
                    >
                      <Trash className="h-6 w-6" />
                    </button>
                  </div>
                  {/* Amount exceeds available balance. Please adjust 
                  Balance too low for the requested amount.
                  Insufficient balance. Please enter a valid amount.
                  Your entered amount exceeds your available balance.
                  */}

                  {isEnteredAmountValid.valid === false &&
                  isEnteredAmountValid.uid == transferData.uid ? (
                    <div>
                      <h1 className="font-semibold text-sm text-red-500 px-2 tracking-wide  text-center">
                        Amount exceeds available balance. Please adjust.
                      </h1>
                    </div>
                  ) : (
                    <></>
                  )}

                  {/* TOKEN CARD SECTION */}
                  {transferData.tokenSymbol ? (
                    <>
                      <div className="flex bg-gray-700 border-gray-700 py-3  gap-2 rounded-lg px-2   justify-between w-full items-center   ">
                        <div
                          onClick={() => {
                            openAddTokenModal(transferData.uid);
                          }}
                          className="flex justify-center items-center gap-2"
                        >
                          <img
                            className="h-8 w-8 "
                            src={transferData.tokenLogo}
                            alt="tokenIcon"
                          />

                          <div className="flex flex-col items-start ">
                            <p>{transferData.tokenSymbol}</p>
                            <p className="text-sm">{transferData.tokenName}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end ">
                          <input
                            className="bg-transparent  border-black outline-none max-w-[80px] text-right"
                            type="number"
                            min={0}
                            placeholder="0"
                            defaultValue={`${
                              transferData.amount === 0
                                ? ""
                                : transferData.amount
                            }`}
                            onChange={(e: any) =>
                              handelAmountChange(e, transferData.uid)
                            }
                            onBlurCapture={() => updateAmount(transferData.uid)}
                          />
                          <p className="text-sm ">$ 00.00</p>
                        </div>
                      </div>

                      {/* balance and remove token  */}
                      <div className="flex justify-between px-2 text-sm ">
                        <p className="font-semibold">
                          Balance <span>{transferData.tokenBalance}</span>
                        </p>
                        {/* Make a function to create the data of tokens added from the transferData  */}
                        <button
                          onClick={() => {
                            openRemoveTokenModal(transferData.uid);
                          }}
                          className="text-red-500 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="self-center  bg-gray-900 border border-black  px-2 py-1 rounded-lg mt-2 text-white  ">
                        <button
                          onClick={() => {
                            openAddTokenModal(transferData.uid);
                          }}
                          className="font-semibold tracking-widest "
                        >
                          Select Asset
                        </button>
                      </div>
                    </>
                  )}
                  {/* MODAL FOR SELECTING THE TOKENS  */}
                  <SearchToken
                    isOpen={isTokenModalOpen}
                    onClose={closeAddTokenModal}
                    uid={uidToAddTokenToAddress}
                  />
                </div>
              </>
            );
          })}
          {/* Add more addresses  */}
          <div className="flex justify-center item-center mt-10 pb-28  ">
            <button
              onClick={() => {
                navigate("/dashboard/transaction/add-address");
              }}
            >
              <img
                className="h-12 "
                src={addMoreAddress}
                alt="add more addresses"
              />
            </button>
          </div>
        </div>

        {/* Modal to remove Address  */}
        <RemoveModal
          onCancel={closeRemoveAddressModal}
          onRemove={handleRemoveAddress}
          isOpen={isRemoveAddressModalOpen}
          message="Do you want to delete the address for the transaction"
          actionBtnName="Delete"
        />
        {/* Modal to remove token  */}
        <RemoveModal
          onCancel={closeRemoveTokenModal}
          onRemove={handelRemoveToken}
          isOpen={isRemoveTokenModalOpen}
          message="Do you want to remove the token?"
          actionBtnName="Remove"
        />
      </div>
      {/* ######################## PROCEED SECTION ######################## */}
      <button
        onClick={handelProceedButton}
        disabled={
          isTokenAddedForAddresses && isTokenAmountValidForAddresses
            ? false
            : true
        }
        className={`${
          isTokenAddedForAddresses && isTokenAmountValidForAddresses
            ? "border-white"
            : "text-opacity-50 "
        } bg-gray-950 border-gray-500 hover:bg-black fixed left-1/2 translate-x-[-50%] bottom-4  flex justify-center items-center shadow-lg  text-white  border-2    rounded-lg  py-2 min-w-[325px] max-w-[350px]  `}
      >
        <h1 className="text-xl font-semibold tracking-wider">Review</h1>
      </button>
    </>
  );
};

export default AddTokens;
