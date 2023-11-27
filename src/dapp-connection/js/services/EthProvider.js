import WalletProxi from "./WalletProxiInit";
import Store from "../components/StoreComponent";

function customConsoleLog(lineNumber, data) {
  console.log(`Inside EthProvider.js :${lineNumber} `, data);
}

class EthProvider {
  handleFunc = false;
  rejectFunc = false;
  navigateFunc = null;

  constructor() {}

  init(navigation) {
    this.navigateFunc = navigation;

    // AppController.start('connect_controller');

    const state = Store.getState();
    const ref = this;
    // window.addEventListener('message', ( ev ) => setTimeout( function( ev ){
    if (!chrome.runtime) {
      return;
    }
    chrome.runtime.onMessage.addListener((ev, sender, response) => {
      // console.log(Number(new Date()), "ETH PROV", ev );
      customConsoleLog(28, ev);
      setTimeout(
        (ev) => {
          console.log(Number(new Date()), "message from bg (eth-provider)", ev);
          if (ev.data.type == "FROM_BG") {
            customConsoleLog(33, ev);
            if (!WalletProxi.isLocked()) {
              // AppController.start("lock_controller");
              console.log(Number(new Date()), "wallet is locked");
              ref.respond(ev.data.id, {
                error: {
                  message: "Unauthorized",
                  code: 4100,
                  data: "The requested method and/or account has not been authorized by the user.",
                },
                locked: true,
              });

              // console.log(Number(new Date()), 'adding onunlock');
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
              console.log(
                Number(new Date()),
                "INSIDE ETHPROVIDER first ELSE IF",
                ev.data.payload
              );
              // if (['eth_sendTransaction', 'wallet_switchEthereumChain'].indexOf(ev.data.payload.method) == -1 && (state.connect_title && state.connect_title == ev.data?.from?.title && state.connect_origin == ev.data?.from?.origin)) {
              if (
                [
                  "eth_sign",
                  "eth_sendTransaction",
                  "wallet_switchEthereumChain",
                  "wallet_addEthereumChain",
                ].indexOf(ev.data.payload.method) == -1 &&
                state.connect_title &&
                state.connect_title == ev.data?.from?.title &&
                state.connect_origin == ev.data?.from?.origin
              ) {
                console.log(
                  Number(new Date()),
                  "INSIDE ETHPROVIDER first IF",
                  ev.data.payload
                );

                ref.handle_request(ev.data.id, ev.data.payload, ev.data.from);
              } else if (ev.data.payload.method == "eth_sign") {
                console.log(
                  Number(new Date()),
                  "INSIDE ETHPROVIDER ",
                  ev.data.payload
                );
                Store.saveLocalState({
                  address: ev.data.payload.params[0],
                  message: ev.data.payload.params[1],
                  useExternalFee: true,
                  connect_title: ev.data?.from?.title,
                  connect_origin: ev.data?.from?.origin,
                });
                // AppController.start("sign_message_external");
                this.navigateFunc("/dashboard/dapp/sign-message");
                // window.location.replace(`${window.location.hostname}/dashboard/dapp/sign-message`)
                // window.location.assign(`${window.location.hostname}/dashboard/dapp/sign-message`)

                customConsoleLog(100, "AFTER WINDOW ASSIGN")
                ref.onInteraction(
                  (resp) => {
                    console.log(
                      Number(new Date()),
                      " sign message info ",
                      resp
                    );
                    ref.respond(ev.data.id, resp);
                  },
                  () => {
                    ref.respond(ev.data.id, {
                      error: {
                        message: "User Rejected Request",
                        code: 4001,
                        data: "The user rejected the request.",
                      },
                    });
                  },
                  () => {
                    ref.respond(ev.data.id, { message: "closing" });
                  }
                );
              } else if (ev.data.payload.method == "eth_sendTransaction") {
                console.log(
                  Number(new Date()),
                  "INSIDE ETHPROVIDER ",
                  ev.data.payload
                );
                Store.saveLocalState({
                  ...ev.data.payload.params[0],
                  useExternalFee: true,
                });
                // AppController.start("send_transaction_external");

                ref.onInteraction(
                  (resp) => {
                    console.log(
                      Number(new Date()),
                      " send transaction hash info ",
                      resp
                    );
                    ref.respond(ev.data.id, resp.transactionHash);
                  },
                  () => {
                    ref.respond(ev.data.id, {
                      error: {
                        message: "User Rejected Request",
                        code: 4001,
                        data: "The user rejected the request.",
                      },
                    });
                  },
                  () => {
                    ref.respond(ev.data.id, { message: "closing" });
                  }
                );
              } else if (
                ev.data.payload.method == "wallet_switchEthereumChain"
              ) {
                const chainId = ev.data.payload?.params[0]?.chainId;
                if (chainId) {
                  Store.saveState({
                    connect_title: ev.data?.from?.title,
                    connect_origin: ev.data?.from?.origin,
                    requestedChainId: chainId,
                  });
                } else {
                  Store.saveState({
                    connect_title: ev.data?.from?.title,
                    connect_origin: ev.data?.from?.origin,
                    requestedChainId: null,
                  });
                }

                console.log(Number(new Date()), "got switch chain info", ev);
                // user router to open required screen
                // App.showPage("switch-chain-screen");

                ref.onInteraction(
                  () => {
                    ref.handle_request(
                      ev.data.id,
                      ev.data.payload,
                      ev.data.from
                    );
                  },
                  () => {
                    Store.saveState({
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
                    ref.respond(ev.data.id, { message: "closing" });
                  }
                );
              } else if (ev.data.payload.method == "wallet_addEthereumChain") {
                const chainId = ev.data.payload?.params[0]?.chainId;
                if (chainId) {
                  Store.saveState({
                    connect_title: ev.data?.from?.title,
                    connect_origin: ev.data?.from?.origin,
                    requestedChainId: chainId,
                  });
                } else {
                  Store.saveState({
                    connect_title: ev.data?.from?.title,
                    connect_origin: ev.data?.from?.origin,
                    requestedChainId: null,
                  });
                }

                console.log(Number(new Date()), "got switch chain info", ev);
                // user router to open required screen
                // App.showPage("add-chain-screen");

                ref.onInteraction(
                  () => {
                    ref.handle_request(
                      ev.data.id,
                      ev.data.payload,
                      ev.data.from
                    );
                  },
                  () => {
                    Store.saveState({
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
                    ref.respond(ev.data.id, { message: "closing" });
                  }
                );
              } else {
                const state = Store.getState();
                if (
                  state?.connect_title &&
                  state?.connect_title === ev.data?.from?.title &&
                  state?.connect_origin &&
                  state?.connect_origin === ev.data?.from?.origin
                ) {
                  ref.handle_request(ev.data.id, ev.data.payload, ev.data.from);
                  return;
                }
                Store.saveState({
                  connect_title: ev.data?.from?.title,
                  connect_origin: ev.data?.from?.origin,
                });
                // user router to open required screen
                // App.showPage("connect-dapp-screen");

                ref.onInteraction(
                  () => {
                    ref.handle_request(
                      ev.data.id,
                      ev.data.payload,
                      ev.data.from
                    );
                  },
                  () => {
                    Store.saveState({
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
                    ref.respond(ev.data.id, { message: "closing" });
                  }
                );
              }
            }
          }
        },
        1000,
        { data: ev }
      );
    });
  }

  async handle_request(id, data, from) {
    console.log(Number(new Date()), "HANDLE REQ", data);
    console.log(data.method);
    window.WalletProxi = WalletProxi;

    // VARIABLES:
    let chains, chainID, chainRequested;
    switch (data.method) {
      case "eth_accounts":
        if (await WalletProxi.isEmptyVault()) {
          this.respond(id, {
            error: {
              message: "User Rejected Request",
              code: 4001,
              data: "The user rejected the request.",
            },
          });
        } else {
          const w = WalletProxi.getActiveWallet();
          const balance = await WalletProxi.getWalletBalance(w?.address, true);

          const activeChain = await WalletProxi.getActiveChain();
          const active_node_uri = await WalletProxi.getNodeURI();

          const acc = [w?.address];
          const dataObj = {
            addresses: acc,
            // chainId: process.env.NETWORK == 'ropsten' ? '0x03' : '0x1',
            // chainId: '80001',
            chainId: activeChain.chainId
              ? activeChain.chainId
              : process.env.NETWORK == "ropsten"
              ? "0x03"
              : "0x1",
            node_uri: active_node_uri,
            balance: balance,
            payload: acc,
            block: await WalletProxi.getLatesBlock(),
            origin: from.origin,
            method: data.method,
          };
          this.respond(id, dataObj, null, true);
        }
        break;

      case "eth_requestAccounts":
        if (await WalletProxi.isEmptyVault()) {
          this.respond(id, {
            error: {
              message: "User Rejected Request",
              code: 4001,
              data: "The user rejected the request.",
            },
          });
        } else {
          const w = WalletProxi.getActiveWallet();
          // console.log(Number(new Date()), 'WALLET', w );

          const balance = await WalletProxi.getWalletBalance(w?.address, true);

          const activeChain = await WalletProxi.getActiveChain();
          const active_node_uri = await WalletProxi.getNodeURI();

          const acc = [w?.address];
          const dataObj = {
            addresses: acc,
            // chainId: process.env.NETWORK == 'ropsten' ? '0x3' : '0x1',
            // chainId: '80001',
            chainId: activeChain.chainId
              ? activeChain.chainId
              : process.env.NETWORK == "ropsten"
              ? "0x03"
              : "0x1",
            balance: balance,
            node_uri: active_node_uri,
            payload: acc,
            block: await WalletProxi.getLatesBlock(),
            origin: from.origin,
            method: data.method,
          };
          this.respond(id, dataObj, null, true);
        }

        break;

      case "eth_getBalance":
        await WalletProxi.loadVault();
        const w = WalletProxi.getActiveWallet();
        const address = w.address;
        const balance = await WalletProxi.getWalletBalance(address, true);

        this.respond(id, balance);
        break;

      case "eth_sign":
        this.respond(id, data);
        break;

      case "eth_sendTransaction":
        this.respond(id, data);
        break;

      case "wallet_addEthereumChain":
        chains = await WalletProxi.getChains();
        console.log(Number(new Date()), "chain params", data);
        chainID = chains.reduce((acc, el, idx) => {
          if (parseInt(el.chainId) == parseInt(data.params[0].chainId)) {
            acc = idx;
          }
          return acc;
        }, null);

        chainRequested = chains[chainID];
        if (chainID != null) {
          WalletProxi.setActiveChain(chainID, false, false);
          const active_node_uri = await WalletProxi.getNodeURI();
          const activeWallet = WalletProxi.getActiveWallet();
          const walletBalance = await WalletProxi.getWalletBalance(
            activeWallet.address
          );

          setTimeout(() => {
            this.respond(id, {
              method: "wallet_addEthereumChain",
              chainId: chainRequested.chainId,
              node_uri: active_node_uri,
              addresses: [activeWallet.address],
              balance: walletBalance,
            });
          }, 100);
        } else {
          if (!data.params[0].chainName) {
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
            let RPC =
              typeof data.params[0].rpcUrls === "string"
                ? data.params[0].rpcUrls
                : data.params[0].rpcUrls[0];

            await WalletProxi.addChain(
              data.params[0].chainName,
              data.params[0].chainName,
              data.params[0].chainId,
              RPC
            );

            WalletProxi.setActiveChain(chainID, false, false);
            const active_node_uri = await WalletProxi.getNodeURI();
            const activeWallet = WalletProxi.getActiveWallet();
            const walletBalance = await WalletProxi.getWalletBalance(
              activeWallet.address
            );

            setTimeout(() => {
              this.respond(id, {
                method: "wallet_addEthereumChain",
                chainId: data.params[0].chainId,
                node_uri: active_node_uri,
                addresses: [activeWallet.address],
                balance: walletBalance,
              });
            }, 100);
          }
        }
        break;

      case "wallet_switchEthereumChain":
        chains = await WalletProxi.getChains();
        console.log(Number(new Date()), "chain params", data);
        chainID = chains.reduce((acc, el, idx) => {
          if (parseInt(el.chainId) == parseInt(data.params[0].chainId)) {
            acc = idx;
          }
          return acc;
        }, null);
        chainRequested = chains[chainID];
        if (chainID != null) {
          WalletProxi.setActiveChain(chainID, false, false);
          const active_node_uri = await WalletProxi.getNodeURI();
          const activeWallet = WalletProxi.getActiveWallet();
          const walletBalance = await WalletProxi.getWalletBalance(
            activeWallet.address
          );

          setTimeout(() => {
            this.respond(id, {
              method: "wallet_switchEthereumChain",
              chainId: chainRequested.chainId,
              node_uri: active_node_uri,
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
    console.log(Number(new Date()), "RESPONDING FROM EXT", data);
    const events = arguments[2] ? { event: arguments[2] } : {};
    const authoritative = arguments[3] ? { authoritative: true } : {};

    customConsoleLog(533, evId, data);

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

  onInteraction(fn_acc, fn_rej, fn_close) {
    customConsoleLog(551, "CALLING onInteraction");
    this.handleFunc = fn_acc;
    this.rejectFunc = fn_rej;
    this.closeFunc = fn_close;
  }

  onAccept(params) {
    this.handleFunc && this.handleFunc(params);
  }
  onCancel() {
    this.rejectFunc && this.rejectFunc();
  }

  onClose() {
    this.closeFunc && this.closeFunc();
  }
}

const providerInstance = new EthProvider();

export default providerInstance;
