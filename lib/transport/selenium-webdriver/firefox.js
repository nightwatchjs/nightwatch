const firefox = require('selenium-webdriver/firefox');
const DefaultSeleniumDriver = require('./');


module.exports = class WebdriverProtocol extends DefaultSeleniumDriver {
  get ServiceBuilder() {
    return require('./drivers/firefox.js');
  }

  createOptions(settings, argv) {
    const {webdriver = {}} = settings;
    let {options} = webdriver;

    // either supply an existing firefox options object, or create a new one
    if (!(options instanceof firefox.Options)) {
      options = createFirefoxOptions(settings);
    }

    if (argv.headless) {
      options.headless();
    }

    return options;
  }

  setBuilderOptions({service, argv}) {
    const options = this.createOptions(this.settings, argv);

    this.builder
      .forBrowser('firefox')
      .setFirefoxService(service)
      .setFirefoxOptions(options);

    return this;
  }
};


/**
 * @param {object} settings
 * @return {firefox.Options}
 */
const createFirefoxOptions = function(settings) {
  const options = new firefox.Options();
  const {desiredCapabilities, webdriver} = settings;
  const {alwaysMatch = {}} = desiredCapabilities;
  const firefoxOptions = alwaysMatch['moz:firefoxOptions'] || desiredCapabilities['moz:firefoxOptions'] || {};
  if (firefoxOptions.args && firefoxOptions.args.length > 0) {
    options.addArguments(firefoxOptions.args);
  }

  if (firefoxOptions.extensions) {
    options.addExtensions(...firefoxOptions.extensions);
  }

  if (firefoxOptions.prefs) {
    Object.keys(firefoxOptions.prefs).forEach(key => {
      options.setPreference(key, firefoxOptions.prefs[key]);
    });
  }

  if (webdriver.firefox_binary || settings.firefox_binary) {
    options.setBinary(webdriver.firefox_binary || settings.firefox_binary);
  }

  if (webdriver.firefox_profile || settings.firefox_profile) {
    options.setProfile(webdriver.firefox_profile || settings.firefox_profile);
  }

  if (settings.windowSize) {
    options.windowSize(settings.windowSize);
  }

  return options;
};

