const assert = require('assert');

describe('appium api demo', function () {
  after((app) => app.end());

  const availableAppiumCommands = [
    'startActivity',
    'getCurrentActivity',
    'getCurrentPackage',
    'getOrientation',
    'setOrientation',
    'getGeolocation',
    'setGeolocation',
    'pressKeyCode',
    'longPressKeyCode',
    'hideKeyboard',
    'isKeyboardShown',
    'getContexts',
    'getContext',
    'setContext'
  ];

  it('test chrome available API commands', async function () {
    // app variable is available globally
    // eslint-disable-next-line
    assert.strictEqual(app !== undefined, true);

    availableAppiumCommands.forEach((command) => {
      // eslint-disable-next-line
      assert.strictEqual(typeof app.appium[command], 'function');
    });
  });
});
