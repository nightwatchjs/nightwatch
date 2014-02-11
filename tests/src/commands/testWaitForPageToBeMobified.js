var MockServer = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testSuccess : function(test) {
    this.client.waitForPageToBeMobified(1000, function callback(result) {
      test.ok(result !== false);
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
}
