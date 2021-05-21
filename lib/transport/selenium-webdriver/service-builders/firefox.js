const firefox = require('selenium-webdriver/firefox');
const BaseDriver = require('./base-driver.js');

class FirefoxServiceBuilder extends BaseDriver {
  static get serviceName() {
    return 'GeckoDriver';
  }

  static get defaultPort() {
    return 4444;
  }

  get npmPackageName() {
    return 'geckodriver';
  }

  get outputFile() {
    return 'geckodriver.log';
  }

  get serviceName() {
    return FirefoxServiceBuilder.serviceName;
  }

  get serviceDownloadUrl() {
    return 'https://github.com/mozilla/geckodriver/releases';
  }

  async createService() {
    const {server_path} = this.settings.webdriver;
    this.service = new firefox.ServiceBuilder(server_path);

    if (Array.isArray(this.cliArgs)) {
      this.service.addArguments(...this.cliArgs);
    }

    this.service.enableVerboseLogging(true);

    return super.createService();
  }
}

module.exports = FirefoxServiceBuilder;
