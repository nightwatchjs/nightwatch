const BrowserName = require('../util/browsername.js');
const ElementsByRecursion = require('../api/element-commands/_elementsByRecursion.js');
const HttpRequest = require('../http/request.js');
const Actions = require('./actions.js');
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

  get Errors() {
    return {
      StatusCode: null,
      findErrorById: function() {}
    };
  }

  formatCommandResponseData() {}
  handleErrorResponse() {}
  parseSessionResponse() {}

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
   * @param {string} compositeCommand
   * @param {Array} args
   * @return {Promise}
   */
  executeElementCommand(element, compositeCommand, args) {
    return this.locateElement(element)
      .then(elementId => {
        if (elementId) {
          let protocolAction = Actions.elementApiMappings[compositeCommand];
          args.unshift(elementId);

          return this.executeProtocolAction(protocolAction, args);
        }
      });
  }

  /**
   * Used by waitForElement commands
   *
   * @param {Element} element
   * @return {Promise}
   */
  locateMultipleElements(element) {
    return this.executeProtocolAction('locateMultipleElements', [element.locateStrategy, element.selector])
      .then(result => {
        if (!this.isResultSuccess(result) || result.value.length === 0) {
          throw result;
        }

        return this.mapWebElementIds(result.value);
      });
  }

  /**
   * Used by expect element assertions
   *
   * @param {Element} element
   * @return {Promise}
   */
  locateElement(element) {
    if (element.usingRecursion) {
      let recursion = new ElementsByRecursion(this.nightwatchInstance);

      return recursion.locateElements(element.selector);
    }

    let elementAction = Transport.getElementAction(element);

    return this.callElementLocateAction(element, elementAction, [element.locateStrategy, element.selector]);
  }

  /**
   * Used by recursive lookup command for multi elements (in page objects)
   *
   * @param {Array} elementsIdsNormalized
   * @param {Element} element
   * @return {Promise}
   */
  locateMultipleElementsFromParent(elementsIdsNormalized, element) {
    let promises = [];

    elementsIdsNormalized.forEach(elementId => {
      promises.push(this.locateElementFromParent(elementId, element));
    });

    return Promise.all(promises).then(elementIds => {
      return elementIds.reduce(function(arr, elementId) {
        // In case we have multiple matches on the same element, only add once
        if (arr.indexOf(elementId) < 0) {
          arr.push(elementId);
        }

        return arr;
      }, []);
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

        let elementId = this.resolveElement(result);
        if (elementId) {
          return elementId;
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
      sessionId: this.api.sessionId
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

    if (usingSeleniumServer) {
      const SeleniumProtocol = require('./selenium.js');

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