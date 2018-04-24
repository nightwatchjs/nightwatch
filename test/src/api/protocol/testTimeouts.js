const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('timeouts commands', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testTimeoutsValid', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/timeouts');
        assert.deepEqual(opts.data, {type: 'script', ms: 1000});
      },
      commandName: 'timeouts',
      args: ['script', 1000]
    });
  });

  it('testTimeoutsInvalid', function() {
    let protocol = this.protocol;

    assert.throws(
      function() {
        protocol.timeouts('nonscript', 1000);
      }
    );

    assert.throws(
      function() {
        protocol.timeouts('script');
      }
    );
  });

  it('testTimeoutsAsyncScript', function() {
    Globals.protocolTest.call(this, {
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
    Globals.protocolTest.call(this, {
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
