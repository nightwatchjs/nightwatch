const assert = require('assert');

describe('chrome api demo', function () {
  after((browser) => browser.end());

  const availableChromeCommands = [
    'launchApp',
    'getNetworkConditions',
    'setNetworkConditions',
    'sendDevToolsCommand',
    'sendAndGetDevToolsCommand',
    'setPermission',
    'setDownloadPath',
    'getCastSinks',
    'setCastSinkToUse',
    'startCastTabMirroring',
    'getCastIssueMessage',
    'stopCasting'
  ];

  it('test chrome available API commands', async function () {
    availableChromeCommands.forEach((command) => {
      assert.strictEqual(typeof browser.chrome[command], 'function');
    });
  });
});
