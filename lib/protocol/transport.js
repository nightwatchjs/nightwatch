const BrowserName = require('../util/browsername.js');
const ElementsByRecursion = require('../api/element-commands/_elementsByRecursion.js');
const HttpRequest = require('../http/request.js');
const Actions = require('./actions.js');
const Utils = require('../util/utils.js');
const Element = require('../page-object/element.js');
const EventEmitter = require('events');

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
      promise.then(handleResult).catch(handleResult).then(() => {
        next(index);
      });
    }).then(function() {
      return allResults;
    });
  }

  constructor(nightwatchInstance) {
    super();

    Actions.setTransport(this);

    this.nightwatchInstance = nightwatchInstance;
  }

  get Actions() {
    return Actions;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get Errors() {
    return {
      StatusCode: null,
      findErrorById: function() {}
    };
  }

  formatCommandResponseData() {}
  handleErrorResponse() {}
  parseSessionResponse() {}
  isResultSuccess() {}

  ////////////////////////////////////////////////////////////////////
  // Session related
  ////////////////////////////////////////////////////////////////////
  createSession() {
    let request = this.createProtocolAction({
      path : '/session',
      data : {
        desiredCapabilities : this.desiredCapabilities
      }
    });

    request.on('error', err => {
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
    }).post();

    return this;
  }

  closeSession(sessionId) {
    let request = this.createProtocolAction({
      path : `/session/${sessionId}`
    });

    request.on('complete', response => {
      this.emit('transport:session.destroy', response);
    }).on('error', (err) => {
      this.emit('transport:session.error', err);
    }).delete();

    return this;
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

    result.status = -1;
    result.value = [];

    let errorId = this.Errors.StatusCode && this.Errors.StatusCode.NO_SUCH_ELEMENT;
    let errorInfo = this.Errors.findErrorById(errorId);

    if (errorInfo) {
      result.message = errorInfo.message;
      result.errorStatus = errorInfo.status;
    }

    throw result;
  }

  /**
   * Used by element commands, such as getText()
   *
   * @param {Element} element
   * @param {string} mappedCommand
   * @param {Array} args
   * @return {Promise}
   */
  executeElementCommand(element, mappedCommand, args) {
    return this.locateElement(element)
      .then(result => {
        let elementId = result.value;

        if (!Array.isArray(elementId)) {
          elementId = [elementId];
        }

        if (elementId.length > 1) {
          // TODO: Format this warning message
          let message = `Found ${elementId.length} elements for selector: "${element.selector}".`;
          console.warn(message);
        }

        let protocolAction = Actions.elementApiMappings[mappedCommand];
        args.unshift(elementId[0]);

        return this.executeProtocolAction(protocolAction, args);
      });
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
        if (!this.isResultSuccess(result) || result.value.length === 0) {
          throw result;
        }

        return this.mapWebElementIds(result);
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

  /**
   * Used by expect element assertions
   *
   * @param {Element} element
   * @return {Promise}
   */
  locateElement(element) {
    if (element.usingRecursion) {
      return this.locateElementsUsingRecursion(element);
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
      return results.reduce((prev, result) => {
        // In case we have multiple matches on the same element, only add once
        if (this.isResultSuccess(result) && prev.value.indexOf(result.value) < 0) {
          prev.value.push(result.value);
        }

        return prev;
      }, {value: [], status: 0});
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
    let elementAction = Transport.getElementAction(element, true);

    return this.callElementLocateAction(element, elementAction, [parentElementId, element.locateStrategy, element.selector]);
  }

  /**
   * Helper method
   *
   * @param {Element} element
   * @param {String} elementAction
   * @param {Array} args
   */
  callElementLocateAction(element, elementAction, args) {
    return this.executeProtocolAction(elementAction, args)
      .then(result => {
        if (this.isResultSuccess(result) && Element.requiresFiltering(element)) {
          return this.filterElements(element, result);
        }

        let elementResult = this.resolveElement(result);
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
    return Actions.session[protocolAction]({
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
    let usingSeleniumServer = settings.selenium && settings.selenium.start_process;
    let seleniumVersion2 = usingSeleniumServer && settings.selenium.version2;

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