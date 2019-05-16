const EventEmitter = require('events');
const BrowserName = require('../util/browsername.js');
const HttpRequest = require('../http/request.js');
const Actions = require('./actions.js');
const Utils = require('../util/utils.js');

class Transport extends EventEmitter {
  static get WEB_ELEMENT_ID () {
    return 'element-6066-11e4-a52e-4f735466cecf';
  }

  static get DO_NOT_LOG_ERRORS() {
    return [
      'Unable to locate element',
      '{"errorMessage":"Unable to find element',
      'no such element'
    ];
  }

  constructor(nightwatchInstance) {
    super();

    this.nightwatchInstance = nightwatchInstance;
    this.actionsInstance = new Actions(this);
    this.actionsInstance.loadActions(this.MethodMappings);
  }

  get Actions() {
    return this.actionsInstance.actions;
  }

  get MethodMappings() {
    return require('./jsonwire/actions.js');
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get settings() {
    return this.nightwatchInstance.settings;
  }

  get desiredCapabilities() {
    return this.nightwatchInstance.session.desiredCapabilities;
  }

  get defaultPathPrefix() {
    return '';
  }

  get defaultPort() {
    return 4444;
  }

  get Errors() {
    return {
      StatusCode: {},
      findErrorById: function() {}
    };
  }

  formatCommandResponseData() {}
  isResultSuccess() {}

  ////////////////////////////////////////////////////////////////////
  // Session related
  ////////////////////////////////////////////////////////////////////
  parseSessionResponse(data = {}) {
    const sessionData = data.value || {};

    return {
      sessionId: sessionData.sessionId,
      capabilities: sessionData.capabilities || {}
    };
  }

  getErrorMessage(result) {
    return result.value.message;
  }

  staleElementReference(result) {
    return [result.error, result.errorStatus].includes(this.Errors.StatusCode.STALE_ELEMENT_REFERENCE);
  }

  invalidWindowReference(result) {
    return [result.error, result.errorStatus].includes(this.Errors.StatusCode.NO_SUCH_WINDOW);
  }

  invalidSessionError(result) {
    return result.errorStatus === this.Errors.StatusCode.NO_SUCH_SESSION;
  }

  handleSessionCreateError(data = null) {
    let err = new Error('An error occurred while retrieving a new session');
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

    } else if (Utils.isObject(data) && Object.keys(data).length > 0) {
      err.data = JSON.stringify(data.value || data);

      // legacy errors
      if (data.value.message) {
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

    this.emit('transport:session.error', err);

    return this;
  }

  createSession() {
    const body = {};
    if (this.settings.capabilities) {
      body.capabilities = this.settings.capabilities;
    }

    if (this.desiredCapabilities) {
      body.desiredCapabilities = this.desiredCapabilities;
    }

    const request = this.createHttpRequest({
      path : '/session',
      data : body
    });

    request
      .on('error', err => this.handleSessionCreateError(err))
      .on('success', (data, response, isRedirect) => {
        const sessionData = this.parseSessionResponse(data);

        if (sessionData.sessionId) {
          this.emit('transport:session.create', sessionData, request, response);
        } else if (isRedirect) {
          this.followRedirect(request, response);
        } else {
          this.handleSessionCreateError(data);
        }
      })
      .post();

    return this;
  }

  closeSession() {
    return new Promise((resolve, reject) => {
      this.api.end(result => {
        resolve(result);
      });
    });
  }

  createHttpRequest(requestOptions) {
    const request = new HttpRequest(requestOptions);
    request.on('response', this.formatCommandResponseData.bind(this));

    return request;
  }

  sendProtocolAction(request, promiseFn) {
    return new Promise((resolve, reject) => {
      promiseFn.call(this, resolve, reject);
      request.send();
    });
  }

  ////////////////////////////////////////////////////////////////////
  // Element locating
  ////////////////////////////////////////////////////////////////////
  getElementId(value) {
    return value;
  }

  mapWebElementIds(result) {
    if (Array.isArray(result.value)) {
      result.value = result.value.reduce((prev, item) => {
        prev.push(this.getElementId(item));

        return prev;
      }, []);
    }

    return result;
  }

  getElementNotFoundResult(result) {
    result.status = -1;
    result.value = [];

    let errorId = this.Errors.StatusCode && this.Errors.StatusCode.NO_SUCH_ELEMENT;
    let errorInfo = this.Errors.findErrorById(errorId);

    if (errorInfo) {
      result.message = errorInfo.message;
      result.errorStatus = errorInfo.status;
    }

    return result;
  }

  /**
   * Helper method
   *
   * @param {String} protocolAction
   * @param {Object} args
   * @return {Promise}
   */
  executeProtocolAction(protocolAction, args) {
    return this.Actions.session[protocolAction]({
      args,
      sessionId: this.api.sessionId,
      sessionRequired: true
    });
  }

  shouldRegisterError(errorResult) {
    return Transport.shouldRegisterError(errorResult);
  }

  static shouldRegisterError(errorResult) {
    let errorMessage = typeof errorResult == 'string' ? errorResult : (errorResult.error || errorResult.message);

    return !Transport.DO_NOT_LOG_ERRORS.some(function(item) {
      return errorMessage.indexOf(item) === 0;
    });
  }

  static adaptWebdriverSettings(settings, usingSeleniumServer = false) {
    const browserName = settings.desiredCapabilities.browserName.toLowerCase();

    if (usingSeleniumServer && [BrowserName.CHROME, BrowserName.EDGE].includes(browserName)) {
      settings.selenium.version2 = true;

      return;
    }

    switch (browserName) {
      case BrowserName.SAFARI:
        if (settings.webdriver.start_process && settings.webdriver.use_legacy_jsonwire === undefined) {
          const SafariDriver = require('../runner/wd-instances/safaridriver.js');
          settings.webdriver.use_legacy_jsonwire = SafariDriver.useLegacyDriver;
        }
        break;

      case BrowserName.FIREFOX:
        settings.webdriver.use_legacy_jsonwire = false;
        break;
    }

    if (settings.webdriver.use_legacy_jsonwire === undefined) {
      settings.webdriver.use_legacy_jsonwire = true;
    }

    if (!settings.webdriver.use_legacy_jsonwire && !usingSeleniumServer) {
      settings.capabilities = Object.assign({}, settings.desiredCapabilities);
    }
  }

  static create(nightwatchInstance) {
    const settings = nightwatchInstance.settings;
    const usingSeleniumServer = settings.selenium && (
      settings.selenium.start_process ||
      !settings.webdriver.start_process && (settings.selenium_host || settings.selenium.host || settings.seleniumHost)
    );

    Transport.adaptWebdriverSettings(settings, usingSeleniumServer);

    // Legacy Selenium Server 2
    if (usingSeleniumServer && settings.selenium.version2) {
      const Selenium2 = require('./selenium2.js');

      return new Selenium2(nightwatchInstance);
    }

    // Selenium Server 3
    if (usingSeleniumServer) {
      const SeleniumProtocol = require('./selenium3.js');

      return new SeleniumProtocol(nightwatchInstance);
    }

    // drivers using the legacy JSONWire protocol
    if (settings.webdriver.use_legacy_jsonwire) {
      const JsonWireProtocol = require('./jsonwire.js');

      return new JsonWireProtocol(nightwatchInstance);
    }

    const WebdriverProtocol = require('./webdriver.js');

    return new WebdriverProtocol(nightwatchInstance);
  }
}

module.exports = Transport;
