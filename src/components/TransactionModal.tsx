import React from "react";
import { useNavigate } from "react-router-dom";

type transactionModalParams = {
  isOpen: boolean;
};

const TransactionModal = ({ isOpen }: transactionModalParams) => {
    const navigate = useNavigate()
  return (
    <div
      className={`${
        isOpen ? "bottom-0" : " translate-y-full"
      }  fixed flex justify-center items-center bottom-0 left-1/2 translate-x-[-50%]  w-full h-[110%] bg-slate-900  text-white  rounded-t-3xl  mt-10 px-4 py-5 transition duration-1000  transform z-50 `}
    >
      <div className=" flex flex-col gap-3 justify-center item-center text-white  py-10  ">
        <h1 className="text-2xl font-semibold">Transaction Sucessful</h1>
        <div className="flex flex-col px-2 justify-center items-start max-w-[300px] ">
          <p className="font-semibold text-xl">Transaction hash:</p>
          <p className="overflow-x-scroll text-sm max-w-[95%] py-1">
            0x64618e6956ed410a39acbcefdfc5b5bcb33cd50411767220edcffdcb704050ca
          </p>
        </div>
        <button onClick={() => navigate("/dashboard")} className="bg-slate-800 px-2 py-1 rounded-lg border border-slate-400  font-semibold ">
          Go To Dashboard
        </button>
      </div>
    </div>
  );
};

export default TransactionModal;
