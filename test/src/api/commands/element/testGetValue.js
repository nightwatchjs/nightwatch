const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getValue', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getValue()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/property/value',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'test value'
      })
    });

    this.client.api.getValue('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.value, 'test value');
    }).getValue('#weblogin', function callback(result) {
      assert.strictEqual(result.value, 'test value');
    });

    this.client.start(done);
  });
});
