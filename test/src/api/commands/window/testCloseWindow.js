const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('closeWindow', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.closeWindow() success', function(done) {
    const api = this.client.api;
    this.client.api.closeWindow(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
    });

    this.client.start(done);
  });
});
