var MockServer  = require('mockserver');
module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testClickCommand : function(test) {
    var client = this.client.api;

    MockServer.addMock({
      'url' : '/wd/hub/session/1352110219202/element/0/click',
      'response' : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    client.click('#weblogin', function callback(result) {
      test.equals(result.status, 0);
    }).click('css selector', '#weblogin', function callback(result) {
      test.equals(result.status, 0);
      test.done();
    });
  },

  testClickCommandWithXpath : function(test) {
    var client = this.client.api;

    MockServer.addMock({
      'url' : '/wd/hub/session/1352110219202/element/0/click',
      'response' : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    client
      .useXpath()
      .click('//weblogin', function callback(result) {
        test.equals(result.status, 0);
      })
      .click('css selector', '#weblogin', function callback(result) {
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
