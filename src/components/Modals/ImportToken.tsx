import React from "react";
import { Search, X } from "react-feather";
import Tabs from "../DashboardComponents/Tabs/ImportTokenTabs/Tabs";

type importTokenModalParams = {
  isOpen: boolean;
  onClose: Function;
};
const ImportToken = ({ isOpen, onClose }: importTokenModalParams) => {
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
            <div className="text-base font-bold m-auto">Import tokens</div>
            <button
              className="hover:opacity-70 text-xl"
              onClick={() => {
                onClose();
              }}
            >
              <X style={{ color: "#FFFFFF", fill: "#FFFFFF" }} />
            </button>
          </div>

          <Tabs />
        </div>
      </div>
    </>
  );
};

export default ImportToken;
