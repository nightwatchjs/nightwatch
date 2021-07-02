const assert = require('assert');
const Mocks = require('../../../../lib/command-mocks.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('maximizeWindow', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.maximizeWindow()', function(done) {
    Mocks.maximizeWindow();
    this.client.api.maximizeWindow(function callback(result) {
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });
});
