const connections = {};

chrome.runtime.onConnect.addListener(function (port) {
  var extensionListener = function (message, sender, sendResponse) {
    // The original connection event doesn't include the tab ID of the
    // DevTools page, so we need to send it explicitly.
    if (message.action == 'INIT') {
      connections[message.tabId] = port;
      return;
    }
    else {
      // Send all messages recieved from devtools to content js
      chrome.tabs.sendMessage(message.tabId, message, sendResponse);
    }
  }
  
  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener);
  
  port.onDisconnect.addListener(function(port) {
    
    var tabs = Object.keys(connections);
    for (var i=0, len=tabs.length; i < len; i++) {
      
      if (connections[tabs[i]] == port) {
        chrome.tabs.sendMessage(Number(tabs[i]), {
          tabId: tabs[i],
          action: 'EXPLORE_MODE',
          content: false
        });
        delete connections[tabs[i]];
        break;
      }
    }
    
  });
});