const {Browser} = require('selenium-webdriver');
const SeleniumWebdriver = require('./');

module.exports = class GeckoDriver extends SeleniumWebdriver {
  get ServiceBuilder() {
    return require('./service-builders/firefox.js');
  }

  setBuilderOptions({driverService, builder, options}) {
    if (driverService) {
      const {service} = driverService;

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

