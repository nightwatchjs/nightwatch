const Nightwatch = require('../../../lib');
const {Before, After, setDefaultTimeout} = require('@cucumber/cucumber');

setDefaultTimeout(-1);

Before(async function({pickle}) {
  const client =  Nightwatch.createClient({
    capabilites: {},
    headless: this.parameters.headless,
    env: this.parameters.env,
    parallel: true,
    output: true,
    desiredCapabilities: {
      name: pickle.name
    }
  });

  if (!client.runner_options.disable_session_autocreate) {
    const browser = await client.session();
    Object.defineProperty(global, 'browser', {
      configurable: true,
      get: function() {
        return browser;
      }.bind(this)
    });
  }

  
});

After(async function() {
  await browser.quit();
});
