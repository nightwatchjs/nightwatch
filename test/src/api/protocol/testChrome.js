const assert = require('assert');

const Globals = require('../../../lib/globals.js');

describe('Chrome API commands', function () {
  before(function () {
    Globals.protocolBefore();
  });

  it('testLaunchApp', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.command, 'launchApp');
      },
      commandName: 'chrome.launchApp',
      args: ['1'],
      browserDriver: 'chrome'
    }).then((result) => {
      if (result.error) {
        throw result.error;
      }
      assert.deepStrictEqual(result.value, null);
    });
  });
});
