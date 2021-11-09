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

  async closeDriver() {}

  async sessionFinished(reason) {
    this.emit('session:finished', reason);

    if (this.driverService) {
      const {service} = this.driverService;
      if (service && service.kill) {
        // Give the selenium server some time to close down its browser drivers
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            service.kill()
              .catch(err => reject(err))
              .then(() => this.driverService.stop())
              .then(() => resolve());
          }, 100);
        });
      }
    }
  }

  setBuilderOptions({builder, options}) {
    const serverUrl = this.getServerUrl();

    builder
      .usingServer(serverUrl)
      .withCapabilities(this.initialCapabilities);

    return super.setBuilderOptions({builder, options});
  }
};


