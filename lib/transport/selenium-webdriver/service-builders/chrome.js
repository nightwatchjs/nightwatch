const chrome = require('selenium-webdriver/chrome');
const BaseDriver = require('./base-driver.js');

class ChromeServiceBuilder extends BaseDriver {
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
    return 'chromedriver.log';
  }

  get serviceName() {
    return ChromeServiceBuilder.serviceName;
  }

  get serviceDownloadUrl() {
    return 'https://sites.google.com/chromium.org/driver/downloads';
  }

  async createService() {
    const {server_path} = this.settings.webdriver;
    this.service = new chrome.ServiceBuilder(server_path);

    if (Array.isArray(this.cliArgs)) {
      this.service.addArguments(...this.cliArgs);
    }

    this.service.enableVerboseLogging();

    return super.createService();
  }
}

module.exports = ChromeServiceBuilder;
