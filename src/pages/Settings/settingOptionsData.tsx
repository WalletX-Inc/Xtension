import multiSig from "../../../src/assets/SettingPageIcons/puzzle.svg";
import recovery from "../../../src/assets/SettingPageIcons/recovered.svg";
import connections from "../../../src/assets/SettingPageIcons/connections.svg";
import addressBook from "../../../src/assets/SettingPageIcons/address-book.svg";
import networks from "../../../src/assets/SettingPageIcons/network.svg";
import faq from "../../../src/assets/SettingPageIcons/question.svg";
import termsOfServices from "../../../src/assets/SettingPageIcons/termsOfServices.svg";
import privacyPolicy from "../../../src/assets/SettingPageIcons/privacyPolicy.svg";
import logOut from "../../../src/assets/SettingPageIcons/logout.svg";
import currency from "../../../src/assets/SettingPageIcons/currency.svg";

import toast from "react-hot-toast";

type settingOptionsType = {
  logo: string;
  title: string;
  description?: string;
  navigateTo: string;
};
// either pass navigate as optional parameter to the above or pass a funciton below
// get the current current currency nad put it there in the currency tab

export const settingOptions: settingOptionsType[] = [
  {
    logo: `${multiSig}`,
    title: "Setup Mutli Sig",
    description: "Setup multiple owners for your wallet to enhance security.",
    navigateTo: "",
  },
  {
    logo: `${recovery}`,
    title: "Set Up Recover",
    description: "Set up recovery options for added account safety.",
    navigateTo: "",
  },
  {
    logo: `${connections}`,
    title: "Connections",
    description: "Connect with your favorite dApps and manage them here",
    navigateTo: "",
  },
  {
    logo: `${addressBook}`,
    title: "Address Book",
    description:
      "Create and save your frequent contacts here for effortless transactions",
    navigateTo: "",
  },
  {
    logo: `${networks}`,
    title: "Networks",
    description: "Manage all available networks/chains",
    navigateTo: "",
  },
  {
    logo: `${currency}`,
    title: "Currency",
    description: "Current: USD $",
    navigateTo: "",
  },

  {
    logo: `${termsOfServices}`,
    title: "Terms Of Service",
    description: "Terms of service and other legal informations",
    navigateTo: "",
  },
  {
    logo: `${privacyPolicy}`,
    title: "Privacy Policy",
    navigateTo: "",
  },
  {
    logo: `${faq}`,
    title: "FAQ",
    navigateTo: "/dashboard",
  },
  {
    logo: `${logOut}`,
    title: "Log Out",
    navigateTo: "",
  },
];
