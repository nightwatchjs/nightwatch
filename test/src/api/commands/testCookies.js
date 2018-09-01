const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('getCookies', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getCookies()', function(done) {
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

    this.client.api.getCookies(function callback(result) {
      assert.equal(result.value.length, 1);
      assert.equal(result.value[0].name, 'test_cookie');
    });

    this.client.api.getCookie('test_cookie', function callback(result) {
      assert.equal(result.name, 'test_cookie');
      assert.equal(result.value, '123456');
    });

    this.client.api.getCookie('other_cookie', function callback(result) {
      assert.equal(result, null);
    });

    this.client.start(done);
  });

  it('client.getCookies() - empty result', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: []
      })
    });

    this.client.api.getCookie('other_cookie', function callback(result) {
      assert.equal(result, null);
    });

    this.client.start(done);
  });
});
