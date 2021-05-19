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

  get defaultPort() {
    return 4444;
  }

  get serviceName() {
    return GeckoDriver.serviceName;
  }

  get serviceDownloadUrl() {
    return 'https://github.com/mozilla/geckodriver/releases';
  }

  createService() {
    this.service = new firefox.ServiceBuilder(this.settings.server_path);

    if (Array.isArray(this.cliArgs)) {
      this.service.addArguments(...this.cliArgs);
    }

    this.service.enableVerboseLogging(true);

    super.createService();
  }
}

module.exports = GeckoDriver;
