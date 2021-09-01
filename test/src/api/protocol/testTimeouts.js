const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('timeouts commands', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testTimeoutsValid', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'timeouts');
        assert.deepStrictEqual(opts.data, {'script': 1000});
      },
      commandName: 'timeouts',
      args: ['script', 1000]
    }).then((result) => {
      assert.strictEqual(result, null);
    });
  });

  it('testTimeouts invalid type', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
      },
      commandName: 'timeouts',
      args: ['nonscript', 1000]
    }).catch(err => {
      assert.strictEqual(err.message, 'Error while running "timeouts" command: Invalid timeouts type value: nonscript. Accepted values are: script, implicit, pageLoad');

      return true;
    }).then(result => assert.strictEqual(result, true));
  });

  it('testTimeouts invalid value', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
      },
      commandName: 'timeouts',
      args: ['script']
    }).catch(err => {
      assert.strictEqual(err.message, 'Error while running "timeouts" command: Second argument to .timeouts() command must be a number. undefined given.');

      return true;
    }).then(result => assert.strictEqual(result, true));
  });

  it('testTimeoutsAsyncScript', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'timeouts');
        assert.deepStrictEqual(opts.data, {script: 1000});
      },
      commandName: 'timeoutsAsyncScript',
      args: [1000]
    }).then((result) => {
      assert.strictEqual(result, null);
    });
  });

  it('testTimeoutsImplicitWait', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'timeouts');
        assert.deepStrictEqual(opts.data, {implicit: 1000});
      },
      commandName: 'timeoutsImplicitWait',
      args: [1000]
    }).then((result) => {
      assert.strictEqual(result, null);
    });
  });

});
