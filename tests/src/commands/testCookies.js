var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },

  testGetCookies : function(test) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/cookie',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : [{
          name: 'test_cookie',
          value: '123456',
          path: '/',
          domain: 'example.org',
          secure: false,
          class: 'org.openqa.selenium.Cookie',
          hCode: 91423566
        }]
      })
    });

    var client = this.client.api;
    client.getCookies(function callback(result) {
      test.equals(result.value.length, 1);
      test.equals(result.value[0].name, 'test_cookie');
    });

    client.getCookie('test_cookie', function callback(result) {
      test.equals(result.name, 'test_cookie');
      test.equals(result.value, '123456');
    });

    client.getCookie('other_cookie', function callback(result) {
      test.equals(result, null);
      test.done();
    });
  },

  testGetCookieEmptyResult : function(test) {
    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/cookie',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : []
      })
    });

    this.client.api.getCookie('other_cookie', function callback(result) {
      test.equals(result, null);
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
