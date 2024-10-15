const assert = require('assert');

describe('Take Screenshot Demo', function () {
  before((browser) => {
    browser.navigateTo(
      'https://nightwatchjs.org/'
    );
  });

  it('Demo', function (browser) {
    browser.waitForElementVisible('body');

    const heading = browser.element('.hero__heading');
    const screenshot =  heading.takeScreenshot();
    screenshot.then((screenshotData) => {
      require('fs').writeFile('heading.png', screenshotData, 'base64', (err) => {
        assert.strictEqual(err, null);
      });
    });
  });

  after((browser) => browser.end());
});
