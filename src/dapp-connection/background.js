import Web3 from "web3";

//fake localStorage, using chrome storage
let localStorage = {
  getItem: function (key) {
    return new Promise((res, rej) => {
      chrome.storage.local.get([key], (resp) => {
        res(resp);
      });
    });
  },
  setItem: function (key, val) {
    const obj = {};
    obj[key] = val;
    return new Promise((res, rej) => {
      chrome.storage.local.set(obj, (resp) => {
        res(resp);
      });
    });
  },
  removeItem: function (key) {
    const obj = {};
    obj[key] = null;
    return new Promise((res, rej) => {
      chrome.storage.local.set(obj, (resp) => {
        res(resp);
      });
    });
  },
};

let State = {
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
  markLastLocked: function () {
    State.lastLocked = new Date().getTime();
    localStorage.setItem("lastLocked", State.lastLocked);
  },
  removeLastLocked: function () {
    State.lastLocked = false;
    localStorage.removeItem("lastLocked");
  },
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    !/^chrome-extension|chrome:\/\//.test(tab.url)
  ) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["./js/inject-web3.js"],
      })
      .then(() => {
        console.log(Number(new Date()), "Injected the foreground script.");
      })
      .catch((err) => console.log(Number(new Date()), err));
  }
  return true;
});

chrome.runtime.onConnect.addListener(function (port) {
  console.log(Number(new Date()), "Extension connected");
  // if( State.isFirstTime ){
  //     State.isFirstTime = false;
  //     setTimeout( function() { console.log(Number(new Date()), 'sending re-route'); port.postMessage({ action: 'reset_to_home', from: 'BG'} ); }, 100 );
  // }

  port.onMessage.addListener(async function (msg, sender, sendResp) {
    if (msg.type == "popup-visible") {
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
    if (msg.type == "unlocked") {
      console.log(Number(new Date()), "extension was unlocked");
      State.shouldLock = false;
      // clearTimeout( State.lockTimer );
    }

    return true;
  });
  port.onDisconnect.addListener(function (msg) {
    console.log(Number(new Date()), "POPUP DESTROYED");
    State.popup_visible = false;
    // State.lockTimer = setTimeout( lockExt, process.env.EXTENSION_INACTIVITY_LOCK_TIME * 60 * 1000 );
    State.markLastLocked();

    return true;
  });
});

let win;
let contentTabId = false;
let web3 = false;

chrome.runtime.onMessage.addListener(function (ev, sender, sendResponse) {
  console.log(Number(new Date()), "event received", ev, sender);

  console.log(Number(new Date()), "CALLING CHAINID");
  if (ev.type == "FROM_CS") {
    contentTabId = sender.tab.id;

    handle_message(ev, sender);
  }

  if (ev.type == "FROM_POPUP") {
    handle_response(ev, sender);
  }
  // sendResponse({received: true});
  return true;
});

function rebuild_node(payload) {
  console.log(Number(new Date()), "PAYLOAD FROM SWITCH", payload);

  localStorage.setItem("node_uri", payload.node_uri);
  State.balance = payload.balance;
  State.addresses = payload.addresses;
  web3 = new Web3(new Web3.providers.HttpProvider(payload.node_uri));
  web3.eth.getChainId().then(function (chainId) {
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

function handle_message(ev, sender) {
  console.log(Number(new Date()), "hanlind message", State.requestTypes);
  console.log(Number(new Date()), "Reached here ", ev);

  // if already existing ... ignore
  // if( State.requestTypes.hasOwnProperty( ev.payload.method ) ){
  //     return;
  // }
  if (!check_authorized(sender.origin)) {
    console.log(Number(new Date()), "this isnt triggering", ev.payload.method);
    State.addreses = [];
  }

  // State.requestTypes[ ev.payload.method ] = 'true';

  if (
    check_authorized(sender.origin) &&
    ev.payload.method != "eth_sendTransaction" &&
    ev.payload.method != "wallet_switchEthereumChain" &&
    ev.payload.method != "wallet_addEthereumChain" &&
    ev.payload.method != "eth_sign"
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
      ev.payload.method
    );
    // self.chrome.windows.getCurrent().then((curr) => {
    chrome.windows.getCurrent().then((curr) => {
      if (curr.type == "popup") {
        console.log(
          Number(new Date()),
          "avoid opening popup if popup is there"
        );
        return;
      }
      const _w = parseInt(curr.width);
      const lpos = Number(_w - 341);
      // console.log(Number(new Date()), 'active win', w, lpos );

      //launch confirmation
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
          }
        );
        // "extension_popup", "width=340,height=620,status=no,scrollbars=no,resizable=no");
      }
    });
  }
}
async function respond(ev) {
  console.log(Number(new Date()), "responding", ev.id);
  const w3 = await getWeb3();
  let resp;
  // remove_event_type( ev.payload.method );

  switch (ev.payload.method) {
    case "eth_accounts":
      send_message(
        State.addresses,
        ev.id /*{ event: { event: 'accountsChanged', data: State.addreses } }*/
      );
      break;

    case "eth_chainId":
    case "net_version":
      send_message(
        State.chainId,
        ev.id /*{ event: { event: 'chainChanged', data: State.chainId } }*/
      );
      break;

    case "eth_requestAccounts":
      send_message(
        State.addresses,
        ev.id /*{ event: { event: 'accountsChanged', data: State.addreses } }*/
      );
      break;

    case "eth_getBalance":
      send_message(
        State.balance,
        ev.id /*{ event: { event: 'accountsChanged', data: State.addreses } }*/
      );
      break;

    case "eth_blockNumber":
      send_message(
        State.blockNumber,
        ev.id /*{ event: { event: 'accountsChanged', data: State.addreses } }*/
      );
      break;

    case "eth_call":
      console.log(Number(new Date()), { w3, val: ev.payload.params[0] });
      resp = await w3.eth.call(ev.payload.params[0]);
      console.log(Number(new Date()), { resp });
      send_message(resp, ev.id);
      break;

    case "eth_estimateGas":
      try {
        console.log(
          Number(new Date()),
          "this is estimate config",
          ev.payload?.params[0]
        );
        let resp_estimate = await w3.eth.estimateGas(ev.payload?.params[0]);
        send_message(resp_estimate, ev.id);
      } catch (e) {
        send_message({ error: { code: 4001, message: e.message } }, ev.id);
      }
      break;

    case "eth_getTransactionByHash":
      try {
        let trans = await w3.eth.getTransaction(ev.payload?.params[0]);
        send_message(trans, ev.id);
      } catch (e) {
        send_message({ error: { code: 4001, message: e.message } }, ev.id);
      }

      break;

    case "eth_getTransactionReceipt":
      try {
        let trans_receipt = await new Promise((res, rej) => {
          w3.eth.getTransactionReceipt(ev.payload?.params[0], (err, resp) => {
            if (err) {
              rej(err);
            }
            res(resp);
          });
        });
        if (trans_receipt.status == true) {
          trans_receipt.status = "0x1";
        }
        if (trans_receipt.status == false) {
          trans_receipt.status = "0x0";
        }
        send_message(trans_receipt, ev.id);
      } catch (e) {
        send_message({ error: { code: 4001, message: e.message } }, ev.id);
      }
      break;

    case "eth_getBlockByNumber":
      console.log(Number(new Date()), "in eth_getBlockByNumber", { ev });
      resp = await w3.eth.getBlock(ev.payload.params[0], ev.payload.params[1]);
      console.log(Number(new Date()), "in eth_getBlockByNumber", { resp });
      send_message(resp, ev.id);
      break;

    case "eth_gasPrice":
      console.log(Number(new Date()), "in eth_gasPrice", { ev });
      resp = await w3.eth.getGasPrice();
      console.log(Number(new Date()), "in eth_gasPrice", { resp });
      send_message(resp, ev.id);
      break;
    // case 'wallet_switchEthereumChain':
    //     console.log(Number(new Date()), 'received swich acceptance', ev );
    // break;
  }
}
function send_message(p, id, extra = {}) {
  console.log(Number(new Date()), "send", p, id, contentTabId);
  chrome.tabs.sendMessage(contentTabId, {
    type: "FROM_BG",
    payload: p,
    id: id,
  });
}

function handle_response(ev, sender) {
  console.log(Number(new Date()), "send back response from popup", ev);

  console.log(
    Number(new Date()),
    "requesttypes",
    State.requestTypes,
    ev.payload
  );

  if (ev.payload.message === "closing") {
    // hide_popup();
  }

  if (ev.method == "lock_ext") {
    State.authorized_domains = [];
  }
  if (ev.payload.method == "disconnect") {
    State.authorized_domains = [];
    State.addresses = [];
    chrome.tabs.sendMessage(contentTabId, {
      type: "FROM_BG",
      payload: { param: { error: "Used disconnected" }, authoritative: true },
      event: "disconnect",
    });
  }

  if (ev.payload.method == "wallet_switchEthereumChain") {
    console.log(Number(new Date()), "received swich acceptance", ev);
    rebuild_node(ev.payload);
    chrome.tabs.sendMessage(contentTabId, {
      type: "FROM_BG",
      payload: { param: ev.payload.chainId, authoritative: true },
      event: "chainChanged",
    });
  }

  if (ev.payload.method == "wallet_addEthereumChain") {
    console.log(Number(new Date()), "received addition acceptance", ev);
    rebuild_node(ev.payload);
    chrome.tabs.sendMessage(contentTabId, {
      type: "FROM_BG",
      payload: { param: ev.payload.chainId, authoritative: true },
      event: "chainAdded",
    });
  }

  if (ev.payload.method == "accountsChanged") {
    console.log(Number(new Date()), "received address change", ev);
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
    if (State.authorized_domains.indexOf(ev.payload.origin) == -1) {
      State.authorized_domains.push(ev.payload.origin);
    }
    let sendEvent = null;
    console.log(Number(new Date()), "payload", State.addreses);
    if (State.addresses.length != ev.payload.addresses.length) {
      console.log(Number(new Date()), "addreses changed");
      sendEvent = { event: "accountsChanged", data: ev.payload.addresses };
    }
    State.chainId = ev.payload.chainId;
    State.addresses = ev.payload.addresses;
    State.balance = ev.payload.balance;
    ev.payload.block && (State.blockNumber = ev.payload.block);
    console.log(Number(new Date()), "saved state", State);

    chrome.tabs.sendMessage(contentTabId, {
      type: "FROM_BG",
      payload: ev.payload.payload,
      event: sendEvent || ev?.event,
      id: ev.id,
    });

    setTimeout(() => {
      console.log(Number(new Date()), "closing 1", win);
      hide_popup();
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
    hide_popup();
  }
  State.isAuthorizing = false;
}
function check_authorized(origin) {
  return State.authorized_domains.indexOf(origin) != -1;
}

function remove_event_type(method) {
  console.log(Number(new Date()), "remove " + method);
  const obj = {};
  for (var i in State.requestTypes) {
    console.log(Number(new Date()), "check " + i);
    if (State.requestTypes.hasOwnProperty(i) && i != method) {
      obj[method] = true;
    }
  }
  State.requestTypes = obj;
}
async function getWeb3() {
  const node_uri_obj = await localStorage.getItem("node_uri");
  let node_uri;
  if (typeof node_uri_obj === "object") {
    node_uri = node_uri_obj.node_uri || "https://" + process.env.NODE_MAINNET;
  } else {
    node_uri = node_uri_obj || "https://" + process.env.NODE_MAINNET;
  }
  console.log(Number(new Date()), { node_uri });
  console.log(Number(new Date()), "outside IF", web3, node_uri);
  if (!web3) {
    console.log(Number(new Date()), "INSIDE IF", web3);
    web3 = new Web3(new Web3.providers.HttpProvider(node_uri));
    console.log(Number(new Date()), "after IF", web3);
  }
  return web3;
}

function lockExt() {
  console.log(Number(new Date()), "lock extension for no activity!");
  if (!State.popup_visible) {
    State.shouldLock = true;
  }
}

function hide_popup() {
  chrome.windows.remove(win.id, function () {
    console.log(Number(new Date()), "removed window");
  });
}
