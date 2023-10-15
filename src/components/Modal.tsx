import React, { useState } from "react";

type removeModal = {
  onCancel: Function;
  onRemove: Function;
  isOpen: boolean;
};

const RemoveModal = ({ onCancel, onRemove, isOpen }: removeModal) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50  ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className=" absolute w-full h-full bg-gray-900 opacity-70   "></div>

      <div className=" bg-white max-w-[80%] mx-auto rounded shadow-lg z-50 border-2 border-gray-900 border-opacity-80">
        <div className="text-center py-4 px-2 text-gray-600">
          <p className="text-lg font-semibold">
            Are you sure you want to remove?
          </p>
          <div className=" flex gap-5 justify-center item-center mt-5 ">
            <button
              onClick={() => {
                onCancel();
              }}
              className="px-4 py-2  bg-gray-400 hover:bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onRemove();
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveModal;
