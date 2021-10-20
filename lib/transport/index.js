const EventEmitter = require('events');
const HttpRequest = require('../http/request.js');
const Utils = require('../utils');
const Factory = require('./factory.js');
const {isErrorResponse, checkLegacyResponse, checkResponse, WebDriverError} = require('selenium-webdriver').error;

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


  static create(nightwatchInstance) {
    return Factory.create(nightwatchInstance);
  }

  get defaultPort() {
    return 4444;
  }

  get Errors() {
    return require('./webdriver/errors.js');
  }

  get serviceApiUrl() {
    return null;
  }

  get Actions() {
    return this.actionsInstance.actions;
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
    return this.settings.desiredCapabilities;
  }

  get defaultPathPrefix() {
    return '';
  }

  constructor(nightwatchInstance) {
    super();

    this.elementKey = Transport.WEB_ELEMENT_ID;
    this.nightwatchInstance = nightwatchInstance;
    this.init();
  }

  init() {
    this.createSessionHandler();
    this.createActions();
  }

  createActions() {}
  testSuiteFinished() {}
  formatCommandResponseData() {}

  ////////////////////////////////////////////////////////////////////
  // Session related
  ////////////////////////////////////////////////////////////////////
  createSessionHandler() {
  }

  createSession(argv = {}) {
  }

  sessionFinished(reason) {
    this.emit('session:finished', reason);
  }

  ////////////////////////////////////////////////////////////////////
  // Elements related
  ////////////////////////////////////////////////////////////////////
  getElementId(resultValue) {
    return resultValue[this.elementKey];
  }

  toElement(resultValue) {
    return {[this.elementKey]: resultValue};
  }

  ////////////////////////////////////////////////////////////////////
  // Transport related
  ////////////////////////////////////////////////////////////////////
  createHttpRequest(requestOptions) {
    const request = new HttpRequest(requestOptions);
    request.on('response', this.formatCommandResponseData.bind(this));

    return request;
  }

  runProtocolAction(requestOptions) {
    const request = new HttpRequest(requestOptions);

    return new Promise((resolve, reject) => {
      request
        .on('success', (result, response) => {
          if (result.error && result.status === -1) {
            const errorResult = this.handleProtocolError(result, response);

            return reject(errorResult);
          }

          resolve(result);
        })
        .on('error', (result, response, screenshotContent) => {
          const errorResult = this.handleProtocolError(result, response, screenshotContent);

          reject(errorResult);
        })
        .send();
    });
  }

  sendHttpRequest(options) {
    const request = new HttpRequest(options);

    return new Promise((resolve, reject) => {
      request
        .on('success', (result, response) => {
          resolve(result);
        })
        .on('error', (result, response) => {
          reject(result);
        })
        .send();
    });
  }

  handleErrorResponse(result) {
    if (isErrorResponse(result)) {
      // will throw error if w3c response
      checkResponse(result);

      // will throw error if legacy response
      checkLegacyResponse(result);
    }
  }

  handleProtocolError(result, response = {}) {
    result = result || {};

    const {status = '', value = null, error: errorResult, code = '', message = null} = result;
    const {statusCode = null} = response;
    let error;

    // node.js errors
    if (code && message) {
      error = `Error ${code}: ${message}`;
    } else {
      // default error message;
      error = response && response.statusCode === 404 ? 'Unknown command' : (errorResult || 'An unknown error has occurred.');
    }

    if (value && value.message) {
      error = value.message;
    } else if (value && value.error && this.Errors.Response[value.error]) {
      error = this.Errors.Response[value.error].message;
    }

    if (!error && errorResult) {
      error = errorResult;
    }

    return {
      status: -1,
      value,
      code,
      errorStatus: status,
      error,
      httpStatusCode: statusCode
    };
  }

  mapWebElementIds(value) {
    if (Array.isArray(value)) {
      return value.reduce((prev, item) => {
        prev.push(this.getElementId(item));

        return prev;
      }, []);
    }

    return value;
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
   * Converts a webElement object obtain using selenium-webdriver commands
   * @param {WebElement} webElement
   *
   * @return {Promise<{result: {}, sessionId: *, WebdriverElementId: *, value: *, status: number}>}
   */
  async convertWebElement(webElement) {
    const elementId = await webElement.getId();
    const session = await webElement.getDriver().getSession();
    const sessionId = session.getId();

    return {
      sessionId,
      WebdriverElementId: elementId,
      value: this.toElement(elementId),
      status: 0,
      result: {}
    };
  }

  /**
   * Helper method
   *
   * @param {String} protocolAction
   * @param {Object} executeArgs
   * @return {Promise}
   */
  executeProtocolAction(protocolAction, executeArgs) {
    if (Utils.isObject(protocolAction) && protocolAction.actionName) {
      const {actionName, args, sessionId = this.nightwatchInstance.sessionId} = protocolAction;

      return this.Actions.session[actionName]({
        args,
        sessionId,
        sessionRequired: true
      });
    }

    return this.Actions.session[protocolAction]({
      args: executeArgs,
      sessionId: this.nightwatchInstance.sessionId,
      sessionRequired: true
    });
  }

  ////////////////////////////////////////////////////////////////////
  // Error handling
  ////////////////////////////////////////////////////////////////////

  shouldRegisterError(result) {
    return Transport.shouldRegisterError(result);
  }

  registerLastError(err, retryCount = 0) {
    this.lastError = err;
    this.retriesCount = retryCount;
  }

  static shouldRegisterError(result) {
    let errorMessage = '';
    if (result.value && result.value.message) {
      errorMessage = result.value.message;
    } else {
      errorMessage = result.error || result.message;
    }

    const shouldIgnore = Transport.DO_NOT_LOG_ERRORS.some(function(item) {
      return errorMessage.startsWith(item);
    });

    return !shouldIgnore;
  }

  getErrorMessage(result) {
    return result.value.message;
  }

  getErrorResponse(result) {
    return result;
  }

  /**
   * Used when the error object is not parsed to its specific type (such as when using ChromeDriver with w3c:false)
   *
   */
  getRetryableErrorMessages() {
    const {StatusCode} = this.Errors;

    const filtered = Object.keys(StatusCode)
      .filter(key => [
        'STALE_ELEMENT_REFERENCE',
        'ELEMENT_CLICK_INTERCEPTED',
        'INVALID_ELEMENT_STATE',
        'ELEMENT_IS_NOT_INTERACTABLE'
      ].includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: StatusCode[key]
        };
      }, {});

    return Object.values(filtered);
  }

  isRetryableElementError(result) {
    const errorResponse = this.getErrorResponse(result);

    if (errorResponse instanceof WebDriverError && errorResponse.name === 'WebDriverError') {
      const errors = this.getRetryableErrorMessages();

      return errors.some(item => errorResponse.message.includes(item));
    }

    return (
      this.staleElementReference(errorResponse) ||
      this.elementClickInterceptedError(errorResponse) ||
      this.invalidElementStateError(errorResponse) ||
      this.elementNotInteractableError(errorResponse)
    );
  }

  staleElementReference(result) {
    return [result.error, result.errorStatus].includes(this.Errors.StatusCode.STALE_ELEMENT_REFERENCE);
  }

  elementClickInterceptedError(result) {
    return [result.error, result.errorStatus].includes(this.Errors.StatusCode.ELEMENT_CLICK_INTERCEPTED);
  }

  invalidElementStateError(result) {
    return [result.error, result.errorStatus].includes(this.Errors.StatusCode.INVALID_ELEMENT_STATE);
  }

  elementNotInteractableError(result) {
    return [result.error, result.errorStatus].includes(this.Errors.StatusCode.ELEMENT_IS_NOT_INTERACTABLE);
  }

  invalidSessionError(result) {
    return result.errorStatus === this.Errors.StatusCode.NO_SUCH_SESSION;
  }

  isResultSuccess(result) {
    return result && (typeof result.value != 'undefined') && (!result.status || result.status !== -1);
  }

  invalidWindowReference(result) {
    return result.value && result.value.error === this.Errors.StatusCode.NO_SUCH_WINDOW;
  }

  /**
   * @deprecated
   * @param settings
   * @returns {string}
   */
  static getBrowserName(settings) {
    const {BrowserName} = Utils;
    let {browserName} = settings.desiredCapabilities;
    if (browserName !== BrowserName.EDGE) {
      browserName = browserName.toLowerCase();
    }

    const browsersList = Object.values(BrowserName);

    if (browsersList.includes(browserName)) {
      return browserName;
    }

    const didYouMean = require('didyoumean');
    const resultMeant = didYouMean(browserName, browsersList);

    throw new Error(`Unknown browser: "${browserName}"${resultMeant ? ('; did you mean "' + resultMeant + '"?') : ''}`);
  }
}

module.exports = Transport;
