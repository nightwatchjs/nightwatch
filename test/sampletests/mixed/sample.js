var assert = require('assert');

module.exports = {
  demoTestMixed : function (client) {
    client.url('http://localhost').end();
  },

  tearDown : function(callback) {
    var self = this;
    setTimeout(function() {
      assert.ok('tearDown callback called.');
      assert.deepEqual(self.results, {
        passed: 0, failed: 0, errors: 0, skipped: 0, tests: []
      });
      assert.deepEqual(self.errors, []);
      callback();
    }, 100);
  }
};