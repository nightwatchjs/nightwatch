const {remote} = require('webdriverio');

describe('sampleTest with webdriverIO', function() {
  this.settings.start_session = false;

  let browser;

  before(async () => {
    delete this.desiredCapabilities.name;

    browser = await remote({
      automationProtocol: 'webdriver',
      logLevel: 'warn',
      runner: 'local',
      port: 10195,
      capabilities: {
        alwaysMatch: {
          browserName: 'firefox'
        }
      },

      desiredCapabilities: {
        browserName: 'firefox',
      },
    });
  });

  after(async () => {
    await browser.deleteSession();
    browser = null
  });

  test('navigate', async function(nightwatch) {
    await browser.url('http://localhost');
  });

  test('sampleTest', async function(nightwatch) {
    const element = await browser.$('#weblogin');

    await nightwatch.expect.element(element).visible;
    await nightwatch.assert.visible(element);

    await element.click();
  });
});
