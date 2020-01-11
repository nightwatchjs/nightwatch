const Transport = require('./transport.js');
const HttpRequest = require('../http/request.js');

class WebdriverProtocol extends Transport {
  get Errors() {
    return require('./webdriver/errors.js');
  }

  get MethodMappings() {
    return require('./webdriver/actions.js');
  }

  ////////////////////////////////////////////////////////////////////
  // Elements related
  ////////////////////////////////////////////////////////////////////
  getElementId(resultValue) {
    return resultValue[Transport.WEB_ELEMENT_ID];
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
    let errorMessage = response && response.statusCode === 404 ? 'Unknown command' : 'An unknown error has occurred.';

    if (result.value && result.value.message) {
      errorMessage = result.value.message;
    } else if (result.value && result.value.error && this.Errors.Response[result.value.error]) {
      errorMessage = this.Errors.Response[result.value.error].message;
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
