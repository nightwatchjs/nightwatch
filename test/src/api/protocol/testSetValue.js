const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('setValue command', function () {
  before(function () {
    Globals.protocolBefore();
  });

  it('should clear value and setValue', function () {
    return Globals.protocolTest({
      commandName: 'setValue',
      args: [
        'weblogin',
        'nightwatch',
        function (result) {
          assert.deepStrictEqual(result.value, null);
          assert.deepStrictEqual(result.status, 0);
        }
      ],
      assertion: function (opts) {
        assert.ok(['findElements', 'clearElement', 'sendKeysToElement'].includes(opts.command));
      }
    });
  });
});
