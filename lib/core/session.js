const EventEmitter = require('events');
const lodashMerge = require('lodash.merge');
const CommandQueue = require('./queue.js');
const {BrowserName, Logger, isObject} = require('../utils');

class Session extends EventEmitter {
  constructor(nightwatchInstance) {
    super();

    this.nightwatchInstance = nightwatchInstance;
    this.sessionId = 0;

    this.__protocol = nightwatchInstance.transport;

    this.setCapabilities();
    this.createCommandQueue();
  }

  get settings() {
    return this.nightwatchInstance.settings;
  }

  get commandQueue() {
    return this.__commandQueue;
  }

  get transport() {
    return this.__protocol;
  }

  get startSessionEnabled() {
    return this.settings.start_session;
  }

  get endSessionOnFail() {
    return this.settings.end_session_on_fail;
  }

  get outputEnabled() {
    return this.settings.output;
  }

  getSessionId() {
    return this.__sessionId;
  }

  set sessionId(val) {
    this.__sessionId = val;
  }

  createCommandQueue() {
    this.__commandQueue = new CommandQueue();
  }

  finished(reason) {
    this.clearSession();
    this.emit('session:finished', reason);

    return this;
  }

  clearSession() {
    this.sessionId = null;
    this.capabilities = {};
  }

  setChromeOptions() {
    const {chromeOptions = {}} = this.desiredCapabilities;
    this.desiredCapabilities['goog:chromeOptions'] = this.desiredCapabilities['goog:chromeOptions'] || chromeOptions;

    if (this.desiredCapabilities.chromeOptions) {
      delete this.desiredCapabilities.chromeOptions;
    }

    return this;
  }

  setEdgeOptions() {
    const {edgeOptions = {}} = this.desiredCapabilities;
    this.desiredCapabilities['ms:edgeOptions'] = this.desiredCapabilities['ms:edgeOptions'] || edgeOptions;

    if (this.desiredCapabilities.edgeOptions) {
      delete this.desiredCapabilities.edgeOptions;
    }

    return this;
  }

  setFirefoxOptions() {
    const {firefoxOptions = {}} = this.desiredCapabilities;
    this.desiredCapabilities['moz:firefoxOptions'] = this.desiredCapabilities['moz:firefoxOptions'] || firefoxOptions;

    return this;
  }

  setHeadlessMode(argv) {
    if (!argv.headless) {
      return;
    }

    let mergeCapabilities = true;
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
        opts = this.desiredCapabilities['goog:chromeOptions'];
        arg = '--headless';
        break;

      case BrowserName.EDGE:
        opts = this.desiredCapabilities['ms:edgeOptions'];
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

    if (mergeCapabilities) {
      lodashMerge(this.settings.capabilities, this.desiredCapabilities);
    }

  }

  useW3CWebdriverProtocol() {
    const {browserName, 'goog:chromeOptions': chromeOptions = {}, 'ms:edgeOptions': edgeOptions = {}} = this.desiredCapabilities;

    if (browserName === BrowserName.CHROME || browserName === BrowserName.EDGE) {
      return chromeOptions.w3c || edgeOptions.w3c || false;
    }

    return false;
  }

  setCapabilities() {
    this.desiredCapabilities = Object.assign({}, this.settings.desiredCapabilities);

    const {browserName} = this.desiredCapabilities;

    switch (browserName) {
      case BrowserName.FIREFOX:
        this.setFirefoxOptions();
        break;

      case BrowserName.CHROME:
        this.setChromeOptions();
        break;

      case BrowserName.EDGE:
        this.setEdgeOptions();
        break;
    }

    if (this.useW3CWebdriverProtocol()) {
      this.settings.capabilities = this.settings.capabilities || {};
      lodashMerge(this.settings.capabilities, this.desiredCapabilities);
    }

    const {argv} = this.nightwatchInstance;
    this.setHeadlessMode(argv);
  }

  cleanUpBrowserOptions() {
    const {
      'moz:firefoxOptions': firefoxOptions,
      'goog:chromeOptions': chromeOptions,
      'ms:edgeOptions': edgeOptions
    } = this.desiredCapabilities;

    if (firefoxOptions && Object.keys(firefoxOptions).length === 0) {
      delete this.desiredCapabilities['moz:firefoxOptions'];
    }

    if (chromeOptions && Object.keys(chromeOptions).length === 0) {
      delete this.desiredCapabilities['goog:chromeOptions'];
    }

    if (edgeOptions && Object.keys(edgeOptions).length === 0) {
      delete this.desiredCapabilities['ms:edgeOptions'];
    }
  }

  /**
   *
   * @return {Promise}
   */
  create(argv = null) {
    const startTime = new Date();
    const {host, port} = this.settings.webdriver;
    const {colors} = Logger;

    if (isObject(argv)) {
      this.setHeadlessMode(argv);
    }

    this.cleanUpBrowserOptions();

    if (this.settings.start_session && this.outputEnabled) {
      const ora = require('ora');
      this.connectSpinner = ora(colors.cyan(`Connecting to ${host} on port ${port}...\n`)).start();
    }

    return new Promise((resolve, reject) => {
      this.transport.once('transport:session.error', (err) => {
        if (this.connectSpinner && this.outputEnabled) {
          this.connectSpinner.warn(colors.red(`Error connecting to ${host} on port ${port}.`));
        }

        reject(err);
      }).once('transport:session.create', (data, req, res) => {
        if (this.connectSpinner && this.outputEnabled) {
          this.connectSpinner.info(`Connected to ${colors.stack_trace(host)} on port ${colors.stack_trace(port)} ${colors.stack_trace('(' + (new Date() - startTime) + 'ms)')}.`);
          const {platform, platformName, platformVersion, browserName, version, browserVersion} = data.capabilities;
          // eslint-disable-next-line no-console
          console.info(`  Using: ${colors.light_blue(browserName)} ${colors.brown('(' + (version || browserVersion) + ')')} on ${colors.cyan((platform || platformName) + (platformVersion ? (' ' + platformVersion) : ''))} platform.\n`);
        }
        this.sessionId = data.sessionId;
        this.capabilities = data.capabilities;

        resolve(data);
      }).createSession();
    });
  }

  close(reason) {
    if (!this.startSessionEnabled) {
      return Promise.resolve();
    }

    return this.transport.closeSession()
      .then(data => {
        this.finished(reason);

        return data;
      });
  }
}

module.exports = Session;

