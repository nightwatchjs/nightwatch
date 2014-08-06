
module.exports = {

  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },

  testCommand : function(test) {

    var client = this.client.api;

    test.equals(typeof client.noop, 'function');

    client.noop(function callback(api) {
      test.equals(typeof api, 'object');
      test.equals(typeof api.Keys, 'object');
      test.done();
    });
  },

  tearDown : function(callback) {
    delete this.client;
    callback();
  }
};
