import React, { useState } from "react";
import downArrow from "../assets/angleDown.svg";
import { SingleNftModal } from "./SingleNftModal";

type nftdata = {
  tokenId: string;
  nftLink: string;
};

type collectionParams = {
  name: string;
  nft_Data: nftdata[];
  tokenAddress: string;
};

type openNftData = {
  name: string;
  imgSrc: string;
  tokenId: string;
  token_Address: string;
};
type data = {
  name: string;
  imgSrc: string;
  tokenId: string;
  tokenAddress: string;
};

export const Collection = ({
  name,
  tokenAddress,
  nft_Data,
}: collectionParams) => {
  const [showDropbox, setShowDropbox] = useState(false);
  const [showSingleNftModal, setshowSingleNftModal] = useState(false);
  const [singleNftModalData, setSingleNftModal] = useState<data>();

  const toggleDropbox = () => {
    setShowDropbox(!showDropbox);
  };

  const toggleShowSingleNftModal = () => {
    setshowSingleNftModal(!showSingleNftModal);
  };

  const openNftData = ({
    name,
    imgSrc,
    tokenId,
    token_Address,
  }: openNftData) => {
    toggleShowSingleNftModal();
    const data = {
      name: name,
      imgSrc: imgSrc,
      tokenId: tokenId,
      tokenAddress: token_Address,
    };
    setSingleNftModal(data);
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <p>
          {name} ({nft_Data.length})
        </p>
        <img
          src={downArrow}
          className={showDropbox ? "h-6 origin-center rotate-180" : "h-6"}
          onClick={toggleDropbox}
        />
      </div>

      {showDropbox && (
        <div className="flex gap-2 flex-wrap justify-center">
          {nft_Data.map((item: any, index: any) => (
            <img
              src={item.nftLink}
              key={index}
              onClick={() => {
                openNftData({
                  name: name,
                  imgSrc: item.nftLink,
                  tokenId: item.tokenId,
                  token_Address: tokenAddress,
                });
              }}
              className="h-20 aspect-square object-scale-down border rounded"
            />
          ))}
        </div>
      )}
      {showSingleNftModal && (
        <div className="absolute top-0 left-0 h-full w-full p-2 bg-[#1f1f20]">
          <SingleNftModal
            name={singleNftModalData?.name}
            imgSrc={singleNftModalData?.imgSrc}
            tokenId={singleNftModalData?.tokenId}
            tokenAddress={singleNftModalData?.tokenAddress}
            onClose={toggleShowSingleNftModal}
          />
        </div>
      )}
    </div>
  );
};
