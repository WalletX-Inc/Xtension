import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import accountDetails from "../../assets/scan-barcode.svg";
import visitExplorer from "../../assets/export.svg";
import connectedSites from "../../assets/connect.svg";
import extensions from "../../assets/snaps.svg";
import support from "../../assets/message-question.svg";
import settings from "../../assets/setting.svg";
import lockWallet from "../../assets/lock.svg";
import { log } from "../../utils/helper";

type quickSettingsModalParams = {
  isOpen: boolean;
  onClose: () => any;
};

const QuickSettings = ({ isOpen, onClose }: quickSettingsModalParams) => {
  const modal = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const closeModalOnOutsideClick = (e: any) => {
      if (!(modal.current as any).contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", closeModalOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeModalOnOutsideClick);
    };
  }, []);

  const quickSettings = [
    {
      title: "Connected sites",
      icon: `${connectedSites}`,
      action: () => {
        log("Action in Connected sites");
      },
    },
    {
      title: "Extensions",
      icon: `${extensions}`,
      action: () => {
        log("Action in Extensions");
      },
    },
    {
      title: "Support",
      icon: `${support}`,
      action: () => {
        log("Action in Support");
      },
    },
    {
      title: "Settings",
      icon: `${settings}`,
      action: () => {
        navigate("/dashboard/settings");
      },
    },
    {
      title: "Lock WalletX",
      icon: `${lockWallet}`,
      action: () => {
        log("Action Lock WalletX");
      },
    },
  ];

  return (
    <div
      className={`fixed inset-0 flex mt-14  justify-end z-50  ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-30"></div>
      <div
        ref={modal}
        className="bg-[#1f1f20] h-fit  w-[200px]  rounded-lg shadow-sm relative shadow-black  divide-y divide-opacity-50"
      >
        {/* Account Options  */}
        <div>
          <div
            className={
              "flex  flex-col items-start hover:bg-gray-700  hover:bg-opacity-50  px-4 py-3 "
            }
          >
            <div className="flex gap-2 justify-center items-center ">
              <img src={accountDetails} alt="token Logo" className="h-4 " />
              <p className="text-[15px] "> Account Details</p>
            </div>
          </div>
          <div
            className={
              "flex  flex-col items-start hover:bg-gray-700  hover:bg-opacity-50  px-4 py-3 "
            }
          >
            <div className="flex gap-2 justify-center items-center ">
              <img src={visitExplorer} alt="token Logo" className="h-4 " />
              <div className="flex flex-col ">
                <p className="text-[15px] "> View on explorer</p>
                {/* Below should be the dynamic link of the perticular blockchain explorer */}
                <p className="text-sm">mumbai.polygonscan.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div>
          {quickSettings.map((qs) => (
            <>
              <div
                className={
                  "flex  flex-col items-start hover:bg-gray-700  hover:bg-opacity-50  px-4 py-3 "
                }
                onClick={() => {
                  qs.action();
                }}
              >
                <div className="flex gap-2 justify-center items-center ">
                  <img src={qs.icon} alt="token Logo" className="h-4 " />
                  <p className="text-[15px] ">{qs.title}</p>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickSettings;
