import { DAPP_CONNECTION_ENV } from "../../../config/index";

const CryptoJS = require("crypto-js");

const Store = {
  key: "state_extension_Storage",
  localKey: "localState_extension_Storage",
  state: null,
  localState: null,

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

  // getLocalState: function () {
  //   let cont = this.load("local");
  //   if (!cont) {
  //     cont = {};
  //   }
  //   Store.localState = cont;
  //   return Store.localState;
  // },

  // saveLocalState: function (state) {
  //   Store.localState = { ...Store.localState, ...state };
  //   console.log(Number(new Date()), "LOCALSTATE", Store.localState);

  //   this.commit("local", Store.localState);
  // },
  // clearLocalState: function () {
  //   Store.localState = {};

  //   this.commit("local", Store.localState);
  // },

  clearStateKeys(keyPrefixes) {
    const keys = Object.keys(Store.state);
    const newState = Object.values(Store.state).reduce((acc, curr, key) => {
      let shouldSkip = false;

      for (const i in keyPrefixes) {
        if (keys[key].indexOf(keyPrefixes[i]) != -1) {
          shouldSkip = true;
        }
      }
      if (!shouldSkip) {
        acc[keys[key]] = curr;
      } else {
        console.log(Number(new Date()), "delete key ", keys[key]);
      }

      return acc;
    }, {});

    // console.log(Number(new Date()),  'new state', remaining );
    this.commit("local", newState);
  },

  INITIAL_STATE: {},

  commit(place, obj) {
    const sol = DAPP_CONNECTION_ENV.WALLET_WORD_SPLIT;
    // const sol = process.env.REACT_APP_WALLET_WORD_SPLIT;
    const k = place == "local" ? Store.localKey : Store.key;

    const buff = CryptoJS.AES.encrypt(JSON.stringify(obj), sol).toString();

    localStorage.setItem(k, buff);
    console.log(Number(new Date()), "saved state");
  },
  load(place) {
    const k = place == "local" ? Store.localKey : Store.key;

    const sol = DAPP_CONNECTION_ENV.WALLET_WORD_SPLIT;

    console.log("eituweioutwtoei, ", process.env.REACT_APP_WALLET_WORD_SPLIT);
    const buff = localStorage.getItem(k) || null;

    if (!buff) {
      return false;
    }

    let dec;

    try {
      dec = CryptoJS.AES.decrypt(buff, sol).toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.log(Number(new Date()), "error", e);
      dec = false;
    }
    return JSON.parse(dec);
  },
};

export default Store;
