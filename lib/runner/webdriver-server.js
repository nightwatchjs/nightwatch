const Settings = require('../settings/settings.js');
const SafariDriver = require('./wd-instances/safaridriver.js');
const ChromeDriver = require('./wd-instances/chromedriver.js');
const GeckoDriver = require('./wd-instances/geckodriver.js');
const SeleniumServer = require('./wd-instances/selenium-server.js');
const {Logger, BrowserName} = require('../utils');

const __wd_instances__ = {};
let __concurrencyEnabled__ = false;
let __testWorkersMode__ = false;

class WDServer {

  /**
   * @param {Object} settings The "webdriver" section from the global settings object
   */
  constructor(settings) {
    this.settings = settings;
    this.instance = this.createInstance();
  }

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
      let settings = Settings.parse({}, baseConfig, argv, testEnv);
      let browserName = settings.desiredCapabilities.browserName.toLowerCase();

      if (!__wd_instances__[browserName]) {
        __wd_instances__[browserName] = new WDServer(settings);
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

  createInstance() {
    if (this.isUsingSeleniumServer()) {
      return new SeleniumServer(this.settings.selenium);
    }

    if (!this.settings.webdriver.start_process) {
      return null;
    }

    let browserName = this.settings.desiredCapabilities.browserName.toLowerCase();
    let WebDriverImpl;

    switch (browserName) {
      case BrowserName.CHROME:
        WebDriverImpl = ChromeDriver;
        break;
      case BrowserName.SAFARI:
        WebDriverImpl = SafariDriver;
        break;

      case BrowserName.FIREFOX:
        WebDriverImpl = GeckoDriver;
        break;

      default:
        throw new Error(`Unsupported browser: ${browserName}. There is no available driver.`);
    }

    if (WDServer.concurrencyEnabled && WDServer.isTestWorkersMode() && !WebDriverImpl.supportsConcurrency) {
      const err = new Error(`Concurrency is not supported at the moment in ${WebDriverImpl.serviceName}. It is only supported for ChromeDriver and Selenium Server.\n`);
      err.showTrace = false;

      throw err;
    }

    return new WebDriverImpl(this.settings.webdriver);
  }

  isUsingSeleniumServer() {
    return this.settings.selenium && this.settings.selenium.start_process;
  }

  start() {
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
