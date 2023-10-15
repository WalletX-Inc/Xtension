import Web3Provider from "./Web3Provider"

(function () {
    // console.log(Number(new Date()), 'ok, loaded content script');
    let uniqid = 0;
    let events = {};
    let state = {
        accounts: false,
        chainId: false,
        connected: false
    };

    window.walletX = new Web3Provider()

})();
