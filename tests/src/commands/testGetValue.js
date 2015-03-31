var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testCommand : function(test) {
    var client = this.client.api;

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/attribute/value',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : 'test value'
      })
    });

    client.getValue('css selector', '#weblogin', function callback(result) {
      test.equals(result.value, 'test value');
    }).getValue('#weblogin', function callback(result) {
      test.equals(result.value, 'test value');
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
