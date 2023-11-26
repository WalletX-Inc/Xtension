import React, { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/system-hooks/useAuth";
import { removeItemFromStorage, setItemInStorage } from "../../utils/helper";
import { settingOptions } from "./settingOptionsData";

import Modal from "../../../src/components/Modal";
import angle from "../../../src/assets/angleRight.svg";
import twitterLogo from "../../../src/assets/twitterLogo.svg";
import websiteLogo from "../../../src/assets/website.svg";

const SettingOptions = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState<boolean>(false);
  const openLogOutModal = () => {
    setIsLogOutModalOpen(true);
  };

  const closeLogOutModal = () => {
    setIsLogOutModalOpen(false);
  };

  const logOut = async() => {

    logout();
    setItemInStorage("isLoggedIn", false);
   await removeItemFromStorage("smartAccount");
    navigate("/login");
  };

  return (
    <div className="">
      <div
        className={` ${
          settingOptions.length === 4 ? "mb-9" : "mb-32"
        } max-w-[335px] mx-auto mt-2 divide-y-2 divide-opacity-20 divide-gray-500 mb-24`}
      >
        {settingOptions.map((options) => {
          return (
            <>
              <div
                onClick={() => {
                  if (options.title === "Log Out") {
                    openLogOutModal();
                  }
                  if (
                    options.navigateTo === "" &&
                    options.title !== "Log Out"
                  ) {
                    toast("Coming Soon", {
                      icon: "🔥",
                    });
                  } else navigate(options.navigateTo);
                }}
                className={`flex text-gray-100 py-5 hover:opacity-75`}
              >
                <div className="w-[10%] flex justify-center items-center">
                  <img
                    className="h-7 mx-auto  opacity-90"
                    src={options.logo}
                    alt="gas icon"
                  />
                </div>
                <div className="w-[80%] px-2 my-auto">
                  <h1 className="font-semibold text-base "> {options.title}</h1>
                  <p className="text-xs pr-1 text-gray-300 ">
                    {options.description}
                  </p>
                </div>
                <div className=" flex justify-center item-center w-[10%] text-xl font-semibold text-gray-300">
                  <img className="h-6" src={angle} alt="forward angle button" />
                </div>
              </div>
            </>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 justify-center item-center   mb-32  ">
        <div className="flex gap-10 justify-center items-center">
          <a href="https://www.walletx.info/" target="_blank" rel="noreferrer">
            <img className="h-6 mr-1" src={websiteLogo} alt="twitter logo" />
          </a>
          <a
            href="https://twitter.com/walletx_inc"
            target="_blank"
            rel="noreferrer"
          >
            <img className="h-4" src={twitterLogo} alt="twitter logo" />
          </a>
        </div>

        <span className="text-gray-400 text-xs ">Version 1.1.0</span>
      </div>

      <Modal
        isOpen={isLogOutModalOpen}
        onCancel={closeLogOutModal}
        message="Do you want to logout"
        actionBtnName="Log Out"
        onRemove={() => logOut()}
      />
    </div>
  );
};

export default SettingOptions;
