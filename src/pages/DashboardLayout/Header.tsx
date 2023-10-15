import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logoIcon from "../../assets/icons/icon16.png";
import menuIcon from "../../assets/icons/menu.png";
import { useAuth } from "../../hooks/useAuth";
import { setItemInStorage } from "../../utils/helper";
import Modal from "../../components/common/Modal";
import { IoIosArrowDropdown } from "react-icons/io";

const navbarData = [
  {
    title: "Setup Recovery",
    subTitle: "coming soon",
    href: "/",
    cname:
      "font-medium opacity-60 w-full flex justify-center p-2.5 md:border-none md:p-0 md:w-auto pointer-events-none",
  },
  {
    title: "Setup MultiSig",
    subTitle: "coming soon",
    href: "/",
    cname:
      "font-medium opacity-60 w-full flex justify-center p-2.5 md:border-none md:p-0 md:w-auto pointer-events-none",
  },
  {
    title: "Log Out",
    href: "/logout",
    cname:
      "font-medium w-full flex justify-center p-2.5 md:border-none md:p-0 md:w-auto",
  },
];

export default function Header() {
  const [toggle, setToggle] = useState(false);
  const [openAccountModal, setOpenAccountModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const showNav = (key?: string) => {
    if (key === "/logout") {
      logout();
      setItemInStorage("isLoggedIn", false);
      navigate("/register");
    }
    setToggle(!toggle);
  };

  // start mobile first plus facile
  return (
    <nav className="text-white fixed top-0 w-full bg-gray-700 items-center flex p-4">
      <div className="flex justify-between items-center w-full flex-wrap md:flex-nowrap">
        <h1 className="text-xl font-bold cursor-pointer  hover:opacity-70">
          {" "}
          <img className="w-8" src={logoIcon} alt="X" />
        </h1>
        <h1
          className="text-xl font-bold flex items-center cursor-pointer hover:opacity-70  hover:border-1 hover:border-gray-600 hover:shadow-lg rounded p-[3px]"
          onClick={() => {
            setOpenAccountModal(true);
          }}
        >
          Account 1
          <IoIosArrowDropdown className="mx-3 " />
        </h1>

        <button
          className="flex justify-end  hover:opacity-70"
          onClick={() => showNav()}
        >
          <img className="w-6" src={menuIcon} alt="X" />
        </button>
        <ul
          className={`${
            toggle
              ? "fixed flex flex-col top-[61px] right-0 text-white bg-gray-700 rounded-md"
              : " hidden"
          }  `}
        >
          {toggle &&
            navbarData.map((link, index) => {
              return (
                <li
                  key={index}
                  className={`relative flex flex-row items-center h-9 focus:outline-none  border-l-4 border-transparent pr-6 ${link.cname}`}
                >
                  <Link
                    className="inline-flex justify-center items-center ml-4"
                    to={link.href}
                    onClick={() => showNav(link.href)}
                  >
                    {link.title}{" "}
                  
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
      <Modal
        isOpen={openAccountModal}
        onClose={() => {
          setOpenAccountModal(false);
        }}
        headerText="Select an Account"
      >
        <div className="py-3 px-3 sm:py-4 shadow-lg cursor-pointer" onClick={()=>{
          setOpenAccountModal(false);
        }}>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                className="w-8 h-8 rounded-full"
                src={logoIcon}
                alt="Wallet x"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate dark:text-white">Account 1</p>
              <p className="text-sm truncate dark:text-gray-400">
                0x1123...2432
              </p>
            </div>
            <div className="flex flex-col text-right text-md">
              <div className="inline-flex items-center text-base font-semibold dark:text-white">
                0 ETH
              </div>
              <div>$0.00 USD</div>
            </div>
          </div>
        </div>
      </Modal>
    </nav>
  );
}
