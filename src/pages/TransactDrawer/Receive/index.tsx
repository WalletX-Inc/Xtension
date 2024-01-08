import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import { ArrowLeft } from "react-feather";

import { useNavigate } from "react-router";
import copy from "../../../assets/copy&paste.png";
import { getItemFromStorage, log } from "../../../utils/helper";

const Receive = () => {
  const navigate = useNavigate();
  const walletAddress = getItemFromStorage("smartAccount");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      toast.success("Text Copied To clipboard");
    } catch (error) {
      log("Copy failed due to: ", error, "error");
    }
  };

  return (
    <div className="max-w-[350px] mx-auto overflow-hidden no-scrollbar bg-[#1f1f20] h-full text-white">
      <header className="mb-4">
        <div className="flex flex-row items-center">
          <button onClick={() => navigate("/dashboard")}>
            <ArrowLeft color="white" className="h-11 w-6 mx-3" />
          </button>
          <h1 className="text-xl font-semibold mx-auto">Receive Token</h1>
        </div>
      </header>

      <div className="flex flex-col gap-4 justify-center items-center mt-6 ">
        <div className="flex justify-center items-center bg-gray-50 p-3 rounded-lg  shadow-white">
          <QRCode value={`ethereum: ${walletAddress}`} />
        </div>
        <div className="max-w-[300px] flex  justify-center items-center gap-2 bg-gray-50 rounded-lg py-1 px-2 my-2 border shadow-lg ">
          <span className=" flex justify-center w-[90%] text-sm  break-words text-black">
            {walletAddress}
          </span>

          <button className="w-[10%] flex justify-center  ">
            <img
              onClick={() => copyToClipboard()}
              className="h-6"
              src={copy}
              alt="copyWalletAddresses"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receive;
