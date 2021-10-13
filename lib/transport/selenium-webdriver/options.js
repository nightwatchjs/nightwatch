module.exports = class SeleniumOptions {
  static checkIfDefined(desiredCapabilities, OptionsClass) {
    if (desiredCapabilities instanceof OptionsClass) {
      return desiredCapabilities;
    }

    return null;
  }

  static getDesired(settings) {
    let capabilities = settings.capabilities || settings.desiredCapabilities;

    if (typeof capabilities == 'function') {
      capabilities = capabilities.call(settings);
    }

    return capabilities;
  }

  /**
   * @param {object|chrome.Options} settings
   * @param {object|Capabilities} desiredCapabilities
   * @return {chrome.Options}
   */
  static createChromeOptions(settings, desiredCapabilities) {
    const {Options} = require('selenium-webdriver/chrome');
    let options = SeleniumOptions.checkIfDefined(desiredCapabilities, Options);

    if (options) {
      return options;
    }

    const {webdriver} = settings;
    options = new Options(desiredCapabilities);

    if (webdriver.chrome_binary || settings.chrome_binary) {
      options.setChromeBinaryPath(webdriver.chrome_binary || settings.chrome_binary);
    }

    if (webdriver.chrome_log_file || settings.chrome_log_file) {
      options.setChromeLogFile(webdriver.chrome_log_file || settings.chrome_log_file);
    }

    if (webdriver.android_chrome) {
      options.androidChrome();
    }

    return options;
  }

  static createEdgeOptions(settings, desiredCapabilities) {
    const {Options} = require('selenium-webdriver/edge');
    let options = SeleniumOptions.checkIfDefined(desiredCapabilities, Options);

    if (options) {
      return options;
    }

    const {webdriver} = settings;
    options = new Options(desiredCapabilities);

    if (webdriver.edge_binary || settings.edge_binary) {
      options.setEdgeChromiumBinaryPath(webdriver.edge_binary || settings.edge_binary);
    }

    if (webdriver.edge_log_file || settings.edge_log_file) {
      options.setBrowserLogFile(webdriver.edge_log_file || settings.edge_log_file);
    }

    if (webdriver.android_package) {
      options.androidPackage(webdriver.android_package);
    }

    return options;
  }

  /**
   * @param {object} settings
   * @return {firefox.Options}
   */
  static createFirefoxOptions(settings, desiredCapabilities) {
    const {Options} = require('selenium-webdriver/firefox');
    let options = SeleniumOptions.checkIfDefined(desiredCapabilities, Options);

    if (options) {
      return options;
    }

    const {webdriver} = settings;
    options = new Options(desiredCapabilities);

    if (webdriver.firefox_binary || settings.firefox_binary) {
      options.setBinary(webdriver.firefox_binary || settings.firefox_binary);
    }

    if (webdriver.firefox_profile || settings.firefox_profile) {
      options.setProfile(webdriver.firefox_profile || settings.firefox_profile);
    }

    return options;
  }

  static createSafariOptions(settings, desiredCapabilities) {
    const {Options} = require('selenium-webdriver/safari');
    let options = SeleniumOptions.checkIfDefined(desiredCapabilities, Options);

    if (options) {
      return options;
    }

    options = new Options(desiredCapabilities);

    return options;
  }
};