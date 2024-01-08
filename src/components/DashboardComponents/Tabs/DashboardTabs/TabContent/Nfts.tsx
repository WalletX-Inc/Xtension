import React, { useState, useEffect } from "react";
import Moralis from "moralis";
import { Collection } from "../../../../Collection";
import { useConfig } from "../../../../../context/ConfigProvider";
import ImportNfts from "../../../../Modals/ImportNfts";
import plus from "../../../../../assets/NftDiscoveryPage/add-file.svg";
import defaultImg from "../../../../../assets/NftDiscoveryPage/nft_default.jpg";
import toast from "react-hot-toast";

type nftdata = {
  tokenId: string;
  nftLink: string;
};

type nftsource = {
  name: string;
  tokenAddress: string;
  tokenId: number;
  nftLink: any;
  nfts: nftdata[];
};

const Nfts = () => {
  const [nftsource, setNftSource] = useState<nftsource[]>([]);
  const [isImportNftsModalOpen, setImportNftsModalOpen] =
    useState<boolean>(false);
  const { smartAccountAddress, chainId } = useConfig();

  const openImportNftsModal = () => setImportNftsModalOpen(true);
  const closeImportNftsDrawer = () => setImportNftsModalOpen(false);

  const updateSingleImportedNftData = (data: nftsource) => {
    const existingNftIndex = nftsource.findIndex(
      (item: any) => item.tokenAddress === data.tokenAddress
    );

    const nftData: nftdata = {
      tokenId: data.tokenId.toString(),
      nftLink: data.nftLink.replace("ipfs://", "https://ipfs.io/ipfs/"),
    };

    if (existingNftIndex !== -1) {
      const updatedNftSource = [...nftsource];
      updatedNftSource[existingNftIndex] = {
        ...updatedNftSource[existingNftIndex],
        nfts: [...updatedNftSource[existingNftIndex].nfts, nftData],
      };
    } else {
      const newNftData = {
        tokenAddress: data.tokenAddress,
        name: data.name,
        nfts: [nftData],
      };
      const updatedNftSource: any = [...nftsource, newNftData];
      setNftSource(updatedNftSource);
    }
  };

  const sortNftUsingTokenAddress = (
    nftSrcArray: any[],
    index: number,
    tokenAddress: string,
    name: string,
    nftData: any
  ) => {
    if (index !== -1) {
      nftSrcArray[index].nfts.push(nftData);
    } else {
      const newNftData = {
        tokenAddress,
        name,
        nfts: [nftData],
      };
      nftSrcArray.push(newNftData);
    }
  };

  const importAllNfts = async () => {
    try {
      const response: any = await Moralis.EvmApi.nft.getWalletNFTs({
        chain: chainId,
        format: "decimal",
        mediaItems: false,
        address: smartAccountAddress,
      });

      const nftSrcArray: any = [];

      for (let i = 0; i < response.raw.result.length; i++) {
        try {
          const token_uri = await fetch(response.raw.result[i].token_uri);
          const dataFromTokenUri = await token_uri.json();

          const existingNftIndex = nftSrcArray.findIndex(
            (item: any) =>
              item.tokenAddress === response.raw.result[i].token_address
          );

          const singleNftData = {
            tokenId: response.raw.result[i].token_id,
            nftLink: dataFromTokenUri?.image
              ? dataFromTokenUri.image.replace(
                  "ipfs://",
                  "https://ipfs.io/ipfs/"
                )
              : defaultImg,
          };

          sortNftUsingTokenAddress(
            nftSrcArray,
            existingNftIndex,
            response.raw.result[i].token_address,
            response.raw.result[i].name,
            singleNftData
          );
        } catch (error) {
          const existingNftIndex = nftSrcArray.findIndex(
            (item: any) =>
              item.tokenAddress === response.raw.result[i].token_address
          );

          const singleNftData = {
            tokenId: response.raw.result[i].token_id,
            nftLink: defaultImg,
          };

          sortNftUsingTokenAddress(
            nftSrcArray,
            existingNftIndex,
            response.raw.result[i].token_address,
            response.raw.result[i].name,
            singleNftData
          );

          toast.error("Couldn't get your NFT");
        }
      }

      setNftSource(nftSrcArray);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    importAllNfts();
  }, []);

  return (
    <div className="p-4 pt-0 max-h-[275px] overflow-y-scroll">
      {nftsource &&
        nftsource.map((item: nftsource, index) => {
          return (
            <div key={index}>
              <Collection
                name={item.name}
                tokenAddress={item.tokenAddress}
                nft_Data={nftsource[index].nfts}
              />
            </div>
          );
        })}
      <div className="flex flex-col h-full justify-center items-center">
        {!nftsource && <p className="mb-4">Oops, No NFTs yet</p>}
        <button
          onClick={() => openImportNftsModal()}
          className="flex gap-2 p-2 mt-4 bg-[#3B82F6] rounded items-center"
        >
          <img src={plus} className="h-5" alt="add" />
          <p>Import NFT</p>
        </button>

        <ImportNfts
          isOpen={isImportNftsModalOpen}
          onClose={closeImportNftsDrawer}
          updateSingleImportedNftData={updateSingleImportedNftData}
        />
      </div>
    </div>
  );
};

export default Nfts;
