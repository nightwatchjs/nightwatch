const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('getCookie', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getCookie(<name>)', function(done) {
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
    this.client.api.getCookie('test_cookie', function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.name, 'test_cookie');
      assert.strictEqual(result.value, '123456');
    });

    this.client.api.getCookie('other_cookie', function callback(result) {
      assert.strictEqual(result, null);
    });

    this.client.start(done);
  });

  it('client.getCookie(<name>) - empty result', function(done) {
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
      assert.strictEqual(result, null);
    });

    this.client.start(done);
  });
});
