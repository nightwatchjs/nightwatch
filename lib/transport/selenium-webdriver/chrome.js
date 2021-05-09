const chrome = require('selenium-webdriver/chrome');
const DefaultSeleniumDriver = require('./');

module.exports = class WebdriverProtocol extends DefaultSeleniumDriver {
  get ServiceBuilder() {
    return require('./drivers/chrome.js');
  }

  createOptions(settings, argv) {
    const {webdriver = {}} = settings;
    let {options} = webdriver;

    // either supply an existing chrome options object, or create a new one
    if (!(options instanceof chrome.Options)) {
      options = createChromeOptions(settings);
    }

    if (argv.headless) {
      options.headless();
    }

    return options;
  }

  setBuilderOptions({service, argv}) {
    const options = this.createOptions(this.settings, argv);

    this.builder
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(options);

    return this;
  }
};


/**
 * @param {object} settings
 * @return {chrome.Options}
 */
const createChromeOptions = function(settings) {
  const options = new chrome.Options();
  const {desiredCapabilities, webdriver} = settings;
  const chromeOptions = desiredCapabilities.chromeOptions || desiredCapabilities['goog:chromeOptions'] || {};
  if (chromeOptions.args && chromeOptions.args.length > 0) {
    options.addArguments(chromeOptions.args);
  }

  if (chromeOptions.extensions) {
    options.addExtensions(...chromeOptions.extensions);
  }

  if (chromeOptions.prefs) {
    options.setUserPreferences(options.prefs);
  }

  if (chromeOptions.perfLoggingPrefs) {
    options.setPerfLoggingPrefs(options.perfLoggingPrefs);
  }


  if (webdriver.chrome_binary || settings.chrome_binary) {
    options.setChromeBinaryPath(webdriver.chrome_binary || settings.chrome_binary);
  }

  if (webdriver.chrome_log_file || settings.chrome_log_file) {
    options.setChromeLogFile(webdriver.chrome_log_file || settings.chrome_log_file);
  }

  if (settings.windowSize) {
    options.windowSize(settings.windowSize);
  }

  return options;
};

