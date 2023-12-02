import React from "react";
import SettingOptions from "./SettingOptions";
import { settingOptions } from "./settingOptionsData";

const Settings = () => (
  <>
    <div className=" max-w-[350px] mx-auto  bg-[#1f1f20]">
      <header className="flex justify-center items-center  text-white">
        <h1 className="text-2xl font-semibold mx-auto mt-4 mb-1 ">Settings</h1>
      </header>
      <div
        className={`${
          settingOptions.length >= 5 ? "overflow-y-scroll max-h-screen " : ""
        }`}
      >
        {/* <AccountCard /> */}
        <SettingOptions />
      </div>
    </div>
  </>
);

export default Settings;
