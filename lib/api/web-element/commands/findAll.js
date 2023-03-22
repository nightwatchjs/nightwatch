const {ScopedElements} = require('../elements.js');

module.exports.command = function(selector) {
  return new ScopedElements(selector, this, this.nightwatchInstance);
};

