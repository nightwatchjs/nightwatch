const {Before, After} = require('@cucumber/cucumber');

Before(async function(testCase) {
  if (!this.client) {
    console.error('Nightwatch client was not created.');

    return;
  }

  this.client.updateCapabilities({
    testCap: 'testing'
  });

  this.browser = await this.client.launchBrowser();
});