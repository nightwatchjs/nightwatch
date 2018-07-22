const EventEmitter = require('events');
const BrowserName = require('../util/browsername.js');
const ElementsByRecursion = require('../api/element-commands/_elementsByRecursion.js');
const SingleElementByRecursion = require('../api/element-commands/_elementByRecursion.js');
const HttpRequest = require('../http/request.js');
const Actions = require('./actions.js');
const Utils = require('../util/utils.js');
const Element = require('../page-object/element.js');
const Logger = require('../util/logger.js');

class Transport extends EventEmitter {
  static get DO_NOT_LOG_ERRORS() {
    return [
      'Unable to locate element',
      '{"errorMessage":"Unable to find element',
      'no such element'
    ];
  }

  static get MAX_CONCURRENT_PROMISES() {
    return 8;
  }

  /**
   * @param {Array<Promise>} promises
   */
  static runPromises(promises) {
    let allResults = [];
    function handleResult(result) {
      allResults.push(result);
    }

    return Utils.processAsyncQueue(Transport.MAX_CONCURRENT_PROMISES, promises, function(promise, index, next) {
      promise.then(handleResult).catch(handleResult).then(function () {
        next(index);
      });
    }).then(function() {
      return allResults;
    });
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
  parseSessionResponse() {}
  isResultSuccess() {}

  ////////////////////////////////////////////////////////////////////
  // Session related
  ////////////////////////////////////////////////////////////////////
  getErrorMessage(result) {
    return result.value.message;
  }

  staleElementReference(result) {
    return result.errorStatus === this.Errors.StatusCode.STALE_ELEMENT_REFERENCE;
  }

  invalidSessionError(result) {
    return result.errorStatus === this.Errors.StatusCode.NO_SUCH_SESSION;
  }

  handleErrorResponse(data = null) {
    let err = new Error('An occurred error while retrieving a new session');
    let addtMsg = '';

    if (data instanceof Error) {
      switch (data.code) {
        case 'ECONNREFUSED':
          err.sessionConnectionRefused = true;
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
    let request = this.createProtocolAction({
      path : '/session',
      data : {
        desiredCapabilities : this.desiredCapabilities
      }
    });

    request
      .on('error', err => {
        this.handleErrorResponse(err);
      })
      .on('success', (data, response, isRedirect) => {
        let sessionData = this.parseSessionResponse(data);

        if (sessionData.sessionId) {
          this.emit('transport:session.create', sessionData, request, response);
        } else if (isRedirect) {
          this.followRedirect(request, response);
        } else {
          this.handleErrorResponse(data);
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

  createProtocolAction(requestOptions) {
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
    if (result.value) {
      result.value = result.value.reduce((prev, item) => {
        prev.push(this.getElementId(item));

        return prev;
      }, []);
    }

    return result;
  }

  resolveElement(result, element, multipleElements) {
    if (!this.isResultSuccess(result)) {
      return null;
    }

    let value = result.value;

    if (multipleElements && Array.isArray(value) && value.length > 0) {
      if (value.length > 1) {
        let message = `More than one element (${value.length}) found for <${element.toString()}> with selector: "${element.selector}".`;

        if (this.settings.globals.throwOnMultipleElementsReturned) {
          throw new Error(message);
        } else if (this.settings.output) {
          console.warn(Logger.colors.green(`  Warning: ${message} Only the first one will be used.`));
        }
      }
      value = value[0];
    } else if (Array.isArray(value) && value.length === 0) {
      value = null;
    }

    let parsedValue = value && this.getElementId(value);

    return {
      status: 0,
      // for recursive lookups, the value is already parsed
      value: typeof parsedValue == 'undefined' ? value : parsedValue
    };
  }

  /**
   * Selects a subset of elements if the result requires filtering.
   *
   * @param {Element} element
   * @param {object} result
   * @return {*}
   */
  filterElements(element, result) {
    let filtered = Element.applyFiltering(element, result.value);

    if (filtered) {
      result.value = filtered;

      return result;
    }

    result = this.getElementNotFoundResult(result);

    throw result;
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
   * Used by waitForElement commands
   *
   * @param {Element} element
   * @return {Promise}
   */
  locateMultipleElements(element) {
    if (element.usingRecursion) {
      return this.locateElementsUsingRecursion(element);
    }

    return this.executeProtocolAction('locateMultipleElements', [element.locateStrategy, element.selector])
      .then(result => {
        if (this.isResultSuccess(result) && Element.requiresFiltering(element)) {
          return this.filterElements(element, result);
        }

        return result;
      })
      .catch(result => {
        if (this.invalidSessionError(result)) {
          return new Error(`An error occurred while running ".locateMultipleElements()": ${this.getErrorMessage(result)}.`);
        }

        return [];
      });
  }

  /**
   * @param {Element} element
   * @return {Promise}
   */
  locateElementsUsingRecursion(element) {
    let recursion = new ElementsByRecursion(this.nightwatchInstance);

    return recursion.locateElements(element.selector);
  }

  locateSingleElementUsingRecursion(element) {
    let recursion = new SingleElementByRecursion(this.nightwatchInstance);

    return recursion.locateElement(element.selector);
  }

  /**
   * Used by expect element assertions
   *
   * @param {Element} element
   * @return {Promise}
   */
  locateElement(element) {
    if (element.usingRecursion) {
      return Element.requiresFiltering(element) ?
        this.locateElementsUsingRecursion(element):
        this.locateSingleElementUsingRecursion(element);
    }

    let elementAction = Transport.getElementAction(element);

    return this.callElementLocateAction(element, elementAction, [element.locateStrategy, element.selector]);
  }

  /**
   * Used by recursive lookup command for multi elements (in page objects)
   *
   * @param {Object} result
   * @param {Element} element
   * @return {Promise}
   */
  locateMultipleElementsFromParent(result, element) {
    let promises = [];

    result.value.forEach(elementId => {
      promises.push(this.locateElementFromParent(elementId, element));
    });

    return Transport.runPromises(promises).then(results => {
      if (results.length === 1 && results[0] instanceof Error) {
        throw results[0];
      }

      let failed = 0;
      let elementResult = results.reduce((prev, item) => {
        // In case we have multiple matches on the same element, only add once
        if (this.isResultSuccess(item) && prev.value.indexOf(item.value) < 0) {
          prev.value.push(item.value);
        } else {
          if (item instanceof Error) {
            Logger.error(item.stack);
          }

          failed++;
        }

        return prev;
      }, {value: [], status: 0});

      if (failed === results.length) {
        elementResult = this.getElementNotFoundResult(elementResult);
      }

      return elementResult;
    });
  }

  /**
   * Used by recursive lookup command for a single element
   *
   * @param {string} parentElementId
   * @param {Element} element
   * @return {Promise}
   */
  locateElementFromParent(parentElementId, element) {
    return this.callElementLocateAction(element, 'locateMultipleElementsByElementId', [parentElementId, element.locateStrategy, element.selector], true);
  }

  /**
   * Helper method
   *
   * @param {Element} element
   * @param {String} elementAction
   * @param {Array} args
   * @param {Boolean} multipleElements
   */
  callElementLocateAction(element, elementAction, args, multipleElements = false) {
    return this.executeProtocolAction(elementAction, args)
      .then(result => {
        if (this.isResultSuccess(result) && Element.requiresFiltering(element)) {
          return this.filterElements(element, result);
        }

        return result;
      })
      .then(result => {
        let elementResult = this.resolveElement(result, element, Element.requiresFiltering(element) || multipleElements);
        if (elementResult) {
          return elementResult;
        }

        throw result;
      });
  }

  /**
   * Helper method
   *
   * @param {String} protocolAction
   * @param {Array} args
   * @return {Promise}
   */
  executeProtocolAction(protocolAction, args) {
    return this.Actions.session[protocolAction]({
      args: args,
      sessionId: this.api.sessionId,
      sessionRequired: true
    });
  }

  shouldRegisterError(errorResult) {
    let errorMessage = typeof errorResult == 'string' ? errorResult : (errorResult.error || errorResult.message);

    return !Transport.DO_NOT_LOG_ERRORS.some(function(item) {
      return errorMessage.indexOf(item) === 0;
    });
  }

  static create(nightwatchInstance) {
    let settings = nightwatchInstance.settings;
    let browserName = settings.desiredCapabilities.browserName;
    let usingSeleniumServer = settings.selenium && (settings.selenium.start_process || !settings.webdriver.start_process);
    let seleniumVersion2 = usingSeleniumServer && (settings.selenium.version2 || browserName === BrowserName.CHROME);

    if (seleniumVersion2) {
      const Selenium2 = require('./selenium2.js');

      return new Selenium2(nightwatchInstance);
    }

    if (usingSeleniumServer) {
      const SeleniumProtocol = require('./selenium3.js');

      return new SeleniumProtocol(nightwatchInstance);
    }

    switch (browserName) {
      case BrowserName.FIREFOX: {
        const WebdriverProtocol = require('./webdriver.js');

        return new WebdriverProtocol(nightwatchInstance);
      }

      default: {
        const JsonWireProtocol = require('./jsonwire.js');

        return new JsonWireProtocol(nightwatchInstance);
      }
    }
  }

  /**
   *
   * @param {Element} element
   * @param {Boolean} usingParent
   * @return {*}
   */
  static getElementAction(element, usingParent = false) {
    let multipleElements = Element.requiresFiltering(element);

    return multipleElements ? (usingParent ? 'locateMultipleElementsByElementId' : 'locateMultipleElements') :
      (usingParent ? 'locateSingleElementByElementId' : 'locateSingleElement');
  }
}

module.exports = Transport;
