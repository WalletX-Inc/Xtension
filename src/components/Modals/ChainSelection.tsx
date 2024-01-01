import React, { useEffect } from "react";
import Chains from "../../../src/constants/chains";

import { Search, X } from "react-feather";
import filterIcon from "../../../src/assets/filter.svg";
import { getItemFromStorage, setItemInStorage } from "../../utils/helper";
import { useConfig } from "../../context/ConfigProvider";

type chainSelectionModalParams = {
  isOpen: boolean;
  onClose: Function;
};
const ChainSelection = ({ isOpen, onClose }: chainSelectionModalParams) => {
  const storageChainId = getItemFromStorage("network");
  const { init } = useConfig();

  const handleNetworkSwitch = async (chainId: number) => {
    init(chainId);
    await setItemInStorage("network", chainId);
  };

  return (
    <>
      <div
        className={`fixed inset-0 flex items-start justify-center z-50 p-4  ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-gray-800 h-full w-96  rounded-lg shadow-lg relative">
          {/* Header  */}
          <div className="flex justify-between mb-5 px-4 pt-3">
            <div className="text-base font-bold m-auto">Select a Network</div>
            <button
              className="hover:opacity-70 text-xl"
              onClick={() => {
                onClose();
              }}
            >
              <X style={{ color: "#FFFFFF", fill: "#FFFFFF" }} />
            </button>
          </div>

          {/* Serch Box  */}
          <div className="flex items-center w-[90%] mx-auto border border-gray-300 rounded-lg mt-2 mb-4 p-2">
            <button className="min-w-fit  pr-1 opacity-60">
              <Search className="h-5 mx-auto my-auto" />
            </button>
            <input
              type="text"
              placeholder="Search..."
              className="w-full focus:outline-none pl-1 bg-transparent"
              value=""
              //   onChange={handleInputChange}
              //   onFocus={handleFocus}
            />
            {/* <button
              onClick={() => console.log("filter these accordingly")}
              className="min-w-fit"
            >
              <img
                className="h-5 opacity-80 "
                src={filterIcon}
                alt="pasteIcon"
              />
            </button> */}
          </div>    

          {/* Chain Details  */}
          <div className=" flex flex-col w-full  h-[450px] overflow-y-scroll">
            {Chains.map((chain) => {
              return !chain.isEnabled ? null : (
                <>
                  <div
                    className={`flex w-full mx-auto  py-4 hover:bg-gray-900 hover:bg-opacity-50 ${
                      chain.chainId === storageChainId
                        ? "border-l-4 border-blue-500 bg-blue-500 bg-opacity-25"
                        : ""
                    } `}
                    onClick={() => {
                      handleNetworkSwitch(chain.chainId);
                      onClose();
                    }}
                  >
                    <div className="w-[20%] flex justify-center items-center">
                      <img
                        className="h-8"
                        src={chain.chainUri}
                        alt={`${chain.name} logo`}
                      />
                    </div>
                    <h1 className="my-auto font-semibold text-base  ">
                      {chain.name}
                    </h1>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChainSelection;
