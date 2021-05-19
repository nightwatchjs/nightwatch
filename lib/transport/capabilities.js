const lodashMerge = require('lodash.merge');
const {BrowserName} = require('../utils');

module.exports  = class Capabilities {
  get settings() {
    return this.nightwatchInstance.settings;
  }

  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
    this.init();
  }

  init() {
    this.desiredCapabilities = Object.assign({}, this.settings.desiredCapabilities);
  }

  setHeadlessMode(argv) {
    if (!argv.headless) {
      return;
    }

    let opts;
    let arg;

    const {browserName} = this.desiredCapabilities;

    switch (browserName) {
      case BrowserName.FIREFOX: {
        this.desiredCapabilities.alwaysMatch = this.desiredCapabilities.alwaysMatch || {};
        const {alwaysMatch} = this.desiredCapabilities;
        alwaysMatch['moz:firefoxOptions'] = alwaysMatch['moz:firefoxOptions'] || {};

        opts = alwaysMatch['moz:firefoxOptions'];
        arg = '-headless';
      }
        break;

      case BrowserName.CHROME:
        opts = this.desiredCapabilities.chromeOptions = this.desiredCapabilities.chromeOptions || {};
        arg = '--headless';
        break;

      default:
        return;
    }

    if (!Array.isArray(opts.args)) {
      opts.args = [arg];
    } else if (!opts.args.includes(arg)) {
      opts.args.push(arg);
    }

    this.update(this.settings);
  }

  update(settings) {
    lodashMerge(settings.capabilities, this.desiredCapabilities);
    lodashMerge(settings.desiredCapabilities, this.desiredCapabilities);
  }

  useW3CWebdriverProtocol() {
    const {browserName} = this.desiredCapabilities;

    if (browserName === BrowserName.CHROME) {
      const {chromeOptions = {}} = this.desiredCapabilities;

      return chromeOptions.w3c || false;
    }

    return false;
  }
};
