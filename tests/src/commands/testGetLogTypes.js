var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testCommand : function(test) {
    var client = this.client.api;

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/log/types',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : [ 'browser', 'har' ]
      })
    });

    client.getLogTypes(function callback(result) {
      test.equals(Array.isArray(result), true);
      test.equals(result.length, 2);
      test.equals(result[0], 'browser');
      test.equals(result[1], 'har');
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
