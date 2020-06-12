const BaseWDServer = require('./base-wd-server.js');

class GeckoDriver extends BaseWDServer {
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

  setCliArgs() {
    this.cliArgs.push('--port', this.settings.port);

    super.setCliArgs();
  }
}

module.exports = GeckoDriver;
