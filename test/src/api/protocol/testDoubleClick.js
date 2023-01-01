const assert = require('assert');
const CommandGlobals = require('../../../lib/globals/commands-w3c.js');

describe('client.doubleClick()', function() {
  let callbackResult;

  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .elementIdDoubleClick() - successful', function() {

    this.client.transport.driver.actions = function() {
      return {
        doubleClick: function() {
          return {
            perform: function() {
              return Promise.resolve();
            }
          };
        }
      };
    };

    this.client.api.elementIdDoubleClick(function callback(result) {
      callbackResult = result;
    });

    return this.client.start(function() {
      assert.ok(callbackResult, 'Result from callback is undefined');
      assert.strictEqual(callbackResult.status, 0);
      assert.strictEqual(callbackResult.value, null);
    });
  });

  it('test .elementIdDoubleClick - failed', function() {

    this.client.transport.driver.actions = function() {
      return {
        doubleClick: function() {
          return {
            perform: function() {
              return Promise.reject(new Error('no such window'));
            }
          };
        }
      };
    };

    this.client.api.elementIdDoubleClick(function callback(result) {
      callbackResult = result;
    });

    return this.client.start(function() {
      assert.ok(callbackResult, 'Result from callback is undefined');
      assert.strictEqual(callbackResult.status, -1);
      assert.strictEqual(callbackResult.error.message, 'no such window');
    });
  });
});