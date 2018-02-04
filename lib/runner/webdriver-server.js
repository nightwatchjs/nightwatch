const Logger = require('../util/logger.js');
const BrowserName = require('../util/browsername.js');
const ChromeDriver = require('./wd-instances/chromedriver.js');

class WDServer {

  /**
   * @param {Object} settings The "webdriver" section from the global settings object
   */
  constructor(settings) {
    this.settings = settings;
    this.instance = this.getInstance();
  }

  getInstance() {
    let browserName = this.settings.desiredCapabilities.browserName;

    switch (browserName) {
      case BrowserName.CHROME:
        return new ChromeDriver(this.settings.webdriver);
    }
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

