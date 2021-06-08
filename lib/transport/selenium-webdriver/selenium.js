const DefaultSeleniumDriver = require('./');

module.exports = class WebdriverProtocol extends DefaultSeleniumDriver {
  get defaultBrowser() {
    return 'firefox';
  }

  get ServiceBuilder() {
    return require('./service-builders/selenium.js');
  }

  get defaultServerUrl() {
    return 'http://127.0.0.1:4444';
  }

  get defaultPathPrefix() {
    return '/wd/hub';
  }

  constructor(nightwatchInstance, browserName) {
    super(nightwatchInstance, {isSelenium: true, browserName});
  }

  setBuilderOptions({builder, driverService, options}) {
    if (driverService) {
      const {service} = driverService;
      if (service && service.kill) {
        this.once('session:finished', () => {
          // Give the selenium server some time to close down its browser drivers
          setTimeout(function() {
            service.kill().catch(err => console.error(err)).then(() => {});
          }, 100);
        });
      }
    }

    const serverUrl = this.getServerUrl();

    builder
      .usingServer(serverUrl)
      .withCapabilities(this.capabilities);

    return super.setBuilderOptions({builder, options});
  }
};


