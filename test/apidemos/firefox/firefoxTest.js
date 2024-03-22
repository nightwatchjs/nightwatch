const assert = require('assert');

describe('firefox api basic test', function () {
  after((browser) => browser.end());

  const availableFirefoxCommands = ['getContext', 'setContext', 'installAddon', 'uninstallAddon'];

  it('test firefox available API commands', async function () {
    availableFirefoxCommands.forEach((command) => {
      assert.strictEqual(typeof browser.firefox[command], 'function');
    });
  });
});
