import React from "react";
import cancel from "../assets/x.png";
import copy from "../assets/copy&paste.png";
import QRCode from "react-qr-code";
type qrmodalparams = {
  onClose: Function;
  isOpen: Boolean;
  walletAddress: String;
};

const QRCodeModal = ({ onClose, isOpen, walletAddress }: qrmodalparams) => {
  return (
    <>
      <div
        className={`${
          isOpen ? "" : "hidden"
        } fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60`}
      >
        <div className="relative bg-white text-xl font-semibold min-w-[325px] max-w-[350px] rounded-lg border shadow-lg mt-6 pl-3 text-black  border-b-gray-950 ">
          <>
            <h1 className="m-4 text-xl font-semibold ">Receive Tokens</h1>
            <button
              onClick={() => onClose()}
              className="absolute right-2 top-3 opacity-60"
            >
              <img className=" h-8  " src={cancel} alt="closeModal " />
            </button>
          </>

          <div className=" my-2  item-center py-2 px-3">
            <QRCode value={`ethereum: ${walletAddress}`} />
          </div>
          <div className="max-w-[300px] flex gap-2 bg-gray-50 rounded-lg py-1 px-2 my-2 border shadow-lg justify-center items-center ">
            <span className=" flex justify-center w-[90%] text-sm  break-words">
              {walletAddress}
            </span>

            <button className="w-[10%] flex justify-center  ">
              <img className="h-6" src={copy} alt="copyWalletAddresses" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QRCodeModal;
