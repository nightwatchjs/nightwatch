const assert = require('assert');
const CommandGlobals = require('../../../lib/globals/commands-w3c.js');

describe('client.release()', function() {
  let callbackResult;

  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .release() - successful', function() {

    this.client.transport.driver.actions = function() {
      return {
        release: function() {
          return {
            perform: function() {
              return Promise.resolve();
            }
          };
        }
      };
    };

    this.client.api.releaseMouseButton(function callback(result) {
      callbackResult = result;
    });

    return this.client.start(function() {
      assert.ok(callbackResult, 'Result from callback is undefined');
      assert.strictEqual(callbackResult.status, 0);
      assert.strictEqual(callbackResult.value, null);
    });
  });

  it('test .release - failed', function() {

    this.client.transport.driver.actions = function() {
      return {
        release: function() {
          return {
            perform: function() {
              return Promise.reject(new Error('no such window'));
            }
          };
        }
      };
    };

    this.client.api.releaseMouseButton(function callback(result) {
      callbackResult = result;
    });

    return this.client.start(function() {
      assert.ok(callbackResult, 'Result from callback is undefined');
      assert.strictEqual(callbackResult.status, -1);
      assert.strictEqual(callbackResult.error.message, 'no such window');
    });
  });
});