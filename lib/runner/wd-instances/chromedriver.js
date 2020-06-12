const BaseWDServer = require('./base-wd-server.js');

class ChromeDriver extends BaseWDServer {
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
    return 9515;
  }

  get serviceDownloadUrl() {
    return 'https://sites.google.com/a/chromium.org/chromedriver/downloads';
  }

  get serviceName() {
    return ChromeDriver.serviceName;
  }

  setCliArgs() {
    this.cliArgs.push(`--port=${this.settings.port}`);

    super.setCliArgs();
  }
}

module.exports = ChromeDriver;
