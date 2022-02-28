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

  it('test sample chrome CDP command', async function(browser) {
    browser.driver.sendAndGetDevToolsCommand = function(command, args) {
      return Promise.resolve({
        args,
        command
      });
    }

    const dom = await browser.chrome.sendAndGetDevToolsCommand('DOMSnapshot.captureSnapshot', {
      computedStyles: []
    });

    assert.deepStrictEqual(dom, {
      command: 'DOMSnapshot.captureSnapshot',
      args: {
        computedStyles: []
      }
    });
  })
});
