const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('sendKeys command', function () {
  before(function () {
    Globals.protocolBefore();
  });

  it('test sendKeys', function () {
    const commands = [];

    return Globals.protocolTest({
      commandName: 'sendKeys',
      args: [
        'weblogin',
        'nightwatch',
        function (result) {
          assert.deepStrictEqual(result.value, null);
          assert.deepStrictEqual(result.status, 0);
        }
      ],
      assertion: function (opts) {
        commands.push(opts.command);
      }
    }).then(() => {
      assert.deepStrictEqual(commands, ['findElements', 'sendKeysToElement']);
    });
  });
});
