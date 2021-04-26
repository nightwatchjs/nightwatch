const WebdriverErrors = require('./webdriver/errors.js');
const Selenium2 = require('./selenium2.js');
const MethodMappings = require('./selenium3/actions.js');

class SeleniumProtocol extends Selenium2 {
  get MethodMappings() {
    return MethodMappings;
  }

  get defaultPathPrefix() {
    return '/wd/hub';
  }

  ////////////////////////////////////////////////////////////////////
  // Elements related
  ////////////////////////////////////////////////////////////////////
  formatCommandResponseData(result) {
    if (!result.value || typeof result.value != 'object') {
      return;
    }

    if (result['[[isNightwatch]]']) {
      delete result['[[isNightwatch]]'];

      return;
    }

    if (typeof result.value.stackTrace != 'undefined') {
      delete result.value.stackTrace;
    }
  }

  handleProtocolError(result, response, screenshotContent) {
    result = result || {};
    response = response || {};

    const {status = '', code = '', message = null, state = '', value = null} = result;
    const {statusCode = null} = response;

    let errorMessage = response.statusCode === 404 ? 'Unknown command' : 'An unknown error has occurred.';

    if (screenshotContent) {
      this.reporter && this.reporter.saveErrorScreenshot(result, screenshotContent);
    }

    if (code && message) {
      errorMessage = `Error ${code}: ${message}`;
    } else if (value && value.message) {
      errorMessage = '';
      if (value.error) {
        errorMessage = `${value.error} – `;
      }

      errorMessage += value.message.split('\n')[0];
    } else if (state && WebdriverErrors.Response[state]) {
      errorMessage = WebdriverErrors.Response[state].message;
    } else if (response.status && response.statusMessage) {
      errorMessage += ` ${response.status} ${response.statusMessage}`;
    }

    return {
      status: -1,
      code,
      state,
      value,
      errorStatus: status,
      error: errorMessage,
      httpStatusCode: statusCode
    };
  }
}

module.exports = SeleniumProtocol;
