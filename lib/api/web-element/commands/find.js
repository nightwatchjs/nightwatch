const {ScopedWebElement} = require('../index.js');

module.exports.command = function(selector) {
  return ScopedWebElement.create(selector, this, this.nightwatchInstance);
};

