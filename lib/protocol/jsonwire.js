const Errors = require('./jsonwire/errors.js');
const WebdriverProtocol = require('./webdriver.js');

class JsonWireProtocol extends WebdriverProtocol {
  get defaultPathPrefix() {
    return '/wd/hub';
  }

  get Errors() {
    return Errors;
  }
  ////////////////////////////////////////////////////////////////////
  // Session related
  ////////////////////////////////////////////////////////////////////
  parseSessionResponse(data = {}) {
    return {
      sessionId: data.sessionId,
      capabilities: data.value || {}
    };
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

  isResultSuccess(result) {
    return result && result.status === Errors.StatusCode.SUCCESS;
  }

  mapWebElementIds(result) {
    return result.map(item => {
      return item.ELEMENT;
    });
  }

  runProtocolAction(requestOptions) {
    let request = this.createProtocolAction(requestOptions);

    return this.sendProtocolAction(request, function(resolve, reject) {
      request.on('success', (result, response) => {
        if (result.status && result.status !== Errors.StatusCode.SUCCESS) {
          result = this.handleTestError(result);
        }

        resolve(result);
      });

      request.on('error', (result, response, screenshotContent) => {
        let errorResult = this.handleTestError(result, response, screenshotContent);

        if (this.shouldRegisterError(errorResult)) {
          reject(errorResult);
        } else {
          resolve(errorResult);
        }

      });
    });
  }

  handleTestError(result, response, screenshotContent) {
    let errorMessage = 'An unknown error has occurred.';

    if (screenshotContent) {
      this.reporter && this.reporter.saveErrorScreenshot(result, screenshotContent);
    }

    if (result && result.state && JsonWireProtocol.Response[result.state]) {
      errorMessage = JsonWireProtocol.Response[result.state].message;
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

  formatCommandResponseData(result) {
    if (result.class) {
      delete result.class;
    }

    if (result.hCode) {
      delete result.hCode;
    }

    if (!result.value || typeof result.value != 'object') {
      return;
    }

    let errorDetails = null;

    if (result.value.screen) {
      result.screenshotContent = result.value.screen;
      delete result.value.screen;
    }

    if (result.value.localizedMessage || result.value.message) {
      errorDetails = JsonWireProtocol.parseErrorDetails(result.value);
    }

    ['additionalInformation', 'supportUrl', 'cause', 'suppressed',
      'hCode', 'class', 'buildInformation', 'stacktrace', 'stackTrace',
      'localizedMessage', 'message']
      .forEach(function(item) {
        if (typeof result.value[item] != 'undefined') {
          delete result.value[item];
        }
      });

    if (errorDetails && errorDetails.length > 0) {
      result.value.message = errorDetails.shift();
    }

    result.value.error = errorDetails;
  }

  static parseErrorDetails(result) {
    let errorDetails = result.localizedMessage ? result.localizedMessage : result.message;

    return errorDetails.split('\n');
  }
}

module.exports = JsonWireProtocol;