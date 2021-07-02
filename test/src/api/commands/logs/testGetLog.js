const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getLog', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getLog()', function(done) {
    const api = this.client.api;
    this.client.api.getLog('browser', function(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(Array.isArray(result), true, 'result is array');
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].message, 'Test log');
      assert.strictEqual(result[1].message, 'Test log2');
    });

    this.client.start(done);
  });

  it('client.getLog() implicit', function(done) {
    this.client.api.getLog(function(result) {
      assert.strictEqual(result.length, 2);
      assert.strictEqual(Array.isArray(result), true, 'result is array');
    });

    this.client.start(done);
  });

  it('client.getLog() with callback rejecting a Promise', function() {
    this.client.api.getLog('browser', function(result) {
      return new Promise((resolve, reject) => {
        reject(new Error('test error'));
      });
    });

    return this.client.start(function(err) {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Error while running "getLog" command: test error');
    });
  });

  it('client.getLog() with callback returning a Promise', function() {
    let commandResult;
    this.client.api.getLog('browser', function(result) {
      commandResult = result;

      return new Promise((resolve, reject) => {
        resolve();
      });
    });

    return this.client.start(function(err) {
      assert.strictEqual(Array.isArray(commandResult), true, 'result is array');
      assert.strictEqual(commandResult.length, 2);
    });
  });
});
