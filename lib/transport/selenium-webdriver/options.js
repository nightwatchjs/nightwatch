const {Capabilities, Browser} = require('selenium-webdriver');
const Utils = require('../../utils');

module.exports = class SeleniumCapabilities {
  get initialCapabilities() {
    return this.__capabilities;
  }

  get isChrome() {
    return this.initialCapabilities.getBrowserName() === Browser.CHROME;
  }

  get isSafari() {
    return this.initialCapabilities.getBrowserName() === Browser.SAFARI;
  }

  get isEdge() {
    return this.initialCapabilities.getBrowserName() === Browser.EDGE;
  }

  get isFirefox() {
    return this.initialCapabilities.getBrowserName() === Browser.FIREFOX;
  }

  constructor({settings, browserName}) {
    this.settings = settings;

    this.createDesired();
    this.__capabilities = this.createInitialCapabilities();

    if (browserName) {
      this.initialCapabilities.setBrowserName(browserName);
    }
  }

  createDesired() {
    this.desiredCapabilities = this.settings.capabilities || this.settings.desiredCapabilities;

    if (typeof this.desiredCapabilities == 'function') {
      this.desiredCapabilities = this.desiredCapabilities.call(this.settings);
    }

    return this.desiredCapabilities;
  }

  /**
   * Create an initial capabilities instance based on either the capabilities or desiredCapabilities
   *  setting from the nightwatch config
   *
   * @returns {Capabilities}
   */
  createInitialCapabilities() {
    if (this.desiredCapabilities instanceof Capabilities) {
      return this.desiredCapabilities;
    }

    return new Capabilities(this.desiredCapabilities);
  }

  alreadyDefinedAs(OptionsClass) {
    return this.desiredCapabilities instanceof OptionsClass;
  }

  create(argv = {}) {
    this.argv = argv;
    let options;

    switch (this.initialCapabilities.getBrowserName()) {
      case Browser.CHROME:
        options = this.createChromeOptions();
        break;

      case Browser.FIREFOX:
        options = this.createFirefoxOptions();
        break;

      case Browser.SAFARI:
        options = this.createSafariOptions();
        break;

      case Browser.EDGE:
        options = this.createEdgeOptions();
        break;

      case Browser.OPERA:
        // TODO: implement
        break;

      case Browser.INTERNET_EXPLORER:
        options = this.createIeOptions();
        break;
    }

    this
      .updateWebdriverPath()
      .addHeadlessOption({options})
      .addDevtoolsOption({options})
      .addWindowSizeOption({options})
      .addProxyOption({options});

    return options;
  }

  /**
   * @return {chrome.Options}
   */
  createChromeOptions() {
    const {Options: ChromeOptions} = require('selenium-webdriver/chrome');

    if (this.alreadyDefinedAs(ChromeOptions)) {
      return this.desiredCapabilities;
    }

    // Backward compatibility for 'chromeOptions'
    if (Utils.isObject(this.desiredCapabilities.chromeOptions)) {
      this.desiredCapabilities['goog:chromeOptions'] = Object.assign(
        this.desiredCapabilities.chromeOptions,
        this.desiredCapabilities['goog:chromeOptions']
      );
    }

    const {webdriver} = this.settings;
    let options = new ChromeOptions(this.desiredCapabilities);

    if (webdriver.chrome_binary || this.settings.chrome_binary) {
      options.setChromeBinaryPath(webdriver.chrome_binary || this.settings.chrome_binary);
    }

    if (webdriver.chrome_log_file || this.settings.chrome_log_file) {
      options.setChromeLogFile(webdriver.chrome_log_file || this.settings.chrome_log_file);
    }

    if (webdriver.android_chrome) {
      options.androidChrome();
    }

    return options;
  }

  createIeOptions() {
    const {Options: IeOptions} = require('selenium-webdriver/ie');

    if (this.alreadyDefinedAs(IeOptions)){
      return this.desiredCapabilities;
    }

    const {webdriver} = this.settings;
    let options = new IeOptions(this.desiredCapabilities);

    if (webdriver.log_path || this.settings.log_path) {
      options.setLogFile(webdriver.log_path || this.settings.log_path);
    }

    if (webdriver.host || this.settings.host) {
      options.setHost(webdriver.host || this.settings.host);
    }

    return options;
  }

  createEdgeOptions() {
    const {Options: EdgeOptions} = require('selenium-webdriver/edge');

    if (this.alreadyDefinedAs(EdgeOptions)) {
      return this.desiredCapabilities;
    }

    const {webdriver} = this.settings;
    let options = new EdgeOptions(this.desiredCapabilities);

    if (webdriver.edge_binary || this.settings.edge_binary) {
      options.setEdgeChromiumBinaryPath(webdriver.edge_binary || this.settings.edge_binary);
    }

    if (webdriver.edge_log_file || this.settings.edge_log_file) {
      options.setBrowserLogFile(webdriver.edge_log_file || this.settings.edge_log_file);
    }

    if (webdriver.android_package) {
      options.androidPackage(webdriver.android_package);
    }

    return options;
  }

  /**
   * @return {firefox.Options}
   */
  createFirefoxOptions() {
    const {Options: FirefoxOptions} = require('selenium-webdriver/firefox');

    if (this.alreadyDefinedAs(FirefoxOptions)) {
      return this.desiredCapabilities;
    }

    const {webdriver} = this.settings;
    let options = new FirefoxOptions(this.desiredCapabilities);

    if (webdriver.firefox_binary || this.settings.firefox_binary) {
      options.setBinary(webdriver.firefox_binary || this.settings.firefox_binary);
    }

    if (webdriver.firefox_profile || this.settings.firefox_profile) {
      options.setProfile(webdriver.firefox_profile || this.settings.firefox_profile);
    }

    return options;
  }

  createSafariOptions() {
    const {Options: SafariOptions} = require('selenium-webdriver/safari');

    if (this.alreadyDefinedAs(SafariOptions)) {
      return this.desiredCapabilities;
    }

    let options = new SafariOptions(this.desiredCapabilities);

    return options;
  }

  usingSeleniumServer() {
    return this.settings.selenium && this.settings.selenium.start_process;
  }

  shouldSetupWebdriver() {
    return this.settings.webdriver.start_process && !this.settings.webdriver.server_path;
  }

  getChromedriverPath() {
    try {
      return require('chromedriver').path;
    } catch (err) {
      return '';
    }
  }

  getGeckodriverPath() {
    try {
      return require('geckodriver').path;
    } catch (err) {
      return '';
    }
  }

  getAppiumPath() {
    return require.resolve('appium');
  }

  updateWebdriverPath() {
    if (this.shouldSetupWebdriver()) {
      try {
        if (this.usingSeleniumServer()) {
          if (this.settings.selenium.use_appium) {
            this.settings.selenium.server_path = this.settings.webdriver.server_path = this.getAppiumPath();

            return this;
          }

          this.settings.selenium.server_path = this.settings.webdriver.server_path = require('@nightwatch/selenium-server').path;
          this.settings.selenium.cli_args = this.settings.selenium.cli_args || {};

          const chromeDriver = this.getChromedriverPath();
          if (chromeDriver) {
            this.settings.selenium.cli_args['webdriver.chrome.driver'] = chromeDriver;
          }

          const geckoDriver = this.getGeckodriverPath();
          if (geckoDriver) {
            this.settings.selenium.cli_args['webdriver.gecko.driver'] = geckoDriver;
          }

          return this;
        }

        switch (this.initialCapabilities.getBrowserName()) {
          case Browser.CHROME:
            this.settings.webdriver.server_path = this.getChromedriverPath();
            break;

          case Browser.FIREFOX:
            this.settings.webdriver.server_path = this.getGeckodriverPath();
            break;

          case Browser.SAFARI:
            this.settings.webdriver.server_path = '/usr/bin/safaridriver';
            break;
        }
      } catch (err) {
        this.settings.webdriver.server_path = '';
      }
    }

    return this;
  }

  hasDevtoolsFlag(options) {
    return this.argv.devtools && (options instanceof Capabilities);
  }

  addDevtoolsOption({options}) {
    if (!this.hasDevtoolsFlag(options)) {
      return this;
    }

    if (this.isChrome) {
      const {args = []} = options.get('goog:chromeOptions');
      const newArg = 'auto-open-devtools-for-tabs';

      if (!(args.includes(newArg) || args.includes(`--${newArg}`))) {
        options.addArguments(newArg);
      }
    } else if (this.isSafari) {
      options.map_.set('safari:automaticInspection', true);
    } else if (this.isEdge) {
      const {args = []} = options.get('ms:edgeOptions');
      const newArg = 'auto-open-devtools-for-tabs';

      if (!(args.includes(newArg) || args.includes(`--${newArg}`))) {
        options.addArguments(newArg);
      }
    } else if (this.isFirefox) {
      // TODO: implement when available in Firefox
    }

    return this;
  }

  addHeadlessOption({options}) {
    if (this.argv.headless && (options instanceof Capabilities) && (this.isChrome || options.headless)) {
      this.isChrome ? options.addArguments('headless=new') : options.headless();
    }

    return this;
  }

  addWindowSizeOption({options}) {
    if (this.settings.window_size && (options instanceof Capabilities) && options.windowSize) {
      options.windowSize(this.settings.window_size);
    }

    return this;
  }

  addProxyOption({options}) {
    if (this.initialCapabilities.getProxy() && (options instanceof Capabilities) && options.setProxy) {
      const proxy = require('selenium-webdriver/proxy');
      options.setProxy(proxy.manual(this.initialCapabilities.getProxy()));
    }
  }
};
