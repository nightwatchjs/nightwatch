const assert = require('assert');

const Globals = require('../../../lib/globals.js');

describe('Firefox API commands', function () {
  before(function () {
    Globals.protocolBefore();
  });

  it('getContext', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.command, 'getContext');
      },
      commandName: 'firefox.getContext',
      args: [],
      browserDriver: 'firefox'
    }).then((result) => {
      assert.strictEqual(result.value, 'content');
    });
  });

  it('setContext', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.command, 'setContext');
      },
      commandName: 'firefox.setContext',
      args: ['content'],
      browserDriver: 'firefox'
    }).then((result) => {
      assert.strictEqual(result.value, null);
    });
  });

  it('installAddon', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.command, 'installAddon');
      },
      commandName: 'firefox.installAddon',
      args: ['path/to/Addon'],
      browserDriver: 'firefox'
    }).then((result) => {
      assert.strictEqual(result.value, '0c20aa29-db90-4eae-a3bb-012c6ae180b1');
    });
  });

  it('uninstallAddon', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.command, 'uninstallAddon');
        assert.strictEqual(opts.id, '0c20aa29-db90-4eae-a3bb-012c6ae180b1');
      },
      commandName: 'firefox.uninstallAddon',
      args: ['0c20aa29-db90-4eae-a3bb-012c6ae180b1'],
      browserDriver: 'firefox'
    }).then((result) => {
      assert.strictEqual(result.value, null);
    });
  });
});
