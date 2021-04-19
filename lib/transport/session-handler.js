const EventEmitter = require('events');
const {isObject} = require('../utils');
const HttpRequest = require('../http/request.js');

module.exports = class SessionHandler extends EventEmitter {
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
        err.message += '. If the Webdriver/Selenium service is managed by Nightwatch, check if "start_process" is set to "true".';
      }
    }

    return err;
  }

  get desiredCapabilities() {
    return this.nightwatchInstance.session.desiredCapabilities;
  }

  get settings() {
    return this.nightwatchInstance.settings;
  }

  get transport() {
    return this.nightwatchInstance.transport;
  }

  get session() {
    return this.transport.session;
  }

  constructor(nightwatchInstance) {
    super();

    this.nightwatchInstance = nightwatchInstance;
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

  createRequest() {
    const body = {};
    if (this.settings.capabilities) {
      body.capabilities = this.settings.capabilities;
    }

    if (this.desiredCapabilities) {
      body.desiredCapabilities = this.desiredCapabilities;
    }

    return this.transport.createHttpRequest({
      path : '/session',
      data : body
    });
  }

  sendRequest() {
    const request = this.createRequest();

    request
      .on('error', err => this.handleCreateError(err))
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
    request.setOptions({
      path   : urlParts.pathname,
      host   : urlParts.hostname,
      port   : urlParts.port
    }).send();

    return this;
  }
};
