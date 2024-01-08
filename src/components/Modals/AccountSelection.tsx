import { Search, X } from "react-feather";
import Tabs from "../DashboardComponents/Tabs/AccountTabs/Tabs";

type accountSelectionModalParams = {
  isOpen: boolean;
  onClose: () => any;
};
const AccountSelection = ({ isOpen, onClose }: accountSelectionModalParams) => (
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
          <div className="text-base font-bold m-auto">Select a account</div>
          <button
            className="hover:opacity-70 text-xl"
            onClick={() => {
              onClose();
            }}
          >
            <X style={{ color: "#FFFFFF", fill: "#FFFFFF" }} />
          </button>
        </div>

        {/* Serch Box  */}
        <div className="flex items-center w-[90%] mx-auto border border-gray-300 rounded-lg mt-2 mb-3 p-2">
          <button className="min-w-fit  pr-1 opacity-60">
            <Search className="h-5 mx-auto my-auto" />
          </button>
          <input
            type="text"
            placeholder="Search..."
            className="w-full focus:outline-none pl-1 bg-transparent"
            value=""
            //   onChange={handleInputChange}
            //   onFocus={handleFocus}
          />
        </div>
        <Tabs />
      </div>
    </div>
  </>
);

export default AccountSelection;
