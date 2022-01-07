const EventEmitter = require('events');

const HttpRequest = require('../http/request.js');
const Factory = require('./factory.js');
const {Logger} = require('../utils');

class Transport extends EventEmitter {
  static get DO_NOT_LOG_ERRORS() {
    return [
      'Unable to locate element',
      '{"errorMessage":"Unable to find element',
      'no such element'
    ];
  }

  get Errors() {
    return require('./errors');
  }

  static create(nightwatchInstance) {
    return Factory.create(nightwatchInstance);
  }

  /**
   * Called once a test suite has finished executing
   * @override
   * @param {Error|Boolean} failures
   * @returns {Promise<void>}
   */
  async testSuiteFinished(failures) {}

  /**
   * Called once a session has closed; a test suite can have multiple test cases and
   *  hence multiple sessions can be started
   * @override
   * @returns {Promise<void>}
   */
  async sessionFinished() {}

  isResultSuccess() {
    return true;
  }
  /**
   * Resolves the element ID based on the current transport used
   *
   * @param {Object} result
   * @param {Element} element
   * @param {Boolean} multipleElements
   * @return {{value: *, status: number}|null}
   */
  resolveElement(result, element, multipleElements) {
    if (!this.isResultSuccess(result)) {
      return null;
    }

    let {value} = result;

    if (multipleElements && Array.isArray(value) && value.length > 0) {
      if (value.length > 1) {
        let message = `More than one element (${value.length}) found for element <${element.toString()}> with selector: "${element.selector}".`;

        if (this.settings.globals.throwOnMultipleElementsReturned) {
          throw new Error(message);
        }

        if (!this.settings.globals.suppressWarningsOnMultipleElementsReturned) {
          Logger.warn(`  Warning: ${message} Only the first one will be used.`);
        }
      }
      value = value[0];
    } else if (Array.isArray(value) && value.length === 0) {
      value = null;
    }

    return value;
  }

  ////////////////////////////////////////////////////////////////////
  // Legacy Transport related
  ////////////////////////////////////////////////////////////////////
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

  createHttpRequest(requestOptions) {
    return new HttpRequest(requestOptions);
  }

  runProtocolAction(requestOptions) {
    const request = this.createHttpRequest(requestOptions);

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
    const request = this.createHttpRequest(options);

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

  shouldRegisterError(result) {
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
}

module.exports = Transport;
