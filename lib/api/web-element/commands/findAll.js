const {ScopedElements} = require('../elements.js');

module.exports.command = function(selector) {
  return ScopedElements.create(selector, this, this.nightwatchInstance);
};

