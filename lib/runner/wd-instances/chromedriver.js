const WebDriver = require('./webdriver.js');

class ChromeDriver extends WebDriver {
  get outputFile() {
    return 'chromedriver.log';
  }

  get defaultPort() {
    return 9515;
  }

  get serviceName() {
    return 'ChromeDriver';
  }
}

module.exports = ChromeDriver;