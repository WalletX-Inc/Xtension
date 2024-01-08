/* eslint-disable no-undef */
import Web3Provider from "./js/Web3Provider/Web3Provider";

// if (window.ethereum) {
//     log(Number(new Date()), 'Please uninstall other wallets in order to use WalletX.');
// } else {
(function () {
  // // log(Number(new Date()), 'ok, loaded content script');
  // // const uniqid = 0;
  // // const events = {};
  // // const state = {
  // //   accounts: false,
  // //   chainId: false,
  // //   connected: false,
  // // };

  // // window.walletX = new Web3Provider();
  // window.ethereum = new Web3Provider();

  // console.log(Number(new Date()), 'ok, loaded content script');

  window.ethereum = new Web3Provider();
})();

// }
