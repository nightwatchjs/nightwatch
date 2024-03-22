const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('client.keys()', function() {
  let callbackResult;

  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .keys() single', function() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/keys',
      method: 'POST',
      postdata: {value: ['\uE007']},
      response: JSON.stringify({
        sessionId: '1352110219202',
        value: null,
        status: 0
      })
    });

    this.client.api.keys('\uE007', function callback(result) {
      callbackResult = result;
    });

    return this.client.start(function() {
      assert.ok(callbackResult, 'Result from callback is undefined');
      assert.strictEqual(callbackResult.status, 0);
      assert.strictEqual(callbackResult.value, null);
    });
  });

  it('test .keys() array', function() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/keys',
      method: 'POST',
      postdata: {value: ['A', 'B']},
      response: JSON.stringify({
        sessionId: '1352110219202',
        value: null,
        status: 0
      })
    });

    this.client.api.keys(['A', 'B'], function callback(result) {
      callbackResult = result;
    });

    return this.client.start(function() {
      assert.ok(callbackResult, 'Result from callback is undefined');
      assert.strictEqual(callbackResult.status, 0);
      assert.strictEqual(callbackResult.value, null);
    });
  });
});

