import React, { useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";
import { useRecoilState } from "recoil";
import { gasState } from "../state/GasState";
import gas from "../../src/assets/gas.svg";

type selectedTokenForGas = {
  icon: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenGasValue: number;
};

type gasTokenSelectionParams = {
  isOpen: boolean;
  onClose: Function;
  updateGasToken: Function;
  selectedTokenForGas: selectedTokenForGas;
};

const GasTokenSelectionDrawer = ({
  isOpen,
  updateGasToken,
  selectedTokenForGas,
  onClose,
}: gasTokenSelectionParams) => {
  const [gasData, setGasData] = useRecoilState(gasState);
  const drawer = useRef(null);

  useEffect(() => {
    const closeDrawerOnOutsideClick = (e: any) => {
      if (!(drawer.current as any).contains(e.target)) {
        onClose();
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
        }  fixed bottom-0   w-[350px] h-[350px] bg-slate-900 border-gray-300 text-white border rounded-t-3xl rounded-b-lg mt-10 px-4 pt-2 pb-4 transition duration-500  transform `}
      >
        <h1 className="text-center font-semibold text-xl">
          Select Token For Gas
        </h1>

        <div className="mt-5 overflow-y-scroll h-[250px]">
          {gasData.map((token) => {
            const tokenData: selectedTokenForGas = {
              icon: token.tokenLogo,
              tokenName: token.tokenName,
              tokenSymbol: token.tokenSymbol,
              tokenAddress: token.tokenAddress,
              tokenGasValue: token.tokenGasValue,
            };
            return (
              <div
                onClick={() => updateGasToken(tokenData)}
                className={` ${
                  token.tokenAddress === selectedTokenForGas.tokenAddress
                    ? "border-2 border-white"
                    : ""
                } flex   mt-2 px-2 py-2 rounded-lg `}
              >
                <div className="w-[20%] flex justify-center items-center">
                  <img
                    className="h-10"
                    src={token.tokenLogo}
                    alt="tokenImage"
                  />
                </div>
                <div className="w-[80%] flex  justify-between items-center px-2">
                  <div>
                    <p className="text-lg">{token.tokenSymbol}</p>
                    <p className="text-sm">{token.tokenBalance}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p>{`$ ${token.tokenGasValue}`}</p>
                    <p className="flex item-center text-xs gap-1 ">
                      <img
                        className="h-4 opacity-70"
                        src={gas}
                        alt="gasCanImage"
                      />
                      {token.tokenGas > 0 ? (
                        <>{token.tokenGas}</>
                      ) : (
                        <>
                          <BeatLoader size={5} loading={true} color="#ffffff" />
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GasTokenSelectionDrawer;
