const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('Android activity commands', function () {
  before(function () {
    Globals.protocolBefore();
  });

  it('testResetApp', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.path, '/session/1352110219202/appium/app/reset');
      },
      commandName: 'appium.getResetApp',
      args: []
    });
  });
});
