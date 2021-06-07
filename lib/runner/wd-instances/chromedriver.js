const BaseWDServer = require('./base-wd-server.js');

class ChromeDriver extends BaseWDServer {
  static get DEFAULT_PORT() {
    return 9515;
  }

  static get supportsConcurrency() {
    return true;
  }

  static get serviceName() {
    return 'ChromeDriver';
  }

  get npmPackageName() {
    return 'chromedriver';
  }

  get outputFile() {
    return 'chromedriver.log';
  }

  get defaultPort() {
    return ChromeDriver.DEFAULT_PORT;
  }

  get serviceDownloadUrl() {
    return 'https://sites.google.com/a/chromium.org/chromedriver/downloads';
  }

  get serviceName() {
    return ChromeDriver.serviceName;
  }

  setPort() {
    this.cliArgs.push(`--port=${this.settings.port}`);
  }
}

module.exports = ChromeDriver;
