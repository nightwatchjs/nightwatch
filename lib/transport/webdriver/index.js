const Transport = require('../');
const HttpRequest = require('../../http/request.js');

class WebdriverProtocol extends Transport {
  get Errors() {
    return require('./errors.js');
  }

  get MethodMappings() {
    return require('./method-mappings.js');
  }

  ////////////////////////////////////////////////////////////////////
  // Elements related
  ////////////////////////////////////////////////////////////////////
  getElementId(resultValue) {
    return resultValue[Transport.WEB_ELEMENT_ID];
  }

  toElement(resultValue) {
    return {[Transport.WEB_ELEMENT_ID]: resultValue};
  }

  isResultSuccess(result) {
    return result && (typeof result.value != 'undefined') && (!result.status || result.status !== -1);
  }

  invalidWindowReference(result) {
    return result.value && result.value.error === this.Errors.StatusCode.NO_SUCH_WINDOW;
  }

  ////////////////////////////////////////////////////////////////////
  // Transport related
  ////////////////////////////////////////////////////////////////////
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
}

module.exports = WebdriverProtocol;
