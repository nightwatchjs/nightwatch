const Settings = require('../settings/settings.js');
const Transport = require('../transport/transport.js');
const Concurrency = require('./concurrency/concurrency.js');
const {Logger, BrowserName} = require('../utils');

const __wd_instances__ = {};
let __concurrencyEnabled__ = false;
let __testWorkersMode__ = false;

class WDServer {

  static set concurrencyEnabled(val) {
    __concurrencyEnabled__ = val;
  }

  static set testWorkersMode(val) {
    __testWorkersMode__ = val;
  }

  static get concurrencyEnabled() {
    return __concurrencyEnabled__;
  }

  static isTestWorkersMode() {
    return __testWorkersMode__;
  }

  static get instances() {
    return __wd_instances__;
  }

  /**
   * @param {Object} baseConfig
   * @param {Object} argv
   * @param {Array} testEnvArray
   */
  static createInstances(baseConfig, argv, testEnvArray) {
    testEnvArray.forEach(testEnv => {
      const settings = Settings.parse({}, baseConfig, argv, testEnv);
      let browserName = settings.desiredCapabilities.browserName.toLowerCase();

      if (!__wd_instances__[browserName]) {
        __wd_instances__[browserName] = new WDServer(settings, argv);
      }
    });
  }

  static startInstances() {
    let promises = [];

    Object.keys(__wd_instances__).forEach(browserName => {
      promises.push(__wd_instances__[browserName].start());
    });

    return Promise.all(promises);
  }

  static stopInstances() {
    let promises = [];

    Object.keys(__wd_instances__).forEach(browserName => {
      promises.push(__wd_instances__[browserName].stop());
    });

    return Promise.all(promises);
  }

  static getWebDriverImpl(settings) {
    const browserName = Transport.getBrowserName(settings);

    if (WDServer.isUsingSeleniumServer(settings)) {
      return require('./wd-instances/selenium-server.js');
    }

    switch (browserName) {
      case BrowserName.CHROME:
        return require('./wd-instances/chromedriver.js');

      case BrowserName.SAFARI:
        return require('./wd-instances/safaridriver.js');

      case BrowserName.FIREFOX:
        return require('./wd-instances/geckodriver.js');

      case BrowserName.EDGE:
        return require('./wd-instances/edgedriver.js');

      default:
        return null;
    }
  }

  static isUsingSeleniumServer(settings) {
    return settings.selenium && settings.selenium.start_process;
  }

  /**
   * @param {Object} settings The "webdriver" section from the global settings object
   */
  constructor(settings, argv = {}) {
    this.settings = settings;
    this.argv = argv;
    this.instance = this.createInstance();
  }

  createInstance() {
    const WebDriverImpl = WDServer.getWebDriverImpl(this.settings);

    if (WDServer.isUsingSeleniumServer(this.settings)) {
      return new WebDriverImpl(this.settings.selenium);
    }

    if (!this.settings.webdriver.start_process) {
      return null;
    }

    if (!WebDriverImpl) {
      const browserName = Transport.getBrowserName(this.settings);

      throw new Error(`Unknown browser driver: ${browserName}. Please try using Selenium Server instead.`);
    }

    if (WDServer.concurrencyEnabled && WDServer.isTestWorkersMode() && !WebDriverImpl.supportsConcurrency) {
      const err = new Error(`Concurrency is not supported at the moment in ${WebDriverImpl.serviceName}. It is only supported when using Selenium Server.\n`);
      err.showTrace = false;

      throw err;
    }

    return new WebDriverImpl(this.settings.webdriver, {
      findFreePort: Concurrency.isTestWorker(this.argv) && !WDServer.isUsingSeleniumServer(this.settings)
    });
  }

  async start() {
    if (!this.settings.webdriver.start_process) {
      return Promise.resolve();
    }

    return this.instance.start();
  }

  stop() {
    if (!this.settings.webdriver.start_process) {
      return Promise.resolve();
    }

    return this.instance.checkForOpenSessions()
      .then(result => {
        if (result && Array.isArray(result.value) && result.value.length > 0) {
          Logger.warn(`Found ${result.value.length} open sessions. Attempting to forcefully close...`);

          return this.instance.closeOpenSessions(result.value);
        }

        return true;
      })
      .then(() => this.instance.stop());
  }
}


module.exports = WDServer;
