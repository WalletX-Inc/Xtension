import { useEffect, useRef } from "react";
import { Search } from "react-feather";
import Chains from "../../src/constants/chains";
import { getItemFromStorage, setItemInStorage, log } from "../utils/helper";
import { useConfig } from "../context/ConfigProvider";
import filterIcon from "../assets/filter.svg";

type ChainSelectionDrawerParams = {
  isOpen: boolean;
  onSelectedClose: () => void;
};

const ChainSelectionDrawer = ({
  isOpen,
  onSelectedClose,
}: ChainSelectionDrawerParams) => {
  const storageChainId = getItemFromStorage("network");
  const drawer = useRef(null);

  const { init } = useConfig();

  const handleNetworkSwitch = async (chainId: number) => {
    init(chainId);
    await setItemInStorage("network", chainId);
  };

  useEffect(() => {
    const closeDrawerOnOutsideClick = (e: any) => {
      if (!(drawer.current as any).contains(e.target)) {
        onSelectedClose();
      }
    };

    document.addEventListener("mousedown", closeDrawerOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeDrawerOnOutsideClick);
    };
  });
  return (
    <>
      <div
        ref={drawer}
        className={`${
          isOpen ? "bottom-0" : " translate-y-full"
        }  fixed flex flex-col  justify-center items-center bottom-0 left-1/2 translate-x-[-50%]  w-full h-[370px] bg-slate-900  text-white  rounded-t-3xl  mt-10 px-4 py-5 transition duration-1000  transform z-[100] border border-gray-300  `}
      >
        <h1 className=" font-semibold text-xl">Select Network </h1>

        {/* Serch Box  */}
        <div className="flex items-center w-[95%] mx-auto border border-gray-300 rounded-lg mt-2 mb-4 p-2">
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
          <button
            onClick={() => log("filter these accordingly", {})}
            className="min-w-fit"
          >
            <img className="h-5 opacity-80 " src={filterIcon} alt="pasteIcon" />
          </button>
        </div>

        {/* Chain Details  */}
        <div className=" flex flex-col w-[95%] gap-3 h-[300px] overflow-y-scroll">
          {Chains.map((chain) =>
            !chain.isEnabled ? null : (
              <>
                <div
                  className={`flex gap-3 w-[96.5%] border 0 rounded-lg mx-auto px-2 py-2 ${
                    chain.chainId === storageChainId
                      ? " border-black  bg-gray-100 text-gray-700 "
                      : "border-gray-400 bg-gray-800 text-gray-50"
                  } `}
                  onClick={() => {
                    handleNetworkSwitch(chain.chainId);
                    onSelectedClose();
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
            ),
          )}
        </div>
      </div>
    </>
  );
};

export default ChainSelectionDrawer;
