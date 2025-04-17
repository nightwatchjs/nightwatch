describe('Take Screenshot Demo', function () {
  before((browser) => {
    browser.navigateTo('https://nightwatchjs.org/');
  });

  it('takes screenshot without async-await', function (browser) {
    browser.waitForElementVisible('body');

    const heading = browser.element('.hero__heading');
    const screenshot = heading.takeScreenshot();
    screenshot.then((screenshotData) => {
      require('fs').writeFile('heading.png', screenshotData, 'base64', (err) => {
        browser.assert.strictEqual(err, null);
      });
    });
  });

  it('takes screenshot with async-await', async function (browser) {
    browser.waitForElementVisible('body');

    const heading = browser.element('.hero__heading');
    const screenshotData = await heading.takeScreenshot();

    require('fs').writeFile('heading1.png', screenshotData, 'base64', (err) => {
      browser.assert.strictEqual(err, null);
    });
  });

  after((browser) => browser.end());
});
