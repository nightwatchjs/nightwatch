const {ScopedWebElement} = require('../index.js');

module.exports.command = function(selector) {
  return new ScopedWebElement(selector, this, this.nightwatchInstance);
};

