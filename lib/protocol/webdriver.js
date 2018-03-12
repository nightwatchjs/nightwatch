const Transport = require('./transport.js');
const HttpRequest = require('../http/request.js');
const Errors = require('./webdriver/errors.js');

class WebdriverProtocol extends Transport {
  static get WEB_ELEMENT_ID () {
    return 'element-6066-11e4-a52e-4f735466cecf';
  }

  constructor(nightwatchInstance) {
    super(nightwatchInstance);
  }

  get api() {
    return this.nightwatchInstance.api;
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
    return Errors;
  }

  ////////////////////////////////////////////////////////////////////
  // Session related
  ////////////////////////////////////////////////////////////////////
  handleErrorResponse(data = null) {
    let err = new Error('An error while retrieving a new session');

    if (data instanceof Error || data.value) {
      err.message = err.message + `: "${data.message || data.value}"`;
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

  parseSessionResponse(data = {}) {
    let sessionData = data.value || {};

    return {
      sessionId: sessionData.sessionId,
      capabilities: sessionData.capabilities || {}
    };
  }

  ////////////////////////////////////////////////////////////////////
  // Elements related
  ////////////////////////////////////////////////////////////////////
  resolveElement(result) {
    if (!result || !result.value) {
      return null;
    }

    return result.value[WebdriverProtocol.WEB_ELEMENT_ID];
  }

  isResultSuccess(result) {
    return result && result.value;
  }

  staleElementReference(result) {
    return result.errorStatus === Errors.StatusCode.STALE_ELEMENT_REFERENCE;
  }

  invalidSessionError(result) {
    return result.errorStatus === Errors.StatusCode.NO_SUCH_SESSION;
  }

  getErrorMessage(result) {
    return result.value.message;
  }

  mapWebElementIds(result) {
    return result.map(item => {
      return item[WebdriverProtocol.WEB_ELEMENT_ID];
    });
  }

  ////////////////////////////////////////////////////////////////////
  // Transport related
  ////////////////////////////////////////////////////////////////////
  runProtocolAction(requestOptions) {
    let request = new HttpRequest(requestOptions);

    return new Promise((resolve, reject) => {
      request.on('success', (result, response) => {
        resolve(result);
      })
      .on('error', (result, response, screenshotContent) => {
        let errorResult = this.handleTestError(result, response, screenshotContent);

        reject(errorResult);
      }).send();
    });

  }

  handleTestError(result, response) {
    let errorMessage = 'An unknown error has occurred.';

    if (result.value && result.value.message) {
      errorMessage = result.value.message;
    } else if (result.value && result.value.error && Errors.Response[result.value.error]) {
      errorMessage = Errors.Response[result.value.error].message;
    }

    return {
      status: -1,
      value : result && result.value || null,
      errorStatus: result && result.status || '',
      error : errorMessage,
      httpStatusCode: response.statusCode
    };
  }
}

module.exports = WebdriverProtocol;