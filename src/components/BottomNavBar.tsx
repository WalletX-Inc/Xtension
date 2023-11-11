import { useState } from "react";
import { useNavigate } from "react-router-dom";

import homeIcon from "../../src/assets/NavBarIcons/homeIcon.svg";
import nftIcon from "../../src/assets/NavBarIcons/nftIcon.svg";
import fetauresIcon from "../../src/assets/NavBarIcons/featuresIcon.svg";
import activityIcon from "../../src/assets/NavBarIcons/activityIcon.svg";
import settingsIcon from "../../src/assets/NavBarIcons/settingsIcon.svg";
import TransactDrawer from "./TransactDrawer";

const BottomNavBar = () => {
  const Menus = [
    {
      name: "Home",
      icon: ` ${homeIcon}`,
      dis: "translate-x-0",
      navigate: "/dashboard",
    },
    {
      name: "NFT",
      icon: ` ${nftIcon}`,
      dis: "translate-x-16",
      navigate: "/dashboard/collectables",
    },
    {
      name: "Transact",
      icon: ` ${fetauresIcon}`,
      dis: "translate-x-32",
      navigate: "/dashboard",
    },
    {
      name: "Activity",
      icon: ` ${activityIcon}`,
      dis: "translate-x-48",
      navigate: "/dashboard/activity",
    },
    {
      name: "Settings",
      icon: ` ${settingsIcon}`,
      dis: "translate-x-64",
      navigate: "/dashboard/settings",
    },
  ];
  const [active, setActive] = useState(0);
  const [openTransactDrawer, setOpenTransactDrawer] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-gray-800 max-h-[4.4rem] px-2 rounded-xl fixed left-1/2 translate-x-[-50%] bottom-2 border-2 border-gray-950 z-50  ">
        <ul className="flex relative">
          <span
            className={`bg-gray-700  duration-500 ${Menus[active].dis} border-4 border-[#1f1f20] h-14 w-14 absolute
         -top-5 rounded-3xl -z-10 ml-1 `}
          >
            {/* left shadow box  */}
            <span
              className="w-3.5 h-3.5 bg-transparent absolute top-4 -left-[18px] 
          rounded-tr-[9px] "
            ></span>
            {/* right shadow box  */}
            <span
              className="w-3.5 h-3.5 bg-transparent absolute top-4 -right-[18px] 
          rounded-tl-[11px] "
            ></span>
          </span>
          {Menus.map((menu, i) => (
            <li
              onClick={() => {
                if (menu.name !== "Transact") {
                  setOpenTransactDrawer(false);
                  navigate(menu.navigate);
                } else {
                  setOpenTransactDrawer(true);
                }
              }}
              key={i}
              className="w-16"
            >
              <a
                className="flex flex-col text-center pt-2"
                onClick={() => setActive(i)}
              >
                <span
                  className={`text-xl cursor-pointer duration-500 flex items-center justify-center ${
                    i === active && "-mt-3  text-white"
                  }`}
                >
                  {/* <ion-icon name={menu.icon}></ion-icon> */}
                  <img className="h-7" src={menu.icon} />
                </span>
                <span
                  className={` ${
                    active === i
                      ? "translate-y-[10px] duration-1000 opacity-100   "
                      : "opacity-0 translate-y-10"
                  } `}
                >
                  {menu.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <TransactDrawer isOpen={openTransactDrawer} />
    </>
  );
};

export default BottomNavBar;
