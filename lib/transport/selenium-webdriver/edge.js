const {Browser} = require('selenium-webdriver');
const SeleniumWebdriver = require('./');

module.exports = class ChromeDriver extends SeleniumWebdriver {
  get ServiceBuilder() {
    return require('./service-builders/edge.js');
  }

  setBuilderOptions({driverService, builder, options}) {
    if (driverService) {
      const {service} = driverService;

      builder
        .forBrowser(Browser.EDGE)
        .setEdgeService(service);
    } else {
      const serverUrl = this.getServerUrl();

      builder
        .usingServer(serverUrl)
        .withCapabilities(this.capabilities);
    }

    return super.setBuilderOptions({builder, options});
  }
};

