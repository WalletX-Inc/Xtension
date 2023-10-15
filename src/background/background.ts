
import browser from 'webextension-polyfill';

browser.runtime.onInstalled.addListener(({ reason }) => (reason === 'install' ? console.log("browser installed") : null));
chrome.runtime.onInstalled.addListener(() => {
  console.log("Hello")
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && !(/^chrome-extension|chrome:\/\//.test(tab.url || ""))) {
      chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["../Web3Provider/inject-web3.js"]
      })
          .then(() => {
              console.log(Number(new Date()), "Injected the foreground script.");
          })
          .catch(err => console.log(Number(new Date()), err));
  }
  return true;
});