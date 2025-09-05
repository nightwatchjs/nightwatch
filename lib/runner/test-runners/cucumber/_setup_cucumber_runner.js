const Nightwatch = require('../../../index.js');
const {Before, After, setDefaultTimeout} = require('@cucumber/cucumber');

setDefaultTimeout(-1);

let sharedClient;
let sharedBrowser;

Before(async function({ pickle, testCaseStartedId }) {
  process.env.CUCUMBER_TEST_CASE_STARTED_ID = testCaseStartedId;
  const forceUnquit = this.parameters.settings.forceUnquit;

  if (!sharedClient || !forceUnquit) {  // create new client only if none exists or forceUnquit is false
    const webdriver = {};
    if (this.parameters['webdriver-host']) webdriver.host = this.parameters['webdriver-host'];
    if (this.parameters['webdriver-port']) webdriver.port = this.parameters['webdriver-port'];
    if (typeof this.parameters['start-process'] !== 'undefined') webdriver.start_process = this.parameters['start-process'];

    const globals = {};
    if (this.parameters['retry-interval']) globals.waitForConditionPollInterval = this.parameters['retry-interval'];

    sharedClient = Nightwatch.createClient({
      headless: this.parameters.headless,
      env: this.parameters.env,
      timeout: this.parameters.timeout,
      parallel: !!this.parameters.parallel,
      output: !this.parameters['disable-output'],
      enable_global_apis: true,
      silent: !this.parameters.verbose,
      always_async_commands: true,
      webdriver,
      persist_globals: this.parameters['persist-globals'],
      config: this.parameters.config,
      test_settings: this.parameters.settings,
      globals
    });

    if (sharedClient.settings.sync_test_names) {
      sharedClient.updateCapabilities({ name: pickle.name });
    }

    const { options = {} } = sharedClient.settings.test_runner;
    if (options.auto_start_session || typeof options.auto_start_session === 'undefined') {
      sharedBrowser = await sharedClient.launchBrowser();
    }
  }

  this.client = sharedClient;
  this.browser = sharedBrowser;
});


After(async function(testCase) {
  const { result } = testCase;
  if (this.client && result) {
    const error = result.status === 'FAILED' ? new Error(result.message) : null;
    await this.client.transport.testSuiteFinished(error);
  }

  const forceUnquit = this.parameters.settings.forceUnquit;

  if (!forceUnquit && this.browser?.sessionId) {
    await this.browser.quit();
    sharedBrowser = null;
    sharedClient = null;
  }
});
