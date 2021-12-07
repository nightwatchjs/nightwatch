const {Browser} = require('selenium-webdriver');
const SeleniumWebdriver = require('./');

module.exports = class GeckoDriver extends SeleniumWebdriver {
  get ServiceBuilder() {
    return require('./service-builders/firefox.js');
  }

  setBuilderOptions({builder, options}) {
    if (this.driverService) {
      const {service} = this.driverService;

      builder
        .forBrowser(Browser.FIREFOX)
        .setFirefoxService(service);
    } else {
      const serverUrl = this.getServerUrl();

      builder
        .usingServer(serverUrl)
        .withCapabilities(this.initialCapabilities);
    }

    return super.setBuilderOptions({builder, options});
  }
};

