import React from "react";
import maticLogo from "../../src/assets/matic-logo.png";

type tokenCardParams = {
  tokenIcon:string;
  tokenName:string;
  tokenBalance:number;
}

const TokenCard = ({tokenIcon,tokenName,tokenBalance}:tokenCardParams) => {
  return (
    <div className="flex border item-center py-2 px-3 gap-3 bg-gray-800 rounded-xl text-white border-gray-500 hover:bg-black mt-2">
      <img className="h-8" src={maticLogo} alt="token icon" />
      <div className="flex justify-between w-full">
        <p className="font-semibold tracking-wide">Polygon</p>
        <p className="font-semibold">100</p>
      </div>
    </div>
  );
};

export default TokenCard;
