const Errors = require('./jsonwire/errors.js');
const WebdriverErrors = require('./webdriver/errors.js');
const JsonWire = require('./jsonwire.js');
const WebdriverProtocol = require('./webdriver.js');

class SeleniumProtocol extends JsonWire {
  ////////////////////////////////////////////////////////////////////
  // Elements related
  ////////////////////////////////////////////////////////////////////
  resolveElement(result) {
    if (!result || result.status !== Errors.StatusCode.SUCCESS) {
      return null;
    }

    return result.value[WebdriverProtocol.WEB_ELEMENT_ID];
  }

  isResultSuccess(result) {
    return result && result.status === Errors.StatusCode.SUCCESS;
  }

  mapWebElementIds(result) {
    return result.map(item => {
      return item[WebdriverProtocol.WEB_ELEMENT_ID];
    });
  }

  handleTestError(result, response, screenshotContent) {
    let errorMessage = 'An unknown error has occurred.';

    if (screenshotContent) {
      this.reporter && this.reporter.saveErrorScreenshot(result, screenshotContent);
    }

    if (result.value && result.value.message) {
      errorMessage = result.value.message;
    } else if (result && result.state && WebdriverErrors.Response[result.state]) {
      errorMessage = WebdriverErrors.Response[result.state].message;
    }

    return {
      status: -1,
      state: result.state || '',
      value : result && result.value || null,
      errorStatus: result && result.status || '',
      error : errorMessage,
      httpStatusCode: response.statusCode
    };
  }
}

module.exports = SeleniumProtocol;