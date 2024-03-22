const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getText', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getText()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/text',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: 'sample text'
      })
    });

    this.client.api.getText('css selector', '#weblogin', function callback(result) {
      assert.strictEqual(result.value, 'sample text');
    }).getText('#weblogin', function callback(result) {
      assert.strictEqual(result.value, 'sample text');
    });

    this.client.start(done);
  });
});