const BaseWDServer = require('./base-wd-server.js');

class GeckoDriver extends BaseWDServer {
  static get serviceName() {
    return 'GeckoDriver';
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
}

module.exports = GeckoDriver;