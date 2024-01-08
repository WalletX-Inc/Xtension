import React from "react";
import copy from "../../../../../assets/copy (1).svg";
import close from "../../../../../assets/close.svg";
import toast from "react-hot-toast";
import { getShortDisplayString } from "../../../../../utils/helper";

type singleNftModalParams = {
  name?: string;
  imgSrc?: string;
  tokenId?: string;
  tokenAddress?: string;
  onClose: () => void;
};

export const SingleNftModal = ({
  name,
  imgSrc,
  tokenId,
  tokenAddress,
  onClose,
}: singleNftModalParams) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress || "");
      toast.success("Text Copied To clipboard");
    } catch (error) {
      console.error("Copy failed due to: ", error);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between mb-4">
        <p className="font-bold">{name}</p>
        <img src={close} className="h-6 float-right" onClick={onClose} />
      </div>
      <img
        src={imgSrc}
        className="border aspect-square rounded object-scale-down w-4/5 mx-auto"
      />
      <p className="mt-6"># {tokenId}</p>
      <div className="mt-4 flex justify-between">
        <p>Contract Address: </p>
        <div className="flex gap-2">
          <p className="text-ellipsis overflow-hidden whitespace-nowrap ">
            {getShortDisplayString(tokenAddress)}
          </p>
          <img src={copy} onClick={copyToClipboard} className="h-6 " />
        </div>
      </div>

      <button className=" p-2 px-4 mt-8 block mx-auto bg-[#3B82F6] rounded">
        Send
      </button>
    </div>
  );
};
