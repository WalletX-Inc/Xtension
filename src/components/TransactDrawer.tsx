import React from "react";
import { useNavigate } from "react-router-dom";

import receiveIcon from "../assets/arrow-down.png";
import sendIcon from "../assets/arrow-up.png";
import swapIcon from "../assets/swap.png";
import bridgeIcon from "../assets/bridge.png";

type TransactParam = {
  isOpen: boolean;
};
const TransactDrawer = ({ isOpen }: TransactParam) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`${
          isOpen ? "bottom-0" : " translate-y-full"
        }  fixed flex justify-center items-end bottom-0 left-1/2 translate-x-[-50%]  w-full h-[110%] bg-[#1f1f20]  text-white  rounded-t-3xl  mt-10 px-4 py-5 transition duration-1000  transform bg-opacity-90 pb-24`}
      >
        <div className="flex flex-col gap-3 w-full justify-center">
          <h1 className="text-2xl font-semibold tracking-wide mb-2 mx-auto">
            Transact
          </h1>

          {/* Swap & Bridge  */}
          <div className="flex w-full justify-between text-center gap-2">
            <div
              onClick={() => navigate("/dashboard/bridge")}
              className="flex justify-center items-center gap-3 w-1/2 px-2 py-3 bg-gray-50 text-black border-2 border-gray-950  rounded-xl text-xl  tracking-wide font-semibold "
            >
              <img
                className="h-9 p-2 bg-purple-200  rounded-full"
                src={bridgeIcon}
                alt="bridgeIcon"
              />
              Bridge
            </div>
            <div
              onClick={() => navigate("/dashboard/swap")}
              className="flex justify-center items-center gap-3 w-1/2 px-2 py-3 bg-gray-50 text-black border-2 border-gray-950  rounded-xl text-xl  tracking-wide font-semibold "
            >
              <img
                className="h-9 p-2 bg-teal-200 rounded-full"
                src={swapIcon}
                alt="swapIcon"
              />
              Swap
            </div>
          </div>

          {/* Send And Receive  */}
          <div className="flex w-full justify-between text-center gap-2 ">
            {/* Receive  */}
            <div
              onClick={() => navigate("/dashboard/receive")}
              className="flex justify-center items-center gap-3 w-1/2 px-2 py-3 bg-gray-50 text-black border-2 border-gray-950  rounded-xl text-xl  tracking-wide font-semibold "
            >
              <img
                className="h-9 p-2 bg-green-200 rounded-full"
                src={receiveIcon}
                alt="receiveIcon"
              />
              Receive
            </div>

            {/* Send  */}
            <div
              onClick={() => navigate("/dashboard/transaction/add-address")}
              className="flex justify-center items-center gap-3 w-1/2 px-2 py-3 bg-gray-50 text-black border-2 border-gray-950  rounded-xl text-xl  tracking-wide font-semibold "
            >
              <img
                className="h-9 p-2 bg-orange-100 rounded-full"
                src={sendIcon}
                alt="sendIcon"
              />
              Send
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactDrawer;
