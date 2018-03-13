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

  get errorMessages() {
    return {
      binaryMissing: `The path to the ${this.serviceName} binary is not set. ` +
      'Please download GeckoDriver from https://github.com/mozilla/geckodriver/releases, extract the archive and set ' +
      '"webdriver.server_path" config option to point to the binary file.'
    };
  }
}

module.exports = GeckoDriver;