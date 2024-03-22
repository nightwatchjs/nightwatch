const {Browser} = require('selenium-webdriver');
const SeleniumWebdriver = require('./');

module.exports = class ChromeDriver extends SeleniumWebdriver {
  get ServiceBuilder() {
    return require('./service-builders/edge.js');
  }

  setBuilderOptions({builder, options}) {
    if (this.driverService) {
      const {service} = this.driverService;

      builder
        .forBrowser(Browser.EDGE)
        .setEdgeService(service);
    } else {
      const serverUrl = this.getServerUrl();

      builder
        .usingServer(serverUrl)
        .withCapabilities(this.initialCapabilities);
    }

    return super.setBuilderOptions({builder, options});
  }
};

