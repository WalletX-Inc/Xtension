// window.addEventListener('load', function(){
//     function injectScript(file_path, tag) {
//         var node = document.getElementsByTagName(tag)[0];
//         var script = document.createElement('script');
//         script.setAttribute('type', 'text/javascript');
//         script.setAttribute('src', file_path);
//         node.appendChild(script);
//     }
//     injectScript(chrome.runtime.getURL('./eth-provider.js'), 'body');
// })

try {
  // comunication thread - page <> backgruond
  window.addEventListener(
    "message",
    function (ev) {
      console.log(
        "IN CONTENT_SCRIPT window.addEventListener('message', :15",
        ev
      );
      if (ev.data.type == "FROM_PAGE") {
        if (
          chrome &&
          chrome.runtime &&
          chrome.runtime.hasOwnProperty("sendMessage")
        ) {
          chrome.runtime.sendMessage({
            type: "FROM_CS",
            payload: ev.data.payload,
            id: ev.data.id,
          });
        }
      }
    },
    false
  );

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log(
      "IN CONTENT_SCRIPT chrome.runtime.onMessage.addListener: :26",
      request
    );

    if (request.type == "FROM_BG") {
      const auth = request.payload.hasOwnProperty("authoritative")
        ? { authoritative: true }
        : {};
      window.postMessage({
        ...auth,
        type: "FROM_CS",
        payload: request.payload,
        event: request?.event,
        id: request.id,
      });
    }
  });
} catch (e) {
  console.log(Number(new Date()), "error in content script", e.message);
}
