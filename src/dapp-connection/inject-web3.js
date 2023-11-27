var s = document.createElement('script');
var ext_url = chrome.runtime.getURL('./js/eth-provider.js'); 
s.setAttribute('src', ext_url );
document.documentElement.appendChild(s);