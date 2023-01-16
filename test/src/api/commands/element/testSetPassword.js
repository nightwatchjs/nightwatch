const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('setPassword', function() {

  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.setPassword()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/value',
      method: 'POST',
      postdata: {
        text: 'password',
        value: ['p', 'a', 's', 's', 'w', 'o', 'r', 'd']
      },
      response: {
        sessionId: '1352110219202',
        status: 0
      }
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/clear',
      method: 'POST',
      response: {
        sessionId: '1352110219202',
        status: 0
      }
    });

    this.client.api
      .setPassword('css selector', '#weblogin', 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .setPassword('css selector', {
        selector: '#weblogin',
        timeout: 100
      }, 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .setPassword({
        selector: '#weblogin',
        timeout: 100
      }, 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .setPassword('#weblogin', 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      });

    this.client.start(done);
  });
});
