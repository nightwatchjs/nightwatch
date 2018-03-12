const WebDriver = require('./webdriver.js');

class GeckoDriver extends WebDriver {
  get outputFile() {
    return 'geckodriver.log';
  }

  get defaultPort() {
    return 4444;
  }

  get serviceName() {
    return 'GeckoDriver';
  }
}

module.exports = GeckoDriver;