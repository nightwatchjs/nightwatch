const Errors = require('./jsonwire/errors.js');
const WebdriverErrors = require('./webdriver/errors.js');
const Selenium2 = require('./selenium2.js');
const WebdriverProtocol = require('./webdriver.js');

class SeleniumProtocol extends Selenium2 {
  ////////////////////////////////////////////////////////////////////
  // Elements related
  ////////////////////////////////////////////////////////////////////
  resolveElement(result) {
    if (!result || result.status !== Errors.StatusCode.SUCCESS || !result.value) {
      return null;
    }

    return {
      value: result.value[WebdriverProtocol.WEB_ELEMENT_ID],
      status: result.status
    };
  }

  mapWebElementIds(result) {
    if (result.value) {
      result.value = result.value.map(item => {
        return item[WebdriverProtocol.WEB_ELEMENT_ID];
      });
    }

    return result;
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
    } else if (response.status && response.statusMessage) {
      errorMessage += ` ${response.status} ${response.statusMessage}`;
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