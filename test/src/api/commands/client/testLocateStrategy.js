const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('Locate strategies', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.useXpath()', function(done) {
    let client = this.client;
    this.client.api.useXpath(function() {
      assert.strictEqual(client.locateStrategy, 'xpath');
    });

    this.client.start(done);
  });

  it('browser.useCss()', function(done) {
    let client = this.client;
    this.client.api.useCss(function() {
      assert.strictEqual(client.locateStrategy, 'css selector');
    });

    this.client.start(done);
  });
});
