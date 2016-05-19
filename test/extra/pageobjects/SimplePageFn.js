var assert = require('assert');
module.exports = function(client) {
  assert.ok(typeof client == 'object');

  this.testPageAction = function() {
    return this;
  };
};