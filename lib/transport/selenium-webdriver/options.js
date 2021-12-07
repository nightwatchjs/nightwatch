const {Capabilities, Browser} = require('selenium-webdriver');

module.exports = class SeleniumCapabilities {
  get initialCapabilities() {
    return this.__capabilities;
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
        // TODO: implement
        break;
    }

    this
      .updateWebdriverPath()
      .addHeadlessOption({options})
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

  updateWebdriverPath() {
    if (this.settings.webdriver.start_process && !this.settings.webdriver.server_path) {
      try {
        switch (this.initialCapabilities.getBrowserName()) {
          case Browser.CHROME:
            this.settings.webdriver.server_path = require('chromedriver').path;
            break;

          case Browser.FIREFOX:
            this.settings.webdriver.server_path = require('geckodriver').path;
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

  addHeadlessOption({options}) {
    if (this.argv.headless && (options instanceof Capabilities) && options.headless) {
      options.headless();
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