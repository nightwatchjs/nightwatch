var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testCommand : function(test) {
    var client = this.client.api;

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/submit',
      method:'POST',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    client.submitForm('#weblogin', function callback(result) {
      test.equals(result.status, 0);
    }).submitForm('css selector', '#weblogin', function callback(result) {
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
