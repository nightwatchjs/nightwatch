const EventEmitter = require('events');
const HttpRequest = require('../http/request.js');
const Utils = require('../utils');
const Factory = require('./factory.js');

class Transport extends EventEmitter {
  get defaultPort() {
    return 4444;
  }

  get Errors() {
    return require('./webdriver/errors.js');
  }

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
    let request = new HttpRequest(requestOptions);

    return new Promise((resolve, reject) => {
      request
        .on('success', (result, response) => {
          resolve(result);
        })
        .on('error', (result, response, screenshotContent) => {
          let errorResult = this.handleProtocolError(result, response, screenshotContent);

          reject(errorResult);
        })
        .send();
    });

  }

  handleProtocolError(result, response = {}) {
    result = result || {};

    const {status = '', value = null, error, code = '', message = null} = result;
    const {statusCode = null} = response;
    let errorMessage;

    // node.js errors
    if (code && message) {
      errorMessage = `Error ${code}: ${message}`;
    } else {
      // default error message;
      errorMessage = response && response.statusCode === 404 ? 'Unknown command' : 'An unknown error has occurred.';
    }

    if (value && value.message) {
      errorMessage = value.message;
    } else if (value && value.error && this.Errors.Response[value.error]) {
      errorMessage = this.Errors.Response[value.error].message;
    } else if (error) {
      errorMessage = error;
    }

    return {
      status: -1,
      value,
      code,
      errorStatus: status,
      error: errorMessage,
      httpStatusCode: statusCode
    };
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

  staleElementReference(result) {
    return [result.error, result.errorStatus].includes(this.Errors.StatusCode.STALE_ELEMENT_REFERENCE);
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
