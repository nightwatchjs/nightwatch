const DefaultSeleniumDriver = require('./');
const SeleniumServiceBuilder = require('./service-builders/selenium.js');

module.exports = class SeleniumServer extends DefaultSeleniumDriver {
  /**
   * Used when running in parallel with start_process=true
   */
  static createService(settings) {
    const Options = require('./options.js');
    const opts = new Options({settings});
    opts.updateWebdriverPath();

    const seleniumService = new SeleniumServiceBuilder(settings);

    const outputFile = settings.webdriver.log_file_name || '';
    seleniumService.setOutputFile(outputFile);

    return seleniumService;
  }

  get defaultBrowser() {
    return 'firefox';
  }

  get ServiceBuilder() {
    return SeleniumServiceBuilder;
  }

  get defaultServerUrl() {
    return 'http://127.0.0.1:4444';
  }

  get defaultPathPrefix() {
    return '/wd/hub';
  }

  constructor(nightwatchInstance, browserName) {
    if (nightwatchInstance.settings.selenium && nightwatchInstance.settings.selenium['[_started]']) {
      nightwatchInstance.settings.selenium.start_process = false;
      nightwatchInstance.settings.webdriver.start_process = false;
    }

    super(nightwatchInstance, {isSelenium: true, browserName});
  }

  async closeDriver() {}

  async sessionFinished(reason) {
    this.emit('session:finished', reason);

    // TODO: refactor this, selenium server management has moved to runner/cli
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


