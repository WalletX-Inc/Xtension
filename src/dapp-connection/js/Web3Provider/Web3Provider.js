/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */

import EventEmitter from "./EventEmitter";
import RPCError from "./RPCError";
import { log } from "../../../utils/helper";
// import WalletProxi from "../services/WalletProxi";

function customConsoleLog(lineNumber, data) {
  log(`Inside Web3Provider.js :${lineNumber} `, data);
}

class Web3Provider extends EventEmitter {
  // constructor(config) {
  constructor() {
    super();
    this.uniqid = 0;
    this.events = {};
    this.chainId = 0;
    this.selectedAddress = "0x0";
    this.account = "0x0";
    this._state = { accounts: [] };
    window.addEventListener("message", (r) =>
      this.handle_auth_message(this, r),
    );
    // THIS above CONTENT in eth-provider.js

    // WalletProxi.loadVault()
  }

  // THIS STARTS CONTENT in eth-provider.js

  emit_event(that, ev, data) {
    if (that.events.hasOwnProperty(ev)) {
      that.events[ev].forEach((cb) => cb(data));
    }
  }

  _send_message(conf) {
    customConsoleLog(35, conf);
    window.postMessage(conf);
  }

  send_request(method, params) {
    customConsoleLog(41, { method, params });
    const that = this;

    const _emitEvent = this.emit_event;

    return new Promise((res, rej) => {
      // const uniqid = ~~(Math.random() * 10000).toFixed(2);
      this.uniqid += 1;

      this._send_message({
        type: "FROM_PAGE",
        payload: { method, params },
        id: this.uniqid,
      });

      const fn = this.handle_message(
        (resp) => {
          res(resp);
        },
        (err) => {
          if (err.hasOwnProperty("locked")) {
            rej();
            _emitEvent(that, {
              message: "WalletX is locked. Please unlock it to use it.",
              code: err?.error?.code,
            });
            // _emitEvent('disconnect', { message: 'WalletX is locked. Please unlock it to use it.', code: err?.error?.code });
            return false;
          }

          // eslint-disable-next-line prefer-promise-reject-errors
          rej({
            message: err?.error?.message,
            code: err?.error?.code,
            data: err?.error?.data,
          });
          return true;
        },
        () => {
          window.removeEventListener("message", fn);
        },
        this.uniqid,
      );

      window.addEventListener("message", fn);
    });
  }

  handle_message(response, error, after, uniqid) {
    const that = this;
    const _emitEvent = that.emit_event;

    return (resp) => {
      if (
        resp.data.hasOwnProperty("payload") &&
        resp.data.payload.method !== "wallet_switchEthereumChain" &&
        resp.data.type === "FROM_CS" &&
        resp.data.id === uniqid
      ) {
        // log("IN HERE ", resp, response)

        if (
          (resp?.data?.payload?.method !== "wallet_switchEthereumChain" ||
            resp?.data?.payload?.method !== "wallet_addEthereumChain") &&
          resp?.data?.payload?.chainId &&
          resp?.data?.payload?.addresses
        ) {
          that.chainId = resp?.data?.payload?.chainId;
          that.selectedAddress = resp?.data?.payload?.addresses[0];
          that.account = resp?.data?.payload?.addresses[0];
          that._state.accounts = resp?.data?.payload?.addresses;
        }

        if (resp.data.payload.hasOwnProperty("error")) {
          error(resp.data.payload);
          after();
        }

        response(resp.data.payload);
        after();
        // emit events
        if (resp.data.hasOwnProperty("event")) {
          setTimeout(
            () =>
              _emitEvent(that, resp.data.event?.event, resp.data.event?.data),
            100,
          );
        }
      }
    };
  }

  handle_auth_message(that, resp) {
    const _emitEvent = that.emit_event;

    if (
      (resp?.data?.payload?.method !== "wallet_switchEthereumChain" ||
        resp?.data?.payload?.method !== "wallet_addEthereumChain") &&
      resp?.data?.payload?.chainId &&
      resp?.data?.payload?.addresses
    ) {
      that.chainId = resp?.data?.payload?.chainId;
      that.selectedAddress = resp?.data?.payload?.addresses[0];
      that.account = resp?.data?.payload?.addresses[0];
      that._state.accounts = resp?.data?.payload?.addresses;
    }

    if (resp.data.type === "FROM_CS" && resp.data.authoritative === true) {
      if (resp.data.hasOwnProperty("event")) {
        setTimeout(
          () => _emitEvent(that, resp.data.event, resp.data.payload?.param),
          100,
        );
      }
    }
  }
  // THIS ENDS CONTENT in eth-provider.js

  async request(e) {
    if (!e.method) {
      return new RPCError("Method not described");
    }

    // if (!this.keyless.isConnected()) {
    //     return new RPCError('Provider not connected');
    // }
    return this.send_request(e.method, e.params);
  }
}

export default Web3Provider;
