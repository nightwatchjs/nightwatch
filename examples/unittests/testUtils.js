var Utils = require('../../lib/util/utils.js');
var assert = require('assert');

module.exports = {

  testFormatElapsedTime : function(test) {

    var resultMs = Utils.formatElapsedTime(999);
    test.assert.equal(resultMs, '999ms');
    test.assert.strictEqual(resultMs, '999ms');

  },

  testFormatElapsedTimeStrict : function(test, done) {

    var resultMs = Utils.formatElapsedTime(999);
    test.assert.strictEqual(resultMs, '99w9ms');

    setTimeout(function() {
      done();
    }, 100);
  }
};