var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testCommand : function(test) {
    var client = this.client.api;

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/value',
      method:'POST',
      postdata : '{"value":["1"]}',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    client.setValue('css selector', '#weblogin', '1', function callback(result) {
      test.equals(result.status, 0);
    }).setValue('#weblogin', '1', function callback(result) {
      test.equals(result.status, 0);
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
