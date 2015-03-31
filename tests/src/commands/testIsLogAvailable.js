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

    client.isLogAvailable( 'unknown', function callback(result) {
      test.equals(typeof result === 'boolean', true);
      test.equals(result, false);
    })
    .isLogAvailable( 'browser', function callback(result) {
      test.equals(typeof result === 'boolean', true);
      test.equals(result, true);
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
