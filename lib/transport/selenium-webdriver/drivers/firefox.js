const firefox = require('selenium-webdriver/firefox');
const BaseDriver = require('./base-driver.js');

class GeckoDriver extends BaseDriver {
  static get serviceName() {
    return 'GeckoDriver';
  }

  get npmPackageName() {
    return 'geckodriver';
  }

  get outputFile() {
    return 'geckodriver.log';
  }

  /**
   * Port will be auto generated and probed by selenium
   * @returns {number}
   */
  get defaultPort() {
    return 0;
  }

  get serviceName() {
    return GeckoDriver.serviceName;
  }

  get serviceDownloadUrl() {
    return 'https://github.com/mozilla/geckodriver/releases';
  }

  async createService() {
    this.service = new firefox.ServiceBuilder(this.settings.server_path);

    if (Array.isArray(this.cliArgs)) {
      this.service.addArguments(...this.cliArgs);
    }

    this.service.enableVerboseLogging(true);

    return super.createService();
  }
}

module.exports = GeckoDriver;
