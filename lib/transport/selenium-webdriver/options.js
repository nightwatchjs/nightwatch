module.exports = class SeleniumOptions {
  static checkIfDefined(settings, OptionsClass) {
    const capabilities = settings.capabilities || settings.desiredCapabilities;

    if (capabilities instanceof OptionsClass) {
      return capabilities;
    }

    return null;
  }

  /**
   * @param {object|chrome.Options} settings
   * @return {chrome.Options}
   */
  static createChromeOptions(settings) {
    const {Options} = require('selenium-webdriver/chrome');
    let options = SeleniumOptions.checkIfDefined(settings, Options);

    if (options) {
      return options;
    }

    const {webdriver, desiredCapabilities} = settings;
    const caps = desiredCapabilities || settings.capabilities;
    options = new Options(caps);

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

  static createEdgeOptions(settings) {
    const {Options} = require('selenium-webdriver/edge');
    let options = SeleniumOptions.checkIfDefined(settings, Options);

    if (options) {
      return options;
    }

    const {webdriver, desiredCapabilities} = settings;
    const caps = desiredCapabilities || settings.capabilities;
    options = new Options(caps);

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
  static createFirefoxOptions(settings) {
    const {Options} = require('selenium-webdriver/firefox');
    let options = SeleniumOptions.checkIfDefined(settings, Options);

    if (options) {
      return options;
    }

    const {webdriver} = settings;
    const caps = settings.desiredCapabilities || settings.capabilities;
    options = new Options(caps);

    if (webdriver.firefox_binary || settings.firefox_binary) {
      options.setBinary(webdriver.firefox_binary || settings.firefox_binary);
    }

    if (webdriver.firefox_profile || settings.firefox_profile) {
      options.setProfile(webdriver.firefox_profile || settings.firefox_profile);
    }

    return options;
  }

  static createSafariOptions(settings) {
    const {Options} = require('selenium-webdriver/safari');
    let options = SeleniumOptions.checkIfDefined(settings, Options);

    if (options) {
      return options;
    }

    const caps = settings.desiredCapabilities || settings.capabilities;
    options = new Options(caps);

    return options;
  }
};