const {Browser} = require('selenium-webdriver');
const SeleniumWebdriver = require('./');

module.exports = class ChromeDriver extends SeleniumWebdriver {
  get ServiceBuilder() {
    return require('./service-builders/chrome.js');
  }

  setBuilderOptions({driverService, builder, options}) {
    if (driverService) {
      const {service} = driverService;

      builder
        .forBrowser(Browser.CHROME)
        .setChromeService(service);
    } else {
      const serverUrl = this.getServerUrl();

      builder
        .usingServer(serverUrl)
        .withCapabilities(this.initialCapabilities);
    }

    return super.setBuilderOptions({builder, options});
  }
};

