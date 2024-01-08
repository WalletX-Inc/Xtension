import React, { useState } from "react";
import { Search, X } from "react-feather";
import Moralis from "moralis";
import { useConfig } from "../../context/ConfigProvider";
import defaultNft from "../../assets/NftDiscoveryPage/nft_default.jpg"

type nftsource = {
  name: string;
  tokenAddress: string;
  tokenId: string;
  nftLink: any;
};

type ImportNftsModalParams = {
  isOpen: boolean;
  onClose: Function;
  updateSingleImportedNftData: (data: any) => void;
};

const ImportNfts = ({
  isOpen,
  onClose,
  updateSingleImportedNftData,
}: ImportNftsModalParams) => {
  const [address, setAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [showError, setshowError] = useState(false);
  const { smartAccountAddress, chainId } = useConfig();

  const handleAddressChange = (event: any) => {
    setAddress(event.target.value);
  };

  const handleTokenIdChange = (event: any) => {
    setTokenId(event.target.value);
  };

  const handleClose = () => {
    setAddress("");
    setTokenId("");
    setshowError(false);
    onClose();
  };

  const importSingleNft = async (e: any) => {
    e.preventDefault();
    try {

      const response: any = await Moralis.EvmApi.nft.getNFTMetadata({
        chain: chainId,
        format: "decimal",
        normalizeMetadata: true,
        mediaItems: true,
        address: address,
        tokenId: tokenId,
      });

      if (smartAccountAddress === response.raw.owner_of) {
        const fetchedData: nftsource = {
          name: response.raw.name,
          tokenAddress: response.raw.token_address,
          tokenId: response.raw.token_id,
          nftLink: response.raw.media.original_media_url || defaultNft,
        };
        updateSingleImportedNftData(fetchedData);
        setAddress("");
        setTokenId("");
        onClose();
      } else {
        setshowError(true);
      }
    } catch (e) {
      //Do error handling 
      console.error(e);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-start justify-center z-50 p-4">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <form
            className="bg-gray-800 w-96 p-2 rounded-lg shadow-lg relative"
            onSubmit={importSingleNft}
          >
            {/* Header */}
            <div className="flex justify-between mb-5 px-4 pt-3">
              <div className="text-base font-bold m-auto">Import NFT</div>
              <button
                className="hover:opacity-70 text-xl"
                onClick={() => handleClose()}
              >
                <X style={{ color: "#FFFFFF", fill: "#FFFFFF" }} />
              </button>
            </div>

            <div className="mb-2">
              <p className="mb-1 ml-2">Address</p>
              <input
                className="p-1 border rounded w-full text-black"
                required
                type="text"
                value={address}
                onChange={handleAddressChange}
              />
            </div>

            <div>
              <p className="mb-1 ml-2">Token ID</p>
              <input
                className="p-1 border rounded w-full text-black"
                required
                type="number"
                value={tokenId}
                onChange={handleTokenIdChange}
              />
            </div>

            {showError && (
              <p className="mt-4 text-center text-red-500 font-semibold">
                This NFT doesn't belongs to you!
              </p>
            )}

            <div className="flex gap-2 mt-6">
              <button
                className="p-2 border border-[#3B82F6] text-[#3B82F6] font-semibold rounded flex-grow"
                onClick={() => onClose()}
              >
                Cancel
              </button>
              <button
                className="p-2 bg-[#3B82F6] rounded font-semibold flex-grow"
                type="submit"
              >
                Import
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ImportNfts;
