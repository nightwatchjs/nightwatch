const webSocket = new WebSocket('ws://localhost:8080');
const tabID = chrome.devtools.inspectedWindow.tabId;
const exploreModeId = 'exploreMode';
const tryNightwatchCommandId = 'tryNightwatchCommand';
const nightwatchCommandId = 'nightwatchCommand';
let EXPLORE_MODE = false;

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
  sendMessageToBackground('EXPLORE_MODE', true);
});

webSocket.onclose = () => {
  console.log("Bye, Nightwatch Server Closed !!");
};

document.getElementById(exploreModeId).addEventListener('click', clickOnExploreMode);
document.getElementById(tryNightwatchCommandId).addEventListener('click', tryNightwatchCommand);


function tryNightwatchCommand() {
  const nightwatchCommandElement = document.getElementById(nightwatchCommandId);
  const nightwatchCommand = nightwatchCommandElement.value;

  // setting explore mode false when trying out nightwatch commands
  sendMessageToBackground('EXPLORE_MODE', false);
  webSocket.send(nightwatchCommand);
  addRowInCommand(nightwatchCommand);
}

function clickOnExploreMode(event) {
  const checkBox = event.target;
  sendMessageToBackground('EXPLORE_MODE', checkBox.checked);
}

document.querySelector('#nightwatchCommand').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const nightwatchCommandElement = document.getElementById('nightwatchCommand');
    webSocket.send(JSON.stringify(nightwatchCommandElement.value));
  }
});

function sendMessageToBackground(action = null, content = null) {
  backgroundPageConnection.postMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    action: action,
    content: content
  });
}

function getSelectorFromFirstCell(event) {
  const targetElement = event.target.parentElement.parentElement.firstElementChild;

  return targetElement.textContent;
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

function clickOnHighlight(event) {
  const selectorValue = getSelectorFromFirstCell(event);

  sendMessageToBackground('HIGHLIGHT_ELEMENT', selectorValue);
}

function clickOnCopy(event) {
  // Info: clipboard API not working. Using deprecated execCommand function
  const selectorValue = getSelectorFromFirstCell(event);
  const textarea = document.createElement("textarea");

  textarea.textContent = selectorValue;
  document.body.appendChild(textarea);
  textarea.select();

  document.execCommand('copy');
  document.body.removeChild(textarea);
}

//Add row to selector history
function addRow(selector) {
  const selectorTable = document.getElementById('selectorTable');
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

//Add row to commands history
function addRowInCommand(command) {
  const selectorTable = document.getElementById('commandTable');
  const tbody = selectorTable.getElementsByTagName('tbody')[0];
  const newRow = tbody.insertRow(0);
  const timestamp = new Date().toLocaleString();
  
  const copyButton = document.createElement('button');
  copyButton.appendChild(document.createTextNode('Copy'));
  copyButton.addEventListener('click', clickOnCopy);
  
  var newCell = newRow.insertCell();
  newCell.appendChild(document.createTextNode(command));
  
  newCell = newRow.insertCell();
  newCell.appendChild(document.createTextNode(timestamp));
  
  newCell = newRow.insertCell();
  newCell.appendChild(copyButton);
}
