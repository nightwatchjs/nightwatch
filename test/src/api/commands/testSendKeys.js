const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('sendKeys', function() {
 
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done, {
      output: false,
      globals: {
        waitForConditionPollInterval: 10,
        waitForConditionTimeout: 11
      }
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.sendKeys()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/value',
      method: 'POST',
      postdata: {'text': 'password', 'value': ['p', 'a', 's', 's', 'w', 'o', 'r', 'd']},
      response: {
        sessionId: '1352110219202',
        status: 0
      }
    });

    this.client.api
      .sendKeys('css selector', '#weblogin', 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .sendKeys('css selector', {
        selector: '#weblogin',
        timeout: 100
      }, 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .sendKeys({
        selector: '#weblogin',
        timeout: 100
      }, 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .sendKeys('#weblogin', 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .sendKeys('#weblogin', undefined, function callback(result) {
        assert.strictEqual(result.status, -1);
        assert.ok(result.value.message.includes('each key must be a number'))
      })
      .sendKeys('#weblogin', ['password', undefined], function callback(result) {
        assert.strictEqual(result.status, -1);
        assert.ok(result.value.message.includes('each key must be a number'))
      })
      .sendKeys('#weblogin', null, function callback(result) {
        assert.strictEqual(result.status, -1);
        assert.ok(result.value.message.includes('each key must be a number'))
      })
      .sendKeys('#weblogin', ['password', null], function callback(result) {
        assert.strictEqual(result.status, -1);
        assert.ok(result.value.message.includes('each key must be a number'))
      });

    this.client.start(done);
  });
});
