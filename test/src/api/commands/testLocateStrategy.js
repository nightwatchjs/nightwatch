const assert = require('assert');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('locateStrategies', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.useXpath()', function(done) {
    let client = this.client;
    this.client.api.useXpath(function() {
      assert.equal(client.locateStrategy, 'xpath');
    });

    this.client.start(done);
  });

  it('client.useCss()', function(done) {
    let client = this.client;
    this.client.api.useCss(function() {
      assert.equal(client.locateStrategy, 'css selector');
    });

    this.client.start(done);
  });
});
