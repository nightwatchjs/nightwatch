const EventEmitter = require('events');
const lodashMerge = require('lodash.merge');
const Capabilities = require('./capabilities.js');
const {isObject, Logger} = require('../utils');

module.exports = class SessionHandler extends EventEmitter {
  get settings() {
    return this.nightwatchInstance.settings;
  }

  get transport() {
    return this.nightwatchInstance.transport;
  }

  get startSessionEnabled() {
    return this.settings.start_session;
  }

  get outputEnabled() {
    return this.settings.output;
  }

  constructor(nightwatchInstance) {
    super();

    this.nightwatchInstance = nightwatchInstance;
    this.capabilities = new Capabilities(nightwatchInstance);

    this.setCapabilities();
  }

  setCapabilities() {
    if (this.capabilities.useW3CWebdriverProtocol()) {
      this.settings.capabilities = this.settings.capabilities || {};
      lodashMerge(this.settings.capabilities, this.capabilities.desiredCapabilities);
    }
    const {argv = {}} = this.nightwatchInstance;
    this.capabilities.setHeadlessMode(argv);
  }

  /**
   * @param {String} reason
   */
  finished(reason) {
    this.clearSession();
    this.emit('session:finished', reason);

    return this;
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
      this.capabilities.setHeadlessMode(argv);
    }

    if (this.settings.start_session && this.outputEnabled) {
      const ora = require('ora');
      this.connectSpinner = ora(colors.cyan(`Connecting to ${host} on port ${port}...\n`)).start();
    }

    return new Promise((resolve, reject) => {
      this.once('session.error', (err) => {
        if (this.connectSpinner && this.outputEnabled) {
          this.connectSpinner.warn(colors.red(`Error connecting to ${host} on port ${port}.`));
        }

        reject(err);
      }).once('session.create', (data, req, res) => {
        if (this.connectSpinner && this.outputEnabled) {
          this.connectSpinner.info(
            `Connected to ${colors.stack_trace(host)} on port ${colors.stack_trace(port)} ${colors.stack_trace(
              '(' + (new Date() - startTime) + 'ms)'
            )}.`
          );
          const {platform, platformName, platformVersion, browserName, version, browserVersion} = data.capabilities;
          // eslint-disable-next-line no-console
          console.info(
            `  Using: ${colors.light_blue(browserName)} ${colors.brown(
              '(' + (version || browserVersion) + ')'
            )} on ${colors.cyan(
              (platform || platformName) + (platformVersion ? ' ' + platformVersion : '')
            )} platform.\n`
          );
        }

        resolve(data);
      });

      this.sendRequest();
    });
  }

  close(reason) {
    if (!this.startSessionEnabled) {
      return Promise.resolve();
    }

    return this.transport.closeSession(reason);
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Create session
  ///////////////////////////////////////////////////////////////////////////////
  /**
   * @return {Promise}
   */
  createRequest() {
    const body = {};
    if (this.settings.capabilities) {
      body.capabilities = this.settings.capabilities;
    }

    if (this.capabilities.desiredCapabilities) {
      body.desiredCapabilities = this.capabilities.desiredCapabilities;
    }

    return this.transport.createHttpRequest({
      path: '/session',
      data: body
    });
  }

  sendRequest() {
    const request = this.createRequest();

    request
      .on('error', (err) => this.handleCreateError(err))
      .on('success', (data, response, isRedirect) => {
        if (isRedirect) {
          this.followRedirect(request, response);
        } else {
          this.handleCreateSuccess(data, request, response);
        }
      })
      .post();

    return request;
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Request handling
  ///////////////////////////////////////////////////////////////////////////////
  handleCreateError(data) {
    const err = SessionHandler.createError(data);
    this.emit('session.error', err);
  }

  handleCreateSuccess(data, request, response) {
    const sessionData = this.parseResponse(data);

    if (sessionData.sessionId) {
      this.emit('session.create', sessionData, request, response);
    } else {
      this.handleCreateError(data);
    }
  }

  followRedirect(request, response) {
    if (!response.headers || !response.headers.location) {
      this.handleCreateError();

      return this;
    }

    const url = require('url');
    let urlParts = url.parse(response.headers.location);
    request
      .setOptions({
        path: urlParts.pathname,
        host: urlParts.hostname,
        port: urlParts.port
      })
      .send();

    return this;
  }

  parseResponse(data = {}) {
    const sessionData = data.value || {};

    if (sessionData.sessionId) {
      return {
        sessionId: sessionData.sessionId,
        capabilities: sessionData.capabilities || {}
      };
    }

    return {
      sessionId: data.sessionId,
      capabilities: sessionData
    };
  }

  static createError(data) {
    const err = new Error('An error occurred while retrieving a new session');
    let addtMsg = '';

    if (data instanceof Error) {
      switch (data.code) {
        case 'ECONNREFUSED':
          err.sessionConnectionRefused = true;
          err.incrementErrorsNo = true;
          addtMsg = `Connection refused to ${data.address}:${data.port}`;
          break;
        default:
          addtMsg = data.message;
      }
    } else if (isObject(data) && Object.keys(data).length > 0) {
      err.data = JSON.stringify(data.value || data);

      // legacy errors
      if (data.value && data.value.message) {
        addtMsg = data.value.message;
      }
    }

    if (addtMsg) {
      err.message = err.message + `: "${addtMsg}"`;
    }

    if (data.code) {
      err.code = data.code;
      if (err.sessionConnectionRefused) {
        err.message +=
          '. If the Webdriver/Selenium service is managed by Nightwatch, check if "start_process" is set to "true".';
      }
    }

    return err;
  }
};
