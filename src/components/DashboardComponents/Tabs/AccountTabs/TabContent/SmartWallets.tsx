import { useConfig } from "../../../../../context/ConfigProvider";
import {
  generateAddressIcon,
  getShortDisplayString,
} from "../../../../../utils/helper";
import openPage from "../../../../../assets/open.svg";

const SmartWallets = () => {
  const { smartAccountAddress, balance } = useConfig();

  return (
    <>
      <div
        className={
          "flex gap-1 flex-row items-center hover:bg-gray-700  hover:bg-opacity-50  px-4 pt-3 pb-4  "
        }
      >
        <div>
          <img
            src={generateAddressIcon(smartAccountAddress)}
            alt="token Logo"
            className=" w-9 rounded-full object-cover mr-4 border-2"
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <div>
            <p className="flex gap-2 ">
              <span className="text-[14px] font-semibold">Account 1</span>
              <img
                src={openPage}
                className="h-5 "
                alt="openThePageWithItsQRCode"
              />
            </p>
            <p className="text-[12px] font-semibold overflow-hidden text-gray-400">
              {getShortDisplayString(smartAccountAddress)}
            </p>
          </div>
          <div className="items-end text-base">
            <p title="current Balance">{Number(balance.SCW).toFixed(5)}</p>
            <p title="balance in dollars"></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SmartWallets;
