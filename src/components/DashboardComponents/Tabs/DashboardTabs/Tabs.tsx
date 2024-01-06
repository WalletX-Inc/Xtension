import React, { useState } from "react";
import Nfts from "../DashboardTabs/TabContent/Nfts";
import Activity from "../DashboardTabs/TabContent/Activity";
import Tokens from "../DashboardTabs/TabContent/Tokens";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("tokens");

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="flex space-x-4 w-full justify-between px-6 text-base tracking-wide ">
        <div
          className={`cursor-pointer px-4 py-2 ${
            activeTab === "tokens"
              ? "text-blue-500 border-b-2 border-blue-500"
              : ""
          }`}
          onClick={() => handleTabClick("tokens")}
        >
          Tokens
        </div>
        <div
          className={`cursor-pointer px-4 py-2 ${
            activeTab === "nfts"
              ? "text-blue-500 border-b-2 border-blue-500"
              : ""
          }`}
          onClick={() => handleTabClick("nfts")}
        >
          NFTs
        </div>
        <div
          className={`cursor-pointer px-4 py-2 ${
            activeTab === "activity"
              ? "text-blue-500 border-b-2 border-blue-500"
              : ""
          }`}
          onClick={() => handleTabClick("activity")}
        >
          Activity
        </div>
      </div>
      <div className="mt-4 w-full">
        {activeTab === "tokens" && <Tokens />}
        {activeTab === "nfts" && <Nfts />}
        {activeTab === "activity" && <Activity />}
      </div>
    </div>
  );
};

export default Tabs;
