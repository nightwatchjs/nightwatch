const EventEmitter = require('events');
const HttpRequest = require('../http/request.js');
const Actions = require('./actions.js');
const Utils = require('../utils');
const Factory = require('./factory.js');

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

  get SessionHandler() {
    return require('./session-handler.js');
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

  constructor(nightwatchInstance) {
    super();

    this.nightwatchInstance = nightwatchInstance;
    this.init();
  }

  init() {
    this.createSessionHandler();
    this.createActions();
  }

  createActions() {
    this.actionsInstance = new Actions(this);
    this.actionsInstance.loadActions(this.MethodMappings);

    return this;
  }


  formatCommandResponseData() {}
  isResultSuccess() {}
  testSuiteFinished() {}

  ////////////////////////////////////////////////////////////////////
  // Session related
  ////////////////////////////////////////////////////////////////////
  createSessionHandler() {
    this.sessionHandler = new this.SessionHandler(this.nightwatchInstance);

    return this;
  }

  createSession() {
    this.sessionHandler.on('session.error', err => {
      this.emit('transport:session.error', err);
    });

    this.sessionHandler.on('session.create', (data, req, res) => {
      this.emit('transport:session.create', data, req, res);
    });

    this.sessionHandler.sendRequest();

    return this;
  }

  closeSession() {
    return new Promise((resolve, reject) => {
      this.api.end(result => {
        resolve(result);
      });
    });
  }

  ////////////////////////////////////////////////////////////////////
  // HTTP
  ////////////////////////////////////////////////////////////////////
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
   * @param {object} value
   * @return {object}
   */
  toElement(value) {
    return value;
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
   * @param {Object} args
   * @return {Promise}
   */
  executeProtocolAction(protocolAction, args) {
    if (Utils.isObject(protocolAction) && protocolAction.actionName) {
      const {actionName, args, sessionId = this.api.sessionId} = protocolAction;

      return this.Actions.session[actionName]({
        args,
        sessionId,
        sessionRequired: true
      });
    }

    return this.Actions.session[protocolAction]({
      args,
      sessionId: this.api.sessionId,
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

  invalidWindowReference(result) {
    return [result.error, result.errorStatus].includes(this.Errors.StatusCode.NO_SUCH_WINDOW);
  }

  invalidSessionError(result) {
    return result.errorStatus === this.Errors.StatusCode.NO_SUCH_SESSION;
  }
}

module.exports = Transport;
