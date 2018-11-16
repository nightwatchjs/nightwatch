const Transport = require('./transport.js');
const HttpRequest = require('../http/request.js');
const Errors = require('./webdriver/errors.js');
const MethodMappings = require('./webdriver/actions.js');

class WebdriverProtocol extends Transport {
  static get WEB_ELEMENT_ID () {
    return 'element-6066-11e4-a52e-4f735466cecf';
  }

  get Errors() {
    return Errors;
  }

  get MethodMappings() {
    return MethodMappings;
  }

  ////////////////////////////////////////////////////////////////////
  // Session related
  ////////////////////////////////////////////////////////////////////
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
  getElementId(resultValue) {
    return resultValue[WebdriverProtocol.WEB_ELEMENT_ID];
  }

  isResultSuccess(result) {
    return result && (typeof result.value != 'undefined') && (!result.status || result.status !== -1);
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
          let errorResult = this.handleTestError(result, response, screenshotContent);

          reject(errorResult);
        })
        .send();
    });

  }

  handleTestError(result, response = {}) {
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
