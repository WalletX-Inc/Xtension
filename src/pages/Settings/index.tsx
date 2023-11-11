import React from "react";
import { useNavigate } from "react-router-dom";
import AccountCard from "../../components/AccountCard";
import SettingOptions from "./SettingOptions";

const Settings = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className=" max-w-[350px] mx-auto  bg-[#1f1f20]">
        <header className="flex justify-center items-center mb-4 text-white">
          <h1 className="text-2xl font-semibold mx-auto">Settings</h1>
        </header>
        <div className="overflow-y-scroll max-h-screen ">
          <AccountCard />
          <SettingOptions />
        </div>
      </div>
    </>
  );
};

export default Settings;
