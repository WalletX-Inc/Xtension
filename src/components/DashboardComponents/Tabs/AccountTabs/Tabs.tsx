import React, { useState } from "react";
import GeneralWallets from "./TabContent/GeneralWallets";
import SmartWallets from "./TabContent/SmartWallets";


const Tabs = () => {
  const [activeTab, setActiveTab] = useState("EOA");

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="flex space-x-4 w-full justify-between px-6 text-base tracking-wide ">
        <div
          className={`cursor-pointer text-[13px] truncate px-4 py-2 ${
            activeTab === "EOA"
              ? "text-blue-500 border-b-2 border-blue-500"
              : ""
          }`}
          onClick={() => handleTabClick("EOA")}
        >
          General Wallets
        </div>
        <div
          className={`cursor-pointer text-[13px] px-4 py-2 ${
            activeTab === "SCW"
              ? "text-blue-500 border-b-2 border-blue-500"
              : ""
          }`}
          onClick={() => handleTabClick("SCW")}
        >
          SmartWallets
        </div>
       
      </div>
      <div className="mt-4 w-full">
        {activeTab === "EOA" && <GeneralWallets />}
        {activeTab === "SCW" && <SmartWallets />}
      </div>
    </div>
  );
};

export default Tabs;
