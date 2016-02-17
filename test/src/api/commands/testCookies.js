var MockServer = require('../../../lib/mockserver.js');
var assert = require('assert');
var Nightwatch = require('../../../lib/nightwatch.js');
var MochaTest = require('../../../lib/mochatest.js');

module.exports = MochaTest.add('getCookies', {
  'client.getCookies()': function (done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: [{
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

    client.getCookies(function callback(result) {
      assert.equal(result.value.length, 1);
      assert.equal(result.value[0].name, 'test_cookie');
    });

    client.getCookie('test_cookie', function callback(result) {
      assert.equal(result.name, 'test_cookie');
      assert.equal(result.value, '123456');
    });

    client.getCookie('other_cookie', function callback(result) {
      assert.equal(result, null);
    });

    Nightwatch.start(done);

  },

  'client.getCookies() - empty result': function (done) {
    var client = Nightwatch.api();

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: []
      })
    });

    client.getCookie('other_cookie', function callback(result) {
      assert.equal(result, null);
    });

    Nightwatch.start(done);
  }
});
