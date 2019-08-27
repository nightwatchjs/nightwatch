const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('timeouts commands', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testTimeoutsValid', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/timeouts');
        assert.deepEqual(opts.data, {type: 'script', ms: 1000});
      },
      commandName: 'timeouts',
      args: ['script', 1000]
    });
  });

  it('testTimeouts invalid type', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
      },
      commandName: 'timeouts',
      args: ['nonscript', 1000]
    }).catch(err => {
      assert.equal(err.message, 'Invalid timeouts type value: nonscript. Accepted values are: script, implicit, page load, pageLoad');

      return true;
    }).then(result => assert.strictEqual(result, true));
  });

  it('testTimeouts invalid value', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
      },
      commandName: 'timeouts',
      args: ['script']
    }).catch(err => {
      assert.equal(err.message, 'Second argument to .timeouts() command must be a number. undefined given.');

      return true;
    }).then(result => assert.strictEqual(result, true));
  });

  it('testTimeoutsAsyncScript', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/timeouts/async_script');
        assert.deepEqual(opts.data, {ms: 1000});
      },
      commandName: 'timeoutsAsyncScript',
      args: [1000]
    });
  });

  it('testTimeoutsImplicitWait', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/timeouts/implicit_wait');
        assert.deepEqual(opts.data, {ms: 1000});
      },
      commandName: 'timeoutsImplicitWait',
      args: [1000]
    });
  });

});
