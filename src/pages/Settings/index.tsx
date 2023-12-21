import React from "react";
import { useNavigate } from "react-router-dom";
import SettingOptions from "./SettingOptions";
import { settingOptions } from "./settingOptionsData";

const Settings = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className=" max-w-[350px] mx-auto  bg-[#1f1f20]">
        <header className="flex justify-center items-center  text-white">
          <h1 className="text-2xl font-semibold mx-auto mt-4 mb-1 ">
            Settings
          </h1>
        </header>
        <div
          className={`${
            settingOptions.length >= 5 ? "overflow-y-scroll max-h-screen " : ""
          }`}
        >
          <SettingOptions />
        </div>
      </div>
    </>
  );
};

export default Settings;
