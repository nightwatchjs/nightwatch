const Logger = require('../util/logger.js');
const Settings = require('../settings/settings.js');
const BrowserName = require('../util/browsername.js');
const ChromeDriver = require('./wd-instances/chromedriver.js');
const GeckoDriver = require('./wd-instances/GeckoDriver.js');
const SeleniumServer = require('./wd-instances/selenium-server.js');

const __wd_intances__ = {};

class WDServer {

  /**
   * @param {Object} settings The "webdriver" section from the global settings object
   */
  constructor(settings) {
    this.settings = settings;
    this.instance = this.createInstance();
  }

  /**
   * @param {Object} baseConfig
   * @param {Object} argv
   * @param {Array} testEnvArray
   */
  static createInstances(baseConfig, argv, testEnvArray) {
    testEnvArray.forEach(testEnv => {
      let settings = Settings.parse({}, baseConfig, argv, testEnv);
      let browserName = settings.desiredCapabilities.browserName;

      if (!__wd_intances__[browserName]) {
        __wd_intances__[browserName] = new WDServer(settings);
      }
    });
  }

  static startInstances() {
    let promises = [];

    Object.keys(__wd_intances__).forEach(browserName => {
      promises.push(__wd_intances__[browserName].start());
    });

    return Promise.all(promises);
  }

  static stopInstances() {
    let promises = [];

    Object.keys(__wd_intances__).forEach(browserName => {
      promises.push(__wd_intances__[browserName].stop());
    });

    return Promise.all(promises);
  }

  createInstance() {
    if (this.isUsingSeleniumServer()) {
      return new SeleniumServer(this.settings.selenium);
    }

    let browserName = this.settings.desiredCapabilities.browserName;

    switch (browserName) {
      case BrowserName.CHROME:
        return new ChromeDriver(this.settings.webdriver);

      case BrowserName.FIREFOX:
        return new GeckoDriver(this.settings.webdriver);
    }
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
      .then(() => {
        return this.instance.stop();
      });
  }
}


module.exports = WDServer;

