const firefox = require('selenium-webdriver/firefox');
const {Builder, Capabilities} = require('selenium-webdriver');
const DefaultSeleniumDriver = require('./');

module.exports = class WebdriverProtocol extends DefaultSeleniumDriver {
  get defaultBrowser() {
    return 'firefox';
  }

  get DriverService() {
    return require('./drivers/selenium.js');
  }

  constructor(nightwatchInstance) {
    super(nightwatchInstance, {isSelenium: true});
  }

  createDriver({service, argv}) {
    if (service && service.kill) {
      this.once('session:finished', () => {
        // Give the selenium server some time to close down its browser drivers
        setTimeout(function() {
          service.kill().catch(err => console.error(err)).then(() => {});
        }, 100);

      });
    }

    const driver = new Builder();
    builder.disableEnvironmentOverrides();

    const options = this.createOptions(argv);
    const capabilities = Capabilities.firefox();

    driver
      .usingServer('http://127.0.0.1:4444/wd/hub')
      .withCapabilities(capabilities)
      //.setFirefoxOptions(options);

    return driver.build();
  }

  createOptions(argv) {
    const {webdriver = {}} = this.settings;
    let {options} = webdriver;

    return options;
  }

  setBuilderOptions({service, argv}) {
    const options = this.createOptions(this.settings, argv);

    this.builder
      .forBrowser('firefox')
      .setFirefoxOptions(options);

    return this;
  }
};


