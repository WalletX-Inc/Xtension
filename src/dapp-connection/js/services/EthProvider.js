/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-undef */
/* eslint-disable no-constant-condition */

// import WalletProxi from "./WalletProxiInit";
import Store from "../components/StoreComponent";
import { log } from "../../../utils/helper";

function customConsoleLog(lineNumber, data) {
  log(`Inside EthProvider.js :${lineNumber} `, data);
}

class EthProvider {
  handleFunc = false;

  rejectFunc = false;

  navigateFunc = null;

  init(navigation) {
    this.navigateFunc = navigation;

    // AppController.start('connect_controller');

    // const tempState = Store.getTempState();
    const state = Store.getState();
    const ref = this;

    // window.addEventListener('message', ( ev ) => setTimeout( function( ev ){
    if (!chrome.runtime) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    chrome.runtime.onMessage.addListener((val, sender, response) => {
      // log(Number(new Date()), "ETH PROV", ev );
      customConsoleLog(28, val);
      setTimeout(
        (ev) => {
          log("message from bg (eth-provider)", { ev, state });
          if (ev.data.type === "FROM_BG") {
            customConsoleLog(33, ev);
            if (false) {
              // if (!WalletProxi.isLocked()) {
              // AppController.start("lock_controller");
              log(Number(new Date()), "wallet is locked");
              ref.respond(ev.data.id, {
                error: {
                  message: "Unauthorized",
                  code: 4100,
                  data: "The requested method and/or account has not been authorized by the user.",
                },
                locked: true,
              });

              // log(Number(new Date()), 'adding onunlock');
              // AppController.onUnlock( () => {
              //     ref.handle_request( ev.data.payload );
              // }, () => {
              //     ref.respond( { error: {
              //         message: 'Unauthorized',
              //         code: 4100,
              //         data: 'The requested method and/or account has not been authorized by the user.'
              //     }, locked: true } );
              // });
            } else {
              log(
                Number(new Date()),
                "INSIDE ETHPROVIDER first ELSE IF",
                ev.data.payload,
              );
              // if (['eth_sendTransaction', 'wallet_switchEthereumChain'].indexOf(ev.data.payload.method) === -1 && (state.connect_title && state.connect_title === ev.data?.from?.title && state.connect_origin === ev.data?.from?.origin)) {
              if (
                [
                  "eth_sign",
                  "personal_sign",
                  "eth_sendTransaction",
                  "wallet_switchEthereumChain",
                  "wallet_addEthereumChain",
                ].indexOf(ev.data.payload.method) === -1 &&
                state.connect_title &&
                state.connect_title === ev.data?.from?.title &&
                state.connect_origin === ev.data?.from?.origin
              ) {
                log("INSIDE ETHPROVIDER first IF", ev.data.payload);

                ref.handle_request(ev.data.id, ev.data.payload, ev.data.from);
              } else if (
                ev.data.payload.method === "eth_sign" ||
                ev.data.payload.method === "personal_sign"
              ) {
                log(Number(new Date()), "INSIDE ETHPROVIDER ", ev.data.payload);
                if (ev.data.payload.method === "personal_sign") {
                  Store.saveTempState({
                    address: ev.data.payload.params[1],
                    message: ev.data.payload.params[0],
                    connect_title: ev.data?.from?.title,
                    connect_origin: ev.data?.from?.origin,
                  });
                } else {
                  Store.saveTempState({
                    address: ev.data.payload.params[0],
                    message: ev.data.payload.params[1],
                    connect_title: ev.data?.from?.title,
                    connect_origin: ev.data?.from?.origin,
                  });
                }
                // AppController.start("sign_message_external");
                // this.navigateFunc("/dashboard/dapp/sign-message");

                this.navigateFunc("/dashboard/dapp/signature");
                // window.location.replace(`${window.location.hostname}/dashboard/dapp/sign-message`)
                // window.location.assign(`${window.location.hostname}/dashboard/dapp/sign-message`)

                customConsoleLog(100, "AFTER WINDOW ASSIGN");
                ref.onInteraction(
                  (resp) => {
                    Store.clearTempState();
                    log(Number(new Date()), " sign message info ", resp);
                    ref.respond(ev.data.id, resp);
                  },
                  (reason) => {
                    Store.clearTempState();
                    ref.respond(ev.data.id, {
                      error: {
                        message: "User Rejected Request",
                        code: 4001,
                        data: reason || "The user rejected the request.",
                      },
                    });
                  },
                  () => {
                    Store.clearTempState();
                    ref.respond(ev.data.id, { message: "closing" });
                  },
                );
              } else if (ev.data.payload.method === "eth_sendTransaction") {
                log(Number(new Date()), "INSIDE ETHPROVIDER ", ev.data.payload);
                Store.saveTempState({
                  transactionData: ev.data.payload.params[0],
                  useExternalFee: true,
                });
                // AppController.start("send_transaction_external");
                this.navigateFunc("/dashboard/dapp/transaction");

                ref.onInteraction(
                  (resp) => {
                    Store.clearTempState();
                    log(" send transaction hash info ", resp);
                    ref.respond(ev.data.id, resp.receipt.transactionHash);
                    // ref.respond(ev.data.id, resp.transactionHash);
                  },
                  (reason) => {
                    Store.clearTempState();
                    ref.respond(ev.data.id, {
                      error: {
                        message: "User Rejected Request",
                        code: 4001,
                        data: reason || "The user rejected the request.",
                      },
                    });
                  },
                  () => {
                    Store.clearTempState();
                    ref.respond(ev.data.id, { message: "closing" });
                  },
                );
              } else if (
                ev.data.payload.method === "wallet_switchEthereumChain"
              ) {
                const chainId = ev.data.payload?.params[0]?.chainId;

                if (chainId) {
                  Store.saveTempState({
                    connect_title: ev.data?.from?.title,
                    connect_origin: ev.data?.from?.origin,
                    requestedChainId: chainId,
                  });
                } else {
                  Store.saveTempState({
                    connect_title: ev.data?.from?.title,
                    connect_origin: ev.data?.from?.origin,
                    requestedChainId: null,
                  });
                }

                log(Number(new Date()), "got switch chain info", ev);
                // user router to open required screen
                // App.showPage("switch-chain-screen");

                ref.onInteraction(
                  () => {
                    Store.clearTempState();
                    ref.handle_request(
                      ev.data.id,
                      ev.data.payload,
                      ev.data.from,
                    );
                  },
                  () => {
                    Store.clearTempState();
                    Store.saveTempState({
                      connect_title: false,
                      connect_origin: false,
                    });

                    ref.respond(ev.data.id, {
                      error: {
                        message: "User Rejected Request",
                        code: 4001,
                        data: "The user rejected the request.",
                      },
                    });
                  },
                  () => {
                    Store.clearTempState();
                    ref.respond(ev.data.id, { message: "closing" });
                  },
                );
              } else if (ev.data.payload.method === "wallet_addEthereumChain") {
                const chainId = ev.data.payload?.params[0]?.chainId;

                if (chainId) {
                  Store.saveTempState({
                    connect_title: ev.data?.from?.title,
                    connect_origin: ev.data?.from?.origin,
                    requestedChainId: chainId,
                  });
                } else {
                  Store.saveTempState({
                    connect_title: ev.data?.from?.title,
                    connect_origin: ev.data?.from?.origin,
                    requestedChainId: null,
                  });
                }

                log(Number(new Date()), "got switch chain info", ev);
                // user router to open required screen
                // App.showPage("add-chain-screen");

                ref.onInteraction(
                  () => {
                    Store.clearTempState();
                    ref.handle_request(
                      ev.data.id,
                      ev.data.payload,
                      ev.data.from,
                    );
                  },
                  () => {
                    Store.clearTempState();
                    Store.saveTempState({
                      connect_title: false,
                      connect_origin: false,
                    });

                    ref.respond(ev.data.id, {
                      error: {
                        message: "User Rejected Request",
                        code: 4001,
                        data: "The user rejected the request.",
                      },
                    });
                  },
                  () => {
                    Store.clearTempState();
                    ref.respond(ev.data.id, { message: "closing" });
                  },
                );
              } else {
                // const _state = Store.getTempState();

                // console.log("THIS IS OPENING FOR CONNECTION");

                // if (
                //   _state?.connect_title &&
                //   _state?.connect_title === ev.data?.from?.title &&
                //   _state?.connect_origin &&
                //   _state?.connect_origin === ev.data?.from?.origin
                // ) {
                //   ref.handle_request(ev.data.id, ev.data.payload, ev.data.from);
                //   return;
                // }

                Store.saveTempState({
                  connect_title: ev.data?.from?.title,
                  connect_origin: ev.data?.from?.origin,
                });
                // user router to open required screen
                // App.showPage("connect-dapp-screen");
                this.navigateFunc("dashboard/dapp/connect");

                ref.onInteraction(
                  (connectionData) => {
                    Store.clearTempState();
                    Store.saveState({
                      ...connectionData,
                      connect_title: ev.data?.from?.title,
                      connect_origin: ev.data?.from?.origin,
                    });
                    ref.handle_request(
                      ev.data.id,
                      ev.data.payload,
                      ev.data.from,
                      connectionData,
                    );
                  },
                  (reason) => {
                    Store.clearTempState();
                    Store.saveTempState({
                      connect_title: false,
                      connect_origin: false,
                    });

                    ref.respond(ev.data.id, {
                      error: {
                        message: "User Rejected Request",
                        code: 4001,
                        data: reason || "The user rejected the request.",
                      },
                    });
                  },
                  () => {
                    Store.clearTempState();
                    ref.respond(ev.data.id, { message: "closing" });
                  },
                );
              }
            }
          }
        },
        1000,
        { data: val },
      );
    });
  }

  async handle_request(id, data, from, connectionData) {
    log("HANDLE REQ", data);
    log(data.method);
    // window.WalletProxi = WalletProxi;

    // VARIABLES:
    let chains;
    let chainID;
    let chainRequested;

    // if (connectionData) {
    //   console.log({ connectionData });
    // }

    switch (data.method) {
      case "eth_accounts":
        if (false) {
          // if (await WalletProxi.isEmptyVault()) {
          this.respond(id, {
            error: {
              message: "User Rejected Request",
              code: 4001,
              data: "The user rejected the request.",
            },
          });
        } else {
          if (!connectionData) {
            connectionData = Store.getState();
          }

          const { address, chainId, isConnected, balance, chainDetails } =
            connectionData;
          // const balance = connectionData.balance; // wait WalletProxi.getWalletBalance(w?.address, true);

          const acc = [address];
          const dataObj = {
            addresses: acc,
            // chainId: process.env.NETWORK === 'ropsten' ? '0x03' : '0x1',
            chainId,
            node_uri: chainDetails.rpc,
            balance,
            payload: acc,
            block: "", // await WalletProxi.getLatesBlock(),
            origin: from.origin,
            method: data.method,
            isConnected,
          };

          // setTimeout(() => {
          this.respond(id, dataObj, null, true);
          // }, 10000);
        }

        break;

      case "eth_requestAccounts":
        if (false) {
          // if (await WalletProxi.isEmptyVault()) {
          this.respond(id, {
            error: {
              message: "User Rejected Request",
              code: 4001,
              data: "The user rejected the request.",
            },
          });
        } else {
          if (!connectionData) {
            connectionData = Store.getState();
          }

          const { address, chainId, isConnected, balance, chainDetails } =
            connectionData;
          // const balance = connectionData.balance; // wait WalletProxi.getWalletBalance(w?.address, true);

          const acc = [address];
          const dataObj = {
            addresses: acc,
            // chainId: process.env.NETWORK === 'ropsten' ? '0x03' : '0x1',
            chainId,
            node_uri: chainDetails.rpc,
            balance,
            payload: acc,
            block: "", // await WalletProxi.getLatesBlock(),
            origin: from.origin,
            method: data.method,
            isConnected,
          };

          // setTimeout(() => {
          this.respond(id, dataObj, null, true);
          // }, 10000);
        }

        break;

      case "eth_getBalance":
        // await WalletProxi.loadVault();
        // eslint-disable-next-line no-case-declarations
        // const aW = ""; // WalletProxi.getActiveWallet();
        // eslint-disable-next-line no-case-declarations
        // const { address } = aW;
        // eslint-disable-next-line no-case-declarations
        const balance = ""; // await WalletProxi.getWalletBalance(address, true);

        this.respond(id, balance);
        break;

      case "eth_sign":
        this.respond(id, data);
        break;

      case "eth_sendTransaction":
        this.respond(id, data);
        break;

      case "wallet_addEthereumChain":
        chains = ""; // await WalletProxi.getChains();
        log(Number(new Date()), "chain params", data);
        chainID = chains.reduce((acc, el, idx) => {
          if (
            parseInt(el.chainId, 10) === parseInt(data.params[0].chainId, 10)
          ) {
            acc = idx;
          }

          return acc;
        }, null);

        chainRequested = chains[chainID];
        if (chainID !== null) {
          // WalletProxi.setActiveChain(chainID, false, false);
          const activeNodeUri = ""; // await WalletProxi.getNodeURI();
          const activeWallet = ""; // WalletProxi.getActiveWallet();
          const walletBalance = ""; // await WalletProxi.getWalletBalance(
          // activeWallet.address,
          // );

          setTimeout(() => {
            this.respond(id, {
              method: "wallet_addEthereumChain",
              chainId: chainRequested.chainId,
              node_uri: activeNodeUri,
              addresses: [activeWallet.address],
              balance: walletBalance,
            });
          }, 100);
        } else if (!data.params[0].chainName) {
          this.respond(id, {
            error: {
              message: "Chain name cannot be empty",
              code: 4200,
              data: "Invalid chain data added.",
            },
          });
        } else if (!data.params[0].rpcUrls || !data.params[0].rpcUrls[0]) {
          this.respond(id, {
            error: {
              message: "Chain REC url cannot be empty",
              code: 4200,
              data: "Invalid chain RPC url added.",
            },
          });
        } else {
          // const RPC =
          //   typeof data.params[0].rpcUrls === "string"
          //     ? data.params[0].rpcUrls
          //     : data.params[0].rpcUrls[0];

          // await WalletProxi.addChain(
          //   data.params[0].chainName,
          //   data.params[0].chainName,
          //   data.params[0].chainId,
          //   RPC,
          // );

          // WalletProxi.setActiveChain(chainID, false, false);
          const activeNodeUri = ""; // await WalletProxi.getNodeURI();
          const activeWallet = ""; // WalletProxi.getActiveWallet();
          const walletBalance = "";
          // await WalletProxi.getWalletBalance(
          //   activeWallet.address,
          // );

          setTimeout(() => {
            this.respond(id, {
              method: "wallet_addEthereumChain",
              chainId: data.params[0].chainId,
              node_uri: activeNodeUri,
              addresses: [activeWallet.address],
              balance: walletBalance,
            });
          }, 100);
        }

        break;

      case "wallet_switchEthereumChain":
        chains = ""; // await WalletProxi.getChains();
        log(Number(new Date()), "chain params", data);
        chainID = chains.reduce((acc, el, idx) => {
          if (
            parseInt(el.chainId, 10) === parseInt(data.params[0].chainId, 10)
          ) {
            acc = idx;
          }

          return acc;
        }, null);
        chainRequested = chains[chainID];
        if (chainID !== null) {
          // WalletProxi.setActiveChain(chainID, false, false);
          const activeNodeUri = ""; // await WalletProxi.getNodeURI();
          const activeWallet = ""; // WalletProxi.getActiveWallet();
          const walletBalance = "";
          // await WalletProxi.getWalletBalance(
          //   activeWallet.address,
          // );

          setTimeout(() => {
            this.respond(id, {
              method: "wallet_switchEthereumChain",
              chainId: chainRequested.chainId,
              node_uri: activeNodeUri,
              addresses: [activeWallet.address],
              balance: walletBalance,
            });
          }, 100);
        } else {
          this.respond(id, {
            error: {
              message: "Unsupported Chain",
              code: 4200,
              data: "The Provider does not support the requested chain.",
            },
          });
        }

        break;

      default:
        this.respond(id, {
          error: {
            message: "Unsupported Method",
            code: 4200,
            data: "The Provider does not support the requested method.",
          },
        });
        break;
    }
  }

  respond(evId, data) {
    log("RESPONDING FROM EXT", data);
    // eslint-disable-next-line prefer-rest-params
    const events = arguments[2] ? { event: arguments[2] } : {};
    // eslint-disable-next-line prefer-rest-params
    const authoritative = arguments[3] ? { authoritative: true } : {};

    customConsoleLog(533, data);

    if (
      chrome &&
      chrome.hasOwnProperty("runtime") &&
      chrome.runtime.hasOwnProperty("sendMessage")
    ) {
      chrome.runtime.sendMessage({
        type: "FROM_POPUP",
        id: evId,
        payload: data,
        ...events,
        ...authoritative,
      });
    }
  }

  onInteraction(fnAcc, fnRej, fnClose) {
    customConsoleLog(551, "CALLING onInteraction");
    this.handleFunc = fnAcc;
    this.rejectFunc = fnRej;
    this.closeFunc = fnClose;
  }

  onAccept(params) {
    if (this.handleFunc) this.handleFunc(params);
  }

  onCancel(data) {
    if (this.rejectFunc) this.rejectFunc(data);
  }

  onClose() {
    if (this.closeFunc) this.closeFunc();
  }
}

const providerInstance = new EthProvider();

export default providerInstance;
