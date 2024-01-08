/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import { DAPP_CONNECTION_ENV } from "../../../config/index";
import { log } from "../../../utils/helper";

const CryptoJS = require("crypto-js");

const Store = {
  key: "state_extension_Storage",
  tempKey: "tempState_extension_Storage",
  state: null,
  tempState: null,

  getState() {
    if (!this.state) {
      let cont = this.load("state");

      if (!cont) {
        cont = Store.INITIAL_STATE;
      }

      Store.state = cont;
    }

    return Store.state;
  },

  saveToInitialState() {
    Store.state = Store.INITIAL_STATE;
    this.commit("state", Store.state);
  },

  saveState(data) {
    Store.state = { ...Store.state, ...data };
    // let cont = JSON.stringify( Store.state );
    // localStorage.setItem( Store.key, cont );
    this.commit("state", Store.state);
  },

  getTempState() {
    let cont = this.load("temp");

    if (!cont) {
      cont = {};
    }

    Store.tempState = cont;
    return Store.tempState;
  },

  saveTempState(state) {
    Store.tempState = { ...Store.tempState, ...state };
    log("TEMPSTATE", Store.tempState);

    this.commit("temp", Store.tempState);
  },
  clearTempState() {
    Store.tempState = {};

    this.commit("temp", Store.tempState);
  },

  clearStateKeys(keyPrefixes) {
    const keys = Object.keys(Store.state);
    const newState = Object.values(Store.state).reduce((acc, curr, key) => {
      let shouldSkip = false;

      // eslint-disable-next-line no-restricted-syntax
      for (const i in keyPrefixes) {
        if (keys[key].indexOf(keyPrefixes[i]) !== -1) {
          shouldSkip = true;
        }
      }
      if (!shouldSkip) {
        acc[keys[key]] = curr;
      } else {
        log(Number(new Date()), "delete key ", keys[key]);
      }

      return acc;
    }, {});

    // log(Number(new Date()),  'new state', remaining );
    this.commit("temp", newState);
  },

  INITIAL_STATE: {},

  commit(place, obj) {
    const sol = DAPP_CONNECTION_ENV.WALLET_WORD_SPLIT;
    // const sol = process.env.REACT_APP_WALLET_WORD_SPLIT;
    const k = place === "temp" ? Store.tempKey : Store.key;

    const buff = CryptoJS.AES.encrypt(JSON.stringify(obj), sol).toString();

    localStorage.setItem(k, buff);
    log(Number(new Date()), "saved state");
  },
  load(place) {
    const k = place === "temp" ? Store.tempKey : Store.key;

    const sol = DAPP_CONNECTION_ENV.WALLET_WORD_SPLIT;

    log("eituweioutwtoei, ", { place, k, sol });
    const buff = localStorage.getItem(k) || null;

    if (!buff) {
      return false;
    }

    let dec;

    try {
      dec = CryptoJS.AES.decrypt(buff, sol).toString(CryptoJS.enc.Utf8);
    } catch (e) {
      log(Number(new Date()), "error", e);
      dec = false;
    }
    return JSON.parse(dec);
  },
};

export default Store;
