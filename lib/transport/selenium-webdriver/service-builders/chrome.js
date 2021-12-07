const chrome = require('selenium-webdriver/chrome');
const BaseService = require('./base-service.js');

class ChromeServiceBuilder extends BaseService {
  static get serviceName() {
    return 'ChromeDriver';
  }

  static get defaultPort() {
    return 9515;
  }

  get npmPackageName() {
    return 'chromedriver';
  }

  get outputFile() {
    return this._outputFile + '_chromedriver.log';
  }

  get serviceName() {
    return ChromeServiceBuilder.serviceName;
  }

  get serviceDownloadUrl() {
    return 'https://sites.google.com/chromium.org/driver/downloads';
  }

  /**
   * @param {Capabilities} options
   * @returns {Promise<void>}
   */
  async createService(options) {
    const {server_path} = this.settings.webdriver;
    this.service = new chrome.ServiceBuilder(server_path);

    if (Array.isArray(this.cliArgs)) {
      this.service.addArguments(...this.cliArgs);
    }

    this.service.enableChromeLogging().enableVerboseLogging();

    return super.createService();
  }
}

module.exports = ChromeServiceBuilder;
