const ChromeDriver = require('./chromedriver.js');

class EdgeDriver extends ChromeDriver {
  static get DEFAULT_PORT() {
    return 9514;
  }

  get defaultPort() {
    return EdgeDriver.DEFAULT_PORT;
  }

  static get serviceName() {
    return 'EdgeDriver';
  }

  get npmPackageName() {
    return null;
  }

  get outputFile() {
    return 'edgedriver.log';
  }

  get serviceDownloadUrl() {
    return 'https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/';
  }

  get serviceName() {
    return EdgeDriver.serviceName;
  }
}

module.exports = EdgeDriver;
