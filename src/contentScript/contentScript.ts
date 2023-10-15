try {
  // comunication thread - page <> backgruond
  window.addEventListener('message', function( ev ){
      if( ev.data.type == 'FROM_PAGE'){
          if( chrome && chrome.runtime && chrome.runtime.hasOwnProperty('sendMessage') ){
              chrome.runtime.sendMessage({type:'FROM_CS', payload: ev.data.payload, id: ev.data.id });  
          }
      } 
  }, false );

  chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
          if( request.type == 'FROM_BG' ){
              const auth = request.payload.hasOwnProperty('authoritative')? { authoritative: true } : {};
              window.postMessage( {...auth, type: 'FROM_CS', payload: request.payload, event: request?.event, id: request.id }, "" );
          }        
      }
  );

} catch( e ){
  console.log(Number(new Date()), 'error in content script', e.message );
}