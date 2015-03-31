var MockServer = require('mockserver');

module.exports = {
  setUp: function(callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },

  testMaximizeCommand: function(test) {
    var client = this.client.api;

    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/current/maximize',
      'response': JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    });

    client.maximizeWindow(function callback(result) {
      test.deepEqual(result, {});
      test.done();
    });
  },

  tearDown: function(callback) {
    this.client = null;
    callback();
  }
};
