import React, { useState } from "react";
import CustomToken from "./TabContent/CustomToken";
import Search from "./TabContent/Search";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("CustomToken");

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="flex space-x-4 w-full justify-between px-6 text-base tracking-wide ">
        <div
          className={`cursor-pointer text-base truncate px-4 py-2 ${
            activeTab === "CustomToken"
              ? "text-blue-500 border-b-2 border-blue-500"
              : ""
          }`}
          onClick={() => handleTabClick("CustomToken")}
        >
          Custom Token
        </div>
        <div
          className={`cursor-pointer text-base px-4 py-2 ${
            activeTab === "Search"
              ? "text-blue-500 border-b-2 border-blue-500"
              : ""
          }`}
          onClick={() => handleTabClick("Search")}
        >
          Search
        </div>
      </div>
      <div className="mt-4 w-full">
        {activeTab === "Search" && <Search />}
        {activeTab === "CustomToken" && <CustomToken />}
      </div>
    </div>
  );
};

export default Tabs;
