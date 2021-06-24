module.exports = class Options {
  static checkIfAlreadyDefined(settings, instance) {
    const {webdriver = {}} = settings;
    let {options} = webdriver;

    if (options instanceof instance) {
      return options;
    }

    return null;
  }

  /**
   * @param {object|chrome.Options} settings
   * @return {chrome.Options}
   */
  static createChromeOptions(settings) {
    const chrome = require('selenium-webdriver/chrome');
    let options = Options.checkIfAlreadyDefined(settings, chrome.Options);

    if (options) {
      return options;
    }

    const {webdriver, desiredCapabilities} = settings;
    const caps = desiredCapabilities || settings.capabilities;
    options = new chrome.Options(caps);

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
    const edge = require('selenium-webdriver/edge');
    let options = Options.checkIfAlreadyDefined(settings, edge.Options);

    if (options) {
      return options;
    }

    const {webdriver, desiredCapabilities} = settings;
    const caps = desiredCapabilities || settings.capabilities;
    options = new edge.Options(caps);

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
    const firefox = require('selenium-webdriver/firefox');
    let options = Options.checkIfAlreadyDefined(settings, firefox.Options);

    if (options) {
      return options;
    }

    const {webdriver} = settings;
    const caps = settings.desiredCapabilities || settings.capabilities;
    options = new firefox.Options(caps);

    // const {alwaysMatch = {}} = desiredCapabilities;
    // const firefoxOptions = alwaysMatch['moz:firefoxOptions'] || desiredCapabilities['moz:firefoxOptions'] || {};
    //
    // if (firefoxOptions.args && firefoxOptions.args.length > 0) {
    //   options.addArguments(firefoxOptions.args);
    // }
    //
    // if (firefoxOptions.extensions) {
    //   options.addExtensions(...firefoxOptions.extensions);
    // }
    //
    // if (firefoxOptions.prefs) {
    //   Object.keys(firefoxOptions.prefs).forEach(key => {
    //     options.setPreference(key, firefoxOptions.prefs[key]);
    //   });
    // }

    if (webdriver.firefox_binary || settings.firefox_binary) {
      options.setBinary(webdriver.firefox_binary || settings.firefox_binary);
    }

    if (webdriver.firefox_profile || settings.firefox_profile) {
      options.setProfile(webdriver.firefox_profile || settings.firefox_profile);
    }

    return options;
  }

  static createSafariOptions(settings) {
    const safari = require('selenium-webdriver/safari');
    let options = Options.checkIfAlreadyDefined(settings, safari.Options);

    if (options) {
      return options;
    }

    const caps = settings.desiredCapabilities || settings.capabilities;
    options = new safari.Options(caps);

    return options;
  }
};