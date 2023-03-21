const {ScopedValue} = require('../element-value.js');

module.exports.command = function() {
  return new ScopedValue(this.webElement.getId(), this.nightwatchInstance);
}