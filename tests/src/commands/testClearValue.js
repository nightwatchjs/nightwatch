var MockServer  = require('mockserver');
module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  'test clearValue command' : function(test) {
    var client = this.client.api;

    MockServer.addMock({
      'url' : '/wd/hub/session/1352110219202/element/0/clear',
      'response' : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    client
      .clearValue('#weblogin', function callback(result) {
        test.equals(result.status, 0);
      })
      .clearValue('css selector', '#weblogin', function callback(result) {
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
