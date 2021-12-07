const path = require('path');
const exportedCommands = [
  'element-commands/findElement.js',
  'element-commands/findElements.js',
  'element-commands/element.js',
  'element-commands/elements.js',
  'element-commands/elementIdElement.js',
  'element-commands/elementIdElements.js',
  'element-commands/waitForElementPresent.js',
  'element-commands/waitForElementNotPresent.js',
  'element-commands/waitForElementVisible.js',
  'element-commands/waitForElementNotVisible.js',
  'protocol/quit.js'
];

const basePath = '../lib/api';
const Commands = {};
const props = exportedCommands.reduce((prev, fileName) => {
  const commandName = fileName.substring(fileName.lastIndexOf('/')+1).replace('.js', '');
  prev[commandName] = {
    configurable: true,
    get: function() {
      return require(path.join(basePath, fileName));
    }
  };

  return prev;
}, {});

Object.defineProperties(Commands, props);

module.exports = Commands;