const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('accessibility commands', function () {

  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test axe commands loaded onto the main api', function () {
    assert.strictEqual(typeof this.client.api.axeInject, 'function');
    assert.strictEqual(typeof this.client.api.axeRun, 'function');
  });

});
