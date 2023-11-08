import { useState } from "react";
import homeIcon from "../../src/assets/NavBarIcons/homeIcon.svg";
import nftIcon from "../../src/assets/NavBarIcons/nftIcon.svg";
import fetauresIcon from "../../src/assets/NavBarIcons/featuresIcon.svg";
import activityIcon from "../../src/assets/NavBarIcons/activityIcon.svg";
import settingsIcon from "../../src/assets/NavBarIcons/settingsIcon.svg";

const BottomNavBar = () => {
  const Menus = [
    { name: "Home", icon: ` ${homeIcon}`, dis: "translate-x-0" },
    { name: "NFT", icon: ` ${nftIcon}`, dis: "translate-x-16" },
    { name: "", icon: ` ${fetauresIcon}`, dis: "translate-x-32" },
    { name: "Activity", icon: ` ${activityIcon}`, dis: "translate-x-48" },
    { name: "Settings", icon: ` ${settingsIcon}`, dis: "translate-x-64" },
  ];
  const [active, setActive] = useState(0);
  return (
    <div className="bg-gray-800 max-h-[4.4rem] px-2 rounded-xl fixed left-1/2 translate-x-[-50%] bottom-2   ">
      <ul className="flex relative">
        <span
          className={`bg-blue-800  duration-500 ${Menus[active].dis} border-4 border-[#1f1f20] h-14 w-14 absolute
         -top-5 rounded-3xl -z-10 ml-1 `}
        >
          {/* left shadow box  */}
          <span
            className="w-3.5 h-3.5 bg-transparent absolute top-4 -left-[18px] 
          rounded-tr-[9px] shadow-myShadow1"
          ></span>
          {/* right shadow box  */}
          <span
            className="w-3.5 h-3.5 bg-transparent absolute top-4 -right-[18px] 
          rounded-tl-[11px] shadow-myShadow2"
          ></span>
        </span>
        {Menus.map((menu, i) => (
          <li key={i} className="w-16">
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
  );
};

export default BottomNavBar;
