const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('session log commands', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testLog', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'sessionLog');
      },
      commandName: 'sessionLog',
      args: []
    }).then((result) => {
      assert.strictEqual(typeof result.error, 'undefined');
      assert.deepStrictEqual(Object.keys(result.value[0]), ['level', 'type', 'timestamp', 'message']);
    });
  });

  it('testLogTypes', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'sessionLogTypes');
      },
      commandName: 'sessionLogTypes',
      args: []
    }).then((result) => {
      assert.strictEqual(typeof result.error, 'undefined');
      assert.deepStrictEqual(result.value, ['browser', 'driver']);
    });
  });

});
