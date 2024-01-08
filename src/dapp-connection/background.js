/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable security-node/detect-crlf */
/* eslint-disable no-console */
/* eslint-disable no-undef */

import Web3 from "web3";

// fake localStorage, using chrome storage
const localStorage = {
  getItem(key) {
    return new Promise((res, rej) => {
      chrome.storage.local.get([key], (resp) => {
        res(resp);
      });
    });
  },
  setItem(key, val) {
    const obj = {};

    obj[key] = val;
    return new Promise((res, rej) => {
      chrome.storage.local.set(obj, (resp) => {
        res(resp);
      });
    });
  },
  removeItem(key) {
    const obj = {};

    obj[key] = null;
    return new Promise((res, rej) => {
      chrome.storage.local.set(obj, (resp) => {
        res(resp);
      });
    });
  },
};

const State = {
  // isFirstTime: true,
  lockTimer: false,
  shouldLock: false,
  popup_visible: false,
  chainId: "0x1",
  addresses: [],
  balance: false,
  isAuthorizing: false,
  authorized_domains: [],
  requests: [],
  requestTypes: {},
  lastLocked: localStorage.getItem("lastLocked") || false,
  markLastLocked() {
    State.lastLocked = new Date().getTime();
    localStorage.setItem("lastLocked", State.lastLocked);
  },
  removeLastLocked() {
    State.lastLocked = false;
    localStorage.removeItem("lastLocked");
  },
};

let win;
let contentTabId = false;
let web3 = false;

function hidePopup() {
  chrome.windows.remove(win.id, () => {
    console.log(Number(new Date()), "removed window");
  });
}

function lockExt() {
  console.log(Number(new Date()), "lock extension for no activity!");
  if (!State.popup_visible) {
    State.shouldLock = true;
  }
}

function checkAuthorized(origin) {
  return State.authorized_domains.indexOf(origin) !== -1;
}

function rebuildNode(payload) {
  console.log(Number(new Date()), "PAYLOAD FROM SWITCH", payload);

  localStorage.setItem("nodeUri", payload.nodeUri);
  State.balance = payload.balance;
  State.addresses = payload.addresses;
  web3 = new Web3(new Web3.providers.HttpProvider(payload.nodeUri));

  web3.eth.getChainId().then((chainId) => {
    State.chainId = `0x${Number(chainId).toString(16)}`;
    // State.addreses = [];

    console.log(Number(new Date()), "chainId ( REBUILT )", chainId);
  });

  // console.log(Number(new Date()),  this.addreses[0] );
  // this.web3.eth.getBalance( this.addreses[0], (err, result) => {
  //     State.balance = this.web3.utils.fromWei(result, "ether");
  //     console.log(Number(new Date()),  State.balance );
  // });

  console.log(Number(new Date()), "rebuild node", payload, web3);
}

function sendMessage(p, id, extra = {}) {
  console.log(Number(new Date()), "send", p, id, contentTabId);
  chrome.tabs.sendMessage(contentTabId, {
    type: "FROM_BG",
    payload: p,
    id,
  });
}

async function getWeb3() {
  const nodeUriObj = await localStorage.getItem("nodeUri");
  let nodeUri;

  if (typeof nodeUriObj === "object") {
    nodeUri = nodeUriObj.nodeUri || `https://${process.env.NODE_MAINNET}`;
  } else {
    nodeUri = nodeUriObj || `https://${process.env.NODE_MAINNET}`;
  }

  console.log(Number(new Date()), { nodeUri });
  console.log(Number(new Date()), "outside IF", web3, nodeUri);
  if (!web3) {
    console.log(Number(new Date()), "INSIDE IF", web3);
    web3 = new Web3(new Web3.providers.HttpProvider(nodeUri));
    console.log(Number(new Date()), "after IF", web3);
  }

  return web3;
}

async function respond(ev) {
  console.log(Number(new Date()), "responding", ev.id);
  const w3 = await getWeb3();
  let resp;
  // removeEventType( ev.payload.method );

  switch (ev.payload.method) {
    case "eth_accounts":
      sendMessage(
        State.addresses,
        ev.id /* { event: { event: 'accountsChanged', data: State.addreses } } */,
      );
      break;

    case "eth_chainId":
      sendMessage(
        State.chainId,
        ev.id /* { event: { event: 'chainChanged', data: State.chainId } } */,
      );
      break;

    case "net_version":
      sendMessage(
        State.chainId,
        ev.id /* { event: { event: 'chainChanged', data: State.chainId } } */,
      );
      break;

    case "eth_requestAccounts":
      sendMessage(
        State.addresses,
        ev.id /* { event: { event: 'accountsChanged', data: State.addreses } } */,
      );
      break;

    case "eth_getBalance":
      sendMessage(
        State.balance,
        ev.id /* { event: { event: 'accountsChanged', data: State.addreses } } */,
      );
      break;

    case "eth_blockNumber":
      sendMessage(
        State.blockNumber,
        ev.id /* { event: { event: 'accountsChanged', data: State.addreses } } */,
      );
      break;

    case "eth_call":
      console.log(Number(new Date()), { w3, val: ev.payload.params[0] });
      resp = await w3.eth.call(ev.payload.params[0]);
      console.log(Number(new Date()), { resp });
      sendMessage(resp, ev.id);
      break;

    case "eth_estimateGas":
      try {
        console.log(
          Number(new Date()),
          "this is estimate config",
          ev.payload?.params[0],
        );
        const respEstimate = await w3.eth.estimateGas(ev.payload?.params[0]);

        sendMessage(respEstimate, ev.id);
      } catch (e) {
        sendMessage({ error: { code: 4001, message: e.message } }, ev.id);
      }
      break;

    case "eth_getTransactionByHash":
      try {
        const trans = await w3.eth.getTransaction(ev.payload?.params[0]);

        sendMessage(trans, ev.id);
      } catch (e) {
        sendMessage({ error: { code: 4001, message: e.message } }, ev.id);
      }

      break;

    case "eth_getTransactionReceipt":
      try {
        const transReceipt = await new Promise((res, rej) => {
          w3.eth.getTransactionReceipt(
            ev.payload?.params[0],
            (err, receipt) => {
              if (err) {
                rej(err);
              }

              res(resp);
            },
          );
        });

        if (transReceipt.status === true) {
          transReceipt.status = "0x1";
        }

        if (transReceipt.status === false) {
          transReceipt.status = "0x0";
        }

        sendMessage(transReceipt, ev.id);
      } catch (e) {
        sendMessage({ error: { code: 4001, message: e.message } }, ev.id);
      }
      break;

    case "eth_getBlockByNumber":
      console.log(Number(new Date()), "in eth_getBlockByNumber", { ev });
      resp = await w3.eth.getBlock(ev.payload.params[0], ev.payload.params[1]);
      console.log(Number(new Date()), "in eth_getBlockByNumber", { resp });
      sendMessage(resp, ev.id);
      break;

    case "eth_gasPrice":
      console.log(Number(new Date()), "in eth_gasPrice", { ev });
      resp = await w3.eth.getGasPrice();
      console.log(Number(new Date()), "in eth_gasPrice", { resp });
      sendMessage(resp, ev.id);
      break;
    // case 'wallet_switchEthereumChain':
    //     console.log(Number(new Date()), 'received swich acceptance', ev );
    // break;

    default:
      console.log(
        Number(new Date()),
        "IN DEFAULT CASE in background.js, { ev }",
      );
  }
}

function handleMessage(ev, sender) {
  console.log(Number(new Date()), "hanlind message", State.requestTypes);
  console.log(Number(new Date()), "Reached here ", ev);

  // if already existing ... ignore
  // if( State.requestTypes.hasOwnProperty( ev.payload.method ) ){
  //     return;
  // }
  if (!checkAuthorized(sender.origin)) {
    console.log(Number(new Date()), "this isnt triggering", ev.payload.method);
    State.addreses = [];
  }

  console.log("\n\n\n\n in bg from contetn FROM_CS\n\n\n");

  // State.requestTypes[ ev.payload.method ] = 'true';

  if (
    checkAuthorized(sender.origin) &&
    ev.payload.method !== "eth_sendTransaction" &&
    ev.payload.method !== "wallet_switchEthereumChain" &&
    ev.payload.method !== "wallet_addEthereumChain" &&
    ev.payload.method !== "eth_sign" &&
    ev.payload.method !== "personal_sign"
  ) {
    console.log(Number(new Date()), "is this automated?", ev.payload.method);

    respond(ev);
    return;
  }

  if (
    [
      "eth_chainId",
      "eth_call",
      "eth_blockNumber",
      "eth_estimateGas",
      "eth_getTransactionByHash",
      "eth_getTransactionReceipt",
    ].indexOf(ev.payload.method) !== -1
  ) {
    respond(ev);
  } else {
    console.log(
      Number(new Date()),
      "prepare to open popup for ",
      ev.payload.method,
    );
    // self.chrome.windows.getCurrent().then((curr) => {
    chrome.windows.getCurrent().then((curr) => {
      if (curr.type === "popup") {
        console.log(
          Number(new Date()),
          "avoid opening popup if popup is there",
        );
        return;
      }

      const _w = parseInt(curr.width, 10);
      const lpos = Number(_w - 341);
      // console.log(Number(new Date()), 'active win', w, lpos );

      // launch confirmation
      if (!State.popup_visible) {
        chrome.windows.create(
          {
            url: "js/index.html#opened",
            type: "popup",
            width: 357,
            height: 600,
          },
          // { url: "js/index.html#opened", type: "popup", state: "maximized" },
          async (w) => {
            // win = chrome.windows.get( w.id );

            console.log(Number(new Date()), w);
            // await chrome.windows.update(w.id, { left: _w + 5 - w.width, top: 5 });
            console.log(Number(new Date()), "created", w);
            // win = await self.chrome.windows.getCurrent();
            win = await chrome.windows.getCurrent();

            // State.isAuthorizing = true;
            setTimeout(() => {
              console.log(Number(new Date()), "INSIDE TIMEOUT ", ev.payload);
              chrome.runtime.sendMessage({
                type: "FROM_BG",
                payload: ev.payload,
                from: { title: sender?.tab?.title, origin: sender?.origin },
                id: ev.id,
              });
            }, 1500);
          },
        );
        // "extension_popup", "width=340,height=620,status=no,scrollbars=no,resizable=no");
      }
    });
  }
}

function handleResponse(ev, sender) {
  console.log(Number(new Date()), "send back response from popup", ev);

  console.log(
    Number(new Date()),
    "requesttypes",
    State.requestTypes,
    ev.payload,
  );

  if (ev.payload.message === "closing") {
    hidePopup();
  }

  if (ev.method === "lock_ext") {
    State.authorized_domains = [];
  }

  if (ev.payload.method === "disconnect") {
    State.authorized_domains = [];
    State.addresses = [];
    chrome.tabs.sendMessage(contentTabId, {
      type: "FROM_BG",
      payload: { param: { error: "Used disconnected" }, authoritative: true },
      event: "disconnect",
    });
  }

  if (ev.payload.method === "wallet_switchEthereumChain") {
    console.log(Number(new Date()), "received swich acceptance", ev);
    rebuildNode(ev.payload);
    chrome.tabs.sendMessage(contentTabId, {
      type: "FROM_BG",
      payload: { param: ev.payload.chainId, authoritative: true },
      event: "chainChanged",
    });
  }

  if (ev.payload.method === "wallet_addEthereumChain") {
    console.log(Number(new Date()), "received addition acceptance", ev);
    rebuildNode(ev.payload);
    chrome.tabs.sendMessage(contentTabId, {
      type: "FROM_BG",
      payload: { param: ev.payload.chainId, authoritative: true },
      event: "chainAdded",
    });
  }

  if (ev.payload.method === "accountsChanged") {
    console.log("received address change", ev);
    State.addresses = ev.payload.addresses;
    chrome.tabs.sendMessage(contentTabId, {
      type: "FROM_BG",
      payload: { param: ev.payload.addresses, authoritative: true },
      event: "accountsChanged",
    });
  }

  if (
    ev.hasOwnProperty("authoritative") &&
    !ev.payload.hasOwnProperty("error")
  ) {
    if (State.authorized_domains.indexOf(ev.payload.origin) === -1) {
      State.authorized_domains.push(ev.payload.origin);
    }

    let sendEvent = null;

    console.log(Number(new Date()), "payload", State.addreses);
    if (State.addresses.length !== ev.payload.addresses.length) {
      console.log(Number(new Date()), "addreses changed");
      sendEvent = { event: "accountsChanged", data: ev.payload.addresses };
    }

    State.chainId = ev.payload.chainId;
    State.addresses = ev.payload.addresses;
    State.balance = ev.payload.balance;
    if (ev.payload.block) State.blockNumber = ev.payload.block;

    console.log(Number(new Date()), "saved state", State);

    chrome.tabs.sendMessage(contentTabId, {
      type: "FROM_BG",
      payload: ev.payload.payload,
      event: sendEvent || ev?.event,
      id: ev.id,
    });

    setTimeout(() => {
      console.log(Number(new Date()), "closing 1", win);
      hidePopup();
    }, 800);
  } else {
    if (ev.payload.hasOwnProperty("error")) {
      State.requestTypes = {};
    }

    console.log(Number(new Date()), "not auto");
    chrome.tabs.sendMessage(contentTabId, {
      type: "FROM_BG",
      payload: ev.payload,
      event: ev?.event,
      id: ev.id,
    });

    setTimeout(() => {
      console.log(Number(new Date()), "closing 2", win);
    });
    hidePopup();
  }

  State.isAuthorizing = false;
}

function removeEventType(method) {
  console.log(Number(new Date()), `remove ${method}`);
  const obj = {};

  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const i in State.requestTypes) {
    console.log(Number(new Date()), `check ${i}`);

    if (State.requestTypes.hasOwnProperty(i) && i !== method) {
      obj[method] = true;
    }
  }
  State.requestTypes = obj;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    !/^chrome-extension|chrome:\/\//.test(tab.url)
  ) {
    chrome.scripting
      .executeScript({
        target: { tabId },
        files: ["./js/inject-web3.js"],
      })
      .then(() => {
        console.log(Number(new Date()), "Injected the foreground script.");
      })
      .catch((err) => console.error(Number(new Date()), err));
  }

  return true;
});

chrome.runtime.onConnect.addListener((port) => {
  console.log(Number(new Date()), "Extension connected");
  // if( State.isFirstTime ){
  //     State.isFirstTime = false;
  //     setTimeout( function() { console.log(Number(new Date()), 'sending re-route'); port.postMessage({ action: 'reset_to_home', from: 'BG'} ); }, 100 );
  // }

  port.onMessage.addListener(async (msg, sender, sendResp) => {
    if (msg.type === "popup-visible") {
      console.log(Number(new Date()), "POPUP SHOWN");

      console.log(Number(new Date()), "extension timer cleared");
      if (
        State.lastLocked &&
        new Date().getTime() - State.lastLocked >
          process.env.EXTENSION_INACTIVITY_LOCK_TIME * 1000 * 60
      ) {
        setTimeout(() => port.postMessage({ action: "lock", from: "BG" }), 200);
        return;
      }

      State.removeLastLocked();

      State.popup_visible = true;
      // clearTimeout( State.lockTimer );
    }

    if (msg.type === "unlocked") {
      console.log(Number(new Date()), "extension was unlocked");
      State.shouldLock = false;
      // clearTimeout( State.lockTimer );
    }
  });
  port.onDisconnect.addListener((msg) => {
    console.log(Number(new Date()), "POPUP DESTROYED");
    State.popup_visible = false;
    // State.lockTimer = setTimeout( lockExt, process.env.EXTENSION_INACTIVITY_LOCK_TIME * 60 * 1000 );
    State.markLastLocked();

    return true;
  });
});

chrome.runtime.onMessage.addListener((ev, sender, sendResponse) => {
  console.log(Number(new Date()), "event received", ev, sender);

  console.log(Number(new Date()), "CALLING CHAINID");
  if (ev.type === "FROM_CS") {
    contentTabId = sender.tab.id;

    handleMessage(ev, sender);
  }

  if (ev.type === "FROM_POPUP") {
    handleResponse(ev, sender);
  }

  // sendResponse({received: true});
  return true;
});
