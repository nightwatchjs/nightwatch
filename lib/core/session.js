const EventEmitter = require('events');
const lodashMerge = require('lodash.merge');
const CommandQueue = require('./queue.js');
const {BrowserName, Logger} = require('../utils');

class Session extends EventEmitter {
  static get DEFAULT_CAPABILITIES() {
    return {
      browserName: BrowserName.FIREFOX,
      platform: 'ANY'
    };
  }

  constructor(nightwatchInstance) {
    super();

    this.settings = nightwatchInstance.settings;
    this.sessionId = 0;

    this.__protocol = nightwatchInstance.transport;

    this.setDesiredCapabilities();
    this.createCommandQueue();
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

  setDesiredCapabilities() {
    this.desiredCapabilities = Object.assign({}, Session.DEFAULT_CAPABILITIES);

    Object.assign(this.desiredCapabilities, this.settings.desiredCapabilities);

    return this;
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

  setHeadlessMode() {
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

    if (Array.isArray(opts.args)) {
      opts.args.push(arg);
    } else {
      opts.args = [arg];
    }

    lodashMerge(this.settings.capabilities, this.desiredCapabilities);
  }

  /**
   *
   * @return {Promise}
   */
  create(argv = {}) {
    const startTime = new Date();
    const {host, port} = this.settings.webdriver;
    const {colors} = Logger;

    if (this.settings.start_session && this.outputEnabled) {
      const ora = require('ora');
      this.connectSpinner = ora(colors.cyan(`Connecting to ${host} on port ${port}...\n`)).start();
    }

    // TODO: create separate capabilities component
    if (argv.headless) {
      this.setHeadlessMode();
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

