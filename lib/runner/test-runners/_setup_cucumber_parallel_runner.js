const Nightwatch = require('../../../lib');
const {Before, After, setDefaultTimeout} = require('@cucumber/cucumber');

setDefaultTimeout(-1);

Before(async function({pickle}) {
  const browser = await Nightwatch.createClient({
    capabilites: {},
    headless: false,
    env: this.parameters.env,
    parallel: true,
    output: false,
    desiredCapabilities: {
      name: pickle.name
    }
  }).session();

  Object.defineProperty(global, 'browser', {
    configurable: true,
    get: function() {
      return browser;
    }.bind(this)
  });
});

After(async function() {
  await browser.quit();
});
