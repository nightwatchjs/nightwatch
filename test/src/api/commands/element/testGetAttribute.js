const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getAttribute', function() {

  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getAttribute()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'test_class'
      })
    }, true, true);

    this.client.api.getAttribute('#weblogin', 'class', function callback(result) {
      assert.strictEqual(result.value, 'test_class');
    }).getAttribute('css selector', '#weblogin', 'class', function callback(result) {
      assert.strictEqual(result.value, 'test_class');
    });

    this.client.start(done);
  });
});
