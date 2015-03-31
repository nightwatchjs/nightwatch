var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testCommand : function(test) {
    var client = this.client.api;

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/attribute/class',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : 'test_class'
      })
    });

    client.getAttribute('#weblogin', 'class', function callback(result) {
      test.equals(result.value, 'test_class');
    }).getAttribute('css selector', '#weblogin', 'class', function callback(result) {
      test.equals(result.value, 'test_class');
      test.done();
    });
  },

  tearDown : function(callback) {
    delete this.client;
    // clean up
    callback();
  }
};
