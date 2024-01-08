// import toast from "react-hot-toast";
import multiSig from "../../assets/SettingPageIcons/puzzle.svg";
import recovery from "../../assets/SettingPageIcons/recovered.svg";
import logOut from "../../assets/SettingPageIcons/logout.svg";
// import connections from "../../assets/SettingPageIcons/connections.svg";
// import addressBook from "../../assets/SettingPageIcons/address-book.svg";
// import networks from "../../assets/SettingPageIcons/network.svg";
// import faq from "../../assets/SettingPageIcons/question.svg";
// import termsOfServices from "../../assets/SettingPageIcons/termsOfServices.svg";
// import privacyPolicy from "../../assets/SettingPageIcons/privacyPolicy.svg";
// import currency from "../../assets/SettingPageIcons/currency.svg";

type settingOptionsType = {
  logo: string;
  title: string;
  description?: string;
  navigateTo: string;
};
// either pass navigate as optional parameter to the above or pass a funciton below
// get the current current currency nad put it there in the currency tab

// eslint-disable-next-line import/prefer-default-export
export const settingOptions: settingOptionsType[] = [
  {
    logo: `${multiSig}`,
    title: "Setup Multisig",
    description: "Setup multiple owners for your wallet to enhance security.",
    navigateTo: "",
  },
  {
    logo: `${recovery}`,
    title: "Setup Social Recovery",
    description: "Setup recovery options for added account safety.",
    navigateTo: "",
  },
  // {
  //   logo: `${connections}`,
  //   title: "Connections",
  //   description: "Connect with your favorite dApps and manage them here",
  //   navigateTo: "",
  // },
  // {
  //   logo: `${addressBook}`,
  //   title: "Address Book",
  //   description:
  //     "Create and save your frequent contacts here for effortless transactions",
  //   navigateTo: "",
  // },
  // {
  //   logo: `${networks}`,
  //   title: "Networks",
  //   description: "Manage all available networks/chains",
  //   navigateTo: "",
  // },
  // {
  //   logo: `${currency}`,
  //   title: "Currency",
  //   description: "Current: USD $",
  //   navigateTo: "",
  // },

  // {
  //   logo: `${termsOfServices}`,
  //   title: "Terms Of Service",
  //   description: "Terms of service and other legal informations",
  //   navigateTo: "",
  // },
  // {
  //   logo: `${privacyPolicy}`,
  //   title: "Privacy Policy",
  //   navigateTo: "",
  // },
  // {
  //   logo: `${faq}`,
  //   title: "FAQ",
  //   navigateTo: "/dashboard",
  // },
  {
    logo: `${logOut}`,
    title: "Log Out",
    navigateTo: "",
  },
];
