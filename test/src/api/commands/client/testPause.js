const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.pause()', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.pause(10)', function(done) {
    const startTime = new Date();
    this.client.api.pause(10, function() {
      const timeElapsed = new Date() - startTime;
      assert.ok(timeElapsed >= 10);
      assert.ok(timeElapsed <= 20);
    });

    this.client.start(done);
  });

  it('browser.pause(200)', function(done) {
    const startTime = new Date();
    this.client.api.pause(200, function() {
      const timeElapsed = new Date() - startTime;
      assert.ok(timeElapsed >= 200);
      assert.ok(timeElapsed <= 210);
    });

    this.client.start(done);
  });
});