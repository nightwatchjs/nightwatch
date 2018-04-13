const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('maximizeWindow', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.maximizeWindow()', function(done) {
    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/window/current/maximize',
      'response': JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    }, true);

    this.client.api.maximizeWindow(function callback(result) {
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });
});
