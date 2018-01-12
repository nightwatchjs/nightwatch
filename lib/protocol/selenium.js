const EventEmitter = require('events');
const Element = require('../page-object/element.js');
const ElementsByRecursion = require('../api/element-commands/_elementsByRecursion.js');
const HttpRequest = require('../http/request.js');
const Reporter = require('../core/reporter.js');
const Errors = require('./selenium/errors.js');
const TransportActions = require('./selenium/actions.js');

let __defaultSettings__ = {
  host           : 'localhost',
  port           : 4444,
  default_path   : '/wd/hub'
};

class SeleniumProtocol extends EventEmitter {
  constructor(nightwatchInstance) {
    super();

    this.nightwatchInstance = nightwatchInstance;
    this.nightwatchInstance.once('nightwatch:session.create', () => {
      this.__sessionId = this.api.sessionId;
    });
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get desiredCapabilities() {
    return this.nightwatchInstance.session.desiredCapabilities;
  }

  get defaultPathPrefix() {
    return __defaultSettings__.default_path;
  }

  get defaultPort() {
    return __defaultSettings__.port;
  }

  get Actions() {
    return TransportActions;
  }

  get sessionId() {
    return this.__sessionId;
  }

  ////////////////////////////////////////////////////////////////////
  // Session related
  ////////////////////////////////////////////////////////////////////
  createSession() {
    let request = new HttpRequest({
      path : '/session',
      data : {
        desiredCapabilities : this.desiredCapabilities
      }
    });

    request.on('error', err => {
      this.handleErrorResponse(err);
    })
    .on('success', (data, response, isRedirect) => {
      data = data || {};

      if (data.sessionId) {
        let sessionId = data.sessionId;
        let capabilities = data.value;

        this.emit('transport:session.create', {
          sessionId: sessionId,
          capabilities: capabilities || {}
        }, request, response);
      } else if (isRedirect) {
        this.followRedirect(request, response);
      } else {
        this.handleErrorResponse(data);
      }
    })
    .post();

    return this;
  }

  closeSession(sessionId) {
    let request = new HttpRequest({
      path : `/session/${sessionId}`
    });

    request.on('complete', response => {
      this.emit('transport:session.destroy', response);
    }).on('error', (err) => {
      this.emit('transport:session.error', err);
    }).delete();

    return this;
  }

  handleErrorResponse(data = null) {
    let err = new Error('There was an error while retrieving a new session from the Selenium server.');

    if (data instanceof Error) {
      err.message += `\n${data.message}\n`;
    } else if (data) {
      if (typeof data == 'object' && Object.keys(data).length > 0) {
        err.data = JSON.stringify(data.value || data);
      } else {
        err.data = data;
      }
    }

    this.emit('transport:session.error', err);

    return this;
  }

  followRedirect(request, response) {
    if (!response.headers || !response.headers.location) {
      this.handleErrorResponse();
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

  ////////////////////////////////////////////////////////////////////
  // Elements related
  ////////////////////////////////////////////////////////////////////

  resolveElement(result, multipleElements) {
    if (!result || result.status !== Errors.StatusCode.SUCCESS) {
      return null;
    }

    return multipleElements ? result.value[0].ELEMENT : result.value.ELEMENT;
  }

  staleElementReference(result) {
    return result.status === Errors.StatusCode.STALE_ELEMENT_REFERENCE;
  }

  isResultSuccess(result) {
    return result && /*result.value === null &&*/ result.status === Errors.StatusCode.SUCCESS;
  }

  isResult(result) {
    return result && /*result.value === null &&*/ result.status === Errors.StatusCode.SUCCESS;
  }

  /**
   * Selects a subset of elements if the result requires filtering.
   *
   * @param {Element} element
   * @param {object} result
   * @return {*}
   */
  static filterElements(element, result) {
    let filtered = Element.applyFiltering(element, result.value);

    if (filtered) {
      result.value = filtered;

      return result;
    }

    result.status = -1;
    result.value = [];

    let errorId = Errors.Status.NO_SUCH_ELEMENT;
    let errorInfo = Errors.findErrorById(errorId);

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
          let protocolAction = TransportActions.elementApiMappings[compositeCommand];
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

        return result.value.map(item => {
          return item.ELEMENT;
        });
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

    let elementAction = SeleniumProtocol.getElementAction(element);

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
      promises.push(this.transport.locateElementFromParent(elementId, element));
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
    let elementAction = SeleniumProtocol.getElementAction(element, true);

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
    return TransportActions.session[elementAction]({
      args: args,
      sessionId: this.sessionId
    }).then(result => {
      if (this.isResultSuccess(result) && Element.requiresFiltering(element)) {
        return SeleniumProtocol.filterElements(element, result);
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
    return TransportActions.session[protocolAction]({
      args: args,
      sessionId: this.sessionId
    });
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

  ////////////////////////////////////////////////////////////////////
  // Transport related
  ////////////////////////////////////////////////////////////////////
  static runProtocolAction(requestOptions) {
    let request = new HttpRequest(requestOptions);

    return new Promise((resolve, reject) => {
      request.on('success', (result, response) => {
        if (result.status && result.status !== Errors.StatusCode.SUCCESS) {
          result = SeleniumProtocol.handleTestError(result);
        }

        resolve(result);
      })
      .on('error', function(result, response, screenshotContent) {
        result = SeleniumProtocol.handleTestError(result);

        if (screenshotContent) {
          Reporter.saveErrorScreenshot(screenshotContent);
        }

        resolve(result);
      }).send();

    });

  }

  static handleTestError(result) {
    let errorMessage = '';
    if (result && result.status && (result.status in Errors.Response)) {
      errorMessage = Errors.Response[result.status].message;
    }

    return {
      status: -1,
      value : result && result.value || null,
      errorStatus: result && result.status || '',
      error : errorMessage
    };
  }
}

module.exports = SeleniumProtocol;