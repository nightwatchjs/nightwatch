const chrome = require('selenium-webdriver/chrome');
const BaseDriver = require('./base-driver.js');

class ChromeDriver extends BaseDriver {
  static get serviceName() {
    return 'ChromeDriver';
  }

  get npmPackageName() {
    return 'chromedriver';
  }

  get outputFile() {
    return 'chromedriver.log';
  }

  /**
   * Port will be auto generated and probed by selenium
   * @returns {number}
   */
  get defaultPort() {
    return 0;
  }

  get serviceName() {
    return ChromeDriver.serviceName;
  }

  get serviceDownloadUrl() {
    return 'https://sites.google.com/a/chromium.org/chromedriver/downloads';
  }

  createService() {
    this.service = new chrome.ServiceBuilder(this.settings.server_path);

    if (Array.isArray(this.cliArgs)) {
      this.service.addArguments(...this.cliArgs);
    }

    this.service.enableVerboseLogging();

    super.createService();
  }
}

module.exports = ChromeDriver;
