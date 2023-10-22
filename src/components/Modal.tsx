import React, { useState } from "react";

type removeModal = {
  onCancel: Function;
  onRemove: Function;
  isOpen: boolean;
  message: string;
  actionBtnName: string;
};

const RemoveModal = ({
  onCancel,
  onRemove,
  isOpen,
  message,
  actionBtnName,
}: removeModal) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50  ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className=" absolute w-full h-full bg-gray-900 opacity-70   "></div>

      <div className="bg-[#1f1f20] max-w-[85%] mx-auto rounded-lg shadow-lg z-50 border-2 border-white border-opacity-80 text-white px-3 py-2">
        <div className="text-center py-4 px-2 ">
          <p className="text-lg font-semibold">{message}</p>
          <div className=" flex gap-5 justify-center item-center mt-5 ">
            <button
              onClick={() => {
                onCancel();
              }}
              className="px-4 py-2  bg-gray-400 hover:bg-gray-500 text-white rounded font-semibold border border-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onRemove();
              }}
              className="px-4 py-2 bg-gray-950 hover:bg-red-700 text-white rounded font-semibold border border-gray-500"
            >
              {actionBtnName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveModal;
