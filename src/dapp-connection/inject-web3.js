/* eslint-disable no-undef */
const s = document.createElement("script");
const extUrl = chrome.runtime.getURL("./js/eth-provider.js");

s.setAttribute("src", extUrl);
document.documentElement.appendChild(s);
