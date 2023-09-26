const Nightwatch = require('../../../index.js');
const {Before, After, setDefaultTimeout} = require('@cucumber/cucumber');
const NightwatchFormatter = require('./nightwatch-format.js');

setDefaultTimeout(-1);

Before(function({pickle, testCaseStartedId}) {
  const webdriver = {};

  process.env.CUCUMBER_TEST_CASE_STARTED_ID = testCaseStartedId;
  // eslint-disable-next-line no-console
  console.log('setup_cucumber_before', 'PID:', process.pid, 'testCaseStartedId:', testCaseStartedId);

  if (this.parameters['webdriver-host']) {
    webdriver.host = this.parameters['webdriver-host'];
  }

  if (this.parameters['webdriver-port']) {
    webdriver.port = this.parameters['webdriver-port'];
  }

  if (typeof this.parameters['start-process'] != 'undefined') {
    webdriver.start_process = this.parameters['start-process'];
  }

  let persist_globals;
  if (this.parameters['persist-globals']) {
    persist_globals = this.parameters['persist-globals'];
  }

  const globals = {};
  if (this.parameters['retry-interval']) {
    globals.waitForConditionPollInterval = this.parameters['retry-interval'];
  }

  this.client = Nightwatch.createClient({
    headless: this.parameters.headless,
    env: this.parameters.env,
    timeout: this.parameters.timeout,
    parallel: !!this.parameters.parallel,
    output: !this.parameters['disable-output'],
    enable_global_apis: true,
    silent: !this.parameters.verbose,
    always_async_commands: true,
    webdriver,
    persist_globals,
    config: this.parameters.config,
    test_settings: this.parameters.settings,
    globals
  });

  if (this.client.settings.sync_test_names) {
    const {name} = pickle;
    this.client.updateCapabilities({
      name
    });
  }

  // eslint-disable-next-line
  console.log('\n');

  const {options = {}} = this.client.settings.test_runner;

  // auto_start_session is true by default
  if (options.auto_start_session || typeof options.auto_start_session == 'undefined') {
    return this.client.launchBrowser().then(browser => {
      this.browser = browser;
    });
  }
});

After(async function(testCase) {

  //send test-case result to cloud provider
  const {result} = testCase;
  if (this.client && result) {
    const error = result.status === 'FAILED' ? new Error(result.message) : null;
    await this.client.transport.testSuiteFinished(error);
  }

  if (this.browser) {
    await this.browser.quit();
  }
});
