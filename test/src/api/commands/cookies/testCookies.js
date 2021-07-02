const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

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
      response: {
        sessionId: '1352110219202',
        status: 0,
        value: [{
          name: 'test_cookie',
          value: '123456',
          path: '/',
          domain: 'example.org',
          secure: false
        }]
      }
    }, true);

    const api = this.client.api;
    this.client.api.getCookies(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.value.length, 1);
      assert.strictEqual(result.value[0].name, 'test_cookie');
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
    }, true);

    this.client.api.getCookies(function callback(result) {
      assert.ok(Array.isArray(result.value));
      assert.strictEqual(result.value.length, 0);
    });

    this.client.start(done);
  });
});
