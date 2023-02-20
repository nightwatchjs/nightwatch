const webSocket = new WebSocket('ws://localhost:8080');
const selectorTable = document.getElementById('selectorTable');
const tabID = chrome.devtools.inspectedWindow.tabId;

const backgroundPageConnection = chrome.runtime.connect({
  name: "devtools-page"
});

//Establishing connention with background.js
// sendMessageToBackground('init');

backgroundPageConnection.onMessage.addListener(function (message) {
  // Handle responses from the background page, if any
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  const {from, action, content} = msg;
  if (sender.tab.id === tabID && from === 'contentJS') {
    switch (action) {
      case 'selector':
        addRow(content);
        break;
    }
  }
});

webSocket.onopen = () => {
  console.log("Hurray, Connected to Nightwatch Server !!");
};

webSocket.onmessage = ((msg) => {
  document.getElementById('commandResult').textContent = msg.data;
});

webSocket.onclose = () => {
  console.log("Bye, Nightwatch Server Closed !!");
};

document.querySelector('#exploreMode').addEventListener('click', function(e) {
  const checkBox = e.target;
  if (checkBox.checked){
    sendMessageToBackground('EXPLORE_MODE', true);
  } else {
    sendMessageToBackground('EXPLORE_MODE', false);
  }
});

document.querySelector('#tryNightwatchCommand').addEventListener('click', function(e) {
  const nightwatchCommandElement = document.getElementById('nightwatchCommand');
  const nightwatchCommand = nightwatchCommandElement.value;
  webSocket.send(nightwatchCommand);
});

document.querySelector('#nightwatchCommand').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const nightwatchCommandElement = document.getElementById('nightwatchCommand');
    webSocket.send(JSON.stringify(nightwatchCommandElement.value));
  }
});

function sendMessageToContentJS(action = null, content = null) {
  chrome.runtime.sendMessage({
    from: 'devtools',
    action: action,
    content: content
  });
}

function sendMessageToBackground(action = null, content = null) {
  backgroundPageConnection.postMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    action: action,
    content: content
  });
  //chrome.runtime.sendMessage({'hello': 'hello'});
}

//Add row to table in panel.html
function addRow(selector) {
  const tbody = selectorTable.getElementsByTagName('tbody')[0];
  const newRow = tbody.insertRow(0);
  const timestamp = new Date().toLocaleString();
  
  const highlightButton = document.createElement('button');
  highlightButton.appendChild(document.createTextNode('Highlight'));
  highlightButton.addEventListener('click', clickOnHighlight);
  
  const copyButton = document.createElement('button');
  copyButton.appendChild(document.createTextNode('Copy'));
  copyButton.addEventListener('click', clickOnCopy);
  
  var newCell = newRow.insertCell();
  newCell.appendChild(document.createTextNode(selector));
  
  newCell = newRow.insertCell();
  newCell.appendChild(document.createTextNode(timestamp));
  
  newCell = newRow.insertCell();
  newCell.appendChild(highlightButton);
  newCell.appendChild(copyButton);
}

function getSelectorFromFirstCell(e) {
  const targetElement = e.target.parentElement.parentElement.firstElementChild;
  return targetElement.textContent;
}

function clickOnHighlight(e) {
  const selectorValue = getSelectorFromFirstCell(e);
  sendMessageToBackground('HIGHLIGHT_ELEMENT', selectorValue);
}

function clickOnCopy(e) {
  // Info: clipboard API not working. Using deprecated execCommand function
  const selectorValue = getSelectorFromFirstCell(e);
  var textarea = document.createElement("textarea");
  textarea.textContent = selectorValue;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  
  //sendMessageToBackground('copyToClipboard', selectorValue);
  //chrome.clipboard.writeText(selectorValue);
}

function PosEnd(end) {
  var len = end.value.length;
  
  // Mostly for Web Browsers
  if (end.setSelectionRange) {
    end.focus();
    end.setSelectionRange(len, len);
  } else if (end.createTextRange) {
    var t = end.createTextRange();
    t.collapse(true);
    t.moveEnd('character', len);
    t.moveStart('character', len);
    t.select();
  }
}
