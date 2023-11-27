import Web3Provider from "./js/Web3Provider/Web3Provider";

// if (window.ethereum) {
//     console.log(Number(new Date()), 'Please uninstall other wallets in order to use WalletX.');
// } else {
(function () {
  // console.log(Number(new Date()), 'ok, loaded content script');
  let uniqid = 0;
  let events = {};
  let state = {
    accounts: false,
    chainId: false,
    connected: false,
  };

  window.walletX = new Web3Provider();
})();

// }
