import React, { useEffect, useState } from "react";
import { getShortDisplayString } from "../../utils/helper";
import backIcon from "../../assets/angle.svg";
import remove from "../../assets/x.png";
import del from "../../assets/delete.png";
import edit from "../../assets/edit.png";
import addMoreAddress from "../../assets/add-user.svg";
import { useNavigate } from "react-router";
import RemoveModal from "../../components/Modal";
import SearchToken from "../../components/SearchToken";
import {  useRecoilState } from "recoil";
import { transferState } from"../../state/TransferState";

const AddTokens = () => {
  const [transferData, setTransferData] = useRecoilState(transferState);

  const navigate = useNavigate();
  const [isTokenModalOpen, setTokenModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isTokenAddedForAddresses, setIsTokenAddedForAddresses] =
    useState(false);
  const [uidToRemoveAddress, setUidToRemoveAddress] = useState("");
  const [uidToAddTokenToAddress, setUidToAddTokenToAddress] = useState("");

  const openAddTokenModal = (uid: string) => {
    setUidToAddTokenToAddress(uid);
    setTokenModalOpen(true);
  };

  const closeTokenModal = () => {
    setTokenModalOpen(false);
  };

  const handleOpenRemoveModal = (uid: string) => {
    setUidToRemoveAddress(uid);
    setIsRemoveModalOpen(true);
    console.log("Model Should Open");
  };

  const handleCloseRemoveModal = () => {
    setIsRemoveModalOpen(false);
    console.log("no action was taken");
  };

  const handleRemove = () => {
    // Logic to handle remove action
    setTransferData((prevAddresses) =>
      prevAddresses.filter(
        (transferDetails) => transferDetails.uid !== uidToRemoveAddress
      )
    );
    setIsRemoveModalOpen(false); // Close the modal after removing
    // Write the logic here for going on send screen if no address in on the token
    if (transferData.length == 0) {
      navigate("/dashboard/send/approvetransaction");
    }
  };

  const handelProceedButton = () => {
    console.log(transferData);
    const propertyName = "tokenSymbol";
    const tokenIsAddedForAll = transferData.every(
      (address) => !!address[propertyName]
    ); // this array method is to check if the property tokenSymbol has truthy value or not
    // console.log(tokenIsAddedForAll)
    if (transferData.length > 0 && isTokenAddedForAddresses) {
      navigate("/dashboard/send/approvetransaction");
    }
    // console.log("it passed")
  };

  useEffect(() => {
    const propertyName = "tokenSymbol";
    const tokenIsAddedForAll = transferData.every(
      (address) => !!address[propertyName]
    );
    setIsTokenAddedForAddresses(tokenIsAddedForAll);
  }, [transferData]);

  // if (transferData.length==0 ) navigate("/dashboard/send")
  return (
    <>
      <div className=" max-w-[350px] mx-auto pb-28 ">
        <header className="mb-4">
          <div className="flex flex-row items-center text-white">
            <button
              onClick={() => navigate("/dashboard/transaction/add-address")}
            >
              <img className="h-12" src={backIcon} alt="backIcon" />
            </button>
            <h1 className="text-2xl font-semibold mx-auto">Add Tokens</h1>
          </div>
        </header>

        {/* CardSection  */}
        <>
          {transferData.map((transferData) => {
            return (
              <div className=" max-w-[325px] relative flex flex-col  bg-white rounded-xl shadow-md px-4 py-2 border-2 border-solid border-gray-600  border-opacity-70 mt-3 mx-auto">
                <div className="flex flex-row items-center">
                  <img
                    src={""}
                    alt="Address Logo"
                    className=" h-12 rounded-full object-cover mr-4 border-2 border-gray-400"
                  />
                  <div className="min-w-[70%]">
                    {/* <p className="text-xl font-semibold">{"Shakti"} </p> */}
                    <p className="text-lg font-semibold overflow-hidden text-gray-600">
                      {getShortDisplayString(transferData.address)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleOpenRemoveModal(transferData.uid);
                  }}
                  className="absolute right-1 top-1 opacity-60"
                >
                  <img
                    className=" h-8  "
                    src={remove}
                    alt="delete the address  "
                  />
                </button>

                {/* TOKEN CARD SECTION */}
                {transferData.tokenSymbol ? (
                  <>
                    <div className="flex my-3 justify-center item-center gap-2 bg-gray-50 p-2 rounded-lg border shadow-md divide-x-2 divide-black divide-opacity-50">
                      <div className="w-[90%] flex items-center justify-between mx-1 ">
                        <div className="flex  flex-col gap-3">
                          <p>
                            Assest: <span>{transferData.tokenSymbol}</span>
                          </p>
                          <p>
                            Balance: <span>{transferData.tokenBalance}</span>
                          </p>
                        </div>
                        <div className="flex items-center justify-start flex-col gap-3 px-5">
                          <p>
                            Amount: <span>{transferData.amount}</span>
                            {/* <input
                  type="text"
                  className="border-b-2 border-black bg-transparent outline-none max-w-[80px]"
                /> */}
                          </p>
                          <p>
                            INR: <span>calculate</span>
                          </p>
                        </div>
                      </div>
                      <div className=" flex flex-col items-end justify-center gap-2 w-[10%]">
                        <button
                          onClick={() => {
                            console.log("open and modal and remove the token");
                          }}
                        >
                          <img src={del} className="h-6" alt="deleteToken" />
                        </button>
                        <button
                          onClick={() => {
                            console.log("open and modal and remove the token");
                          }}
                        >
                          <img src={edit} className="h-6" alt="deleteToken" />
                        </button>
                      </div>
                    </div>
                    <h1 className="inline text-xl text-center p-2  font-semibold tracking-wider">
                      Total:{" "}
                      <span>
                        <span>Rs </span>calculate
                      </span>
                    </h1>
                  </>
                ) : (
                  <>
                    <div className="self-center  bg-blue-400 border border-blue-700 border-opacity-50 px-2 py-1 rounded-lg mt-2 text-white  ">
                      <button
                        onClick={() => {
                          openAddTokenModal(transferData.uid);
                        }}
                        className="font-semibold tracking-widest "
                      >
                        Add Tokens
                      </button>
                    </div>
                  </>
                )}

                {/* MODAL FOR SELECTING THE TOKENS  */}
                <SearchToken
                  isOpen={isTokenModalOpen}
                  onClose={closeTokenModal}
                  uid={uidToAddTokenToAddress}
                />
              </div>
            );
          })}
        </>

        <RemoveModal
          onCancel={handleCloseRemoveModal}
          onRemove={handleRemove}
          isOpen={isRemoveModalOpen}
        />

        {/* Add more addresses  */}
        <div className="flex justify-center item-center mt-10  ">
          <button
            onClick={() => {
              navigate("/dashboard/transaction/add-address");
            }}
          >
            <img
              className="h-16 "
              src={addMoreAddress}
              alt="add more addresses"
            />
          </button>
        </div>
      </div>
      {/* ######################## PROCEED SECTION ######################## */}
      <button
        onClick={handelProceedButton}
        disabled={isTokenAddedForAddresses ? false : true}
        className={`${
          !isTokenAddedForAddresses ? "text-opacity-50 " : ""
        } bg-gray-950  border-gray-500 fixed left-1/2 translate-x-[-50%] bottom-4  flex justify-center items-center shadow-lg  text-white  border-2    rounded-lg  py-3 min-w-[325px] max-w-[350px]  `}
      >
        <h1 className="text-2xl font-semibold tracking-wider">
          {/* {isValid === false && enteredAddresses
            ? " Invalid Address"
            : " Next "} */}
          Review
        </h1>
      </button>
    </>
  );
};

export default AddTokens;
