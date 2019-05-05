const Errors = require('./jsonwire/errors.js');
const Transport = require('./transport.js');

class JsonWireProtocol extends Transport {
  get Errors() {
    return Errors;
  }

  ////////////////////////////////////////////////////////////////////
  // Session related
  ////////////////////////////////////////////////////////////////////
  parseSessionResponse(data = {}) {
    if (!data.sessionId && data.value && data.value.capabilities) {
      return super.parseSessionResponse(data);
    }

    if (data.value && data.value.error) {
      return {
        error: data.value
      };
    }

    return {
      sessionId: data.sessionId,
      capabilities: data.value || {}
    };
  }

  followRedirect(request, response) {
    if (!response.headers || !response.headers.location) {
      this.handleSessionCreateError();

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
  getElementId(resultValue) {
    return resultValue.ELEMENT;
  }

  isResultSuccess(result) {
    return result && result.status === Errors.StatusCode.SUCCESS;
  }

  runProtocolAction(requestOptions) {
    let request = this.createHttpRequest(requestOptions);

    return this.sendProtocolAction(request, function(resolve, reject) {
      request.on('success', (result, response) => {
        if (result.status && result.status !== Errors.StatusCode.SUCCESS) {
          result = this.handleProtocolError(result, response);

          return reject(result);
        }

        resolve(result);
      });

      request.on('error', (result, response, screenshotContent) => {
        let errorResult = this.handleProtocolError(result, response, screenshotContent);

        if (this.shouldRegisterError(errorResult)) {
          reject(errorResult);
        } else {
          resolve(errorResult);
        }

      });
    });
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

    [
      'additionalInformation',
      'supportUrl',
      'cause',
      'suppressed',
      'hCode',
      'class',
      'buildInformation',
      'stacktrace',
      'stackTrace',
      'localizedMessage',
      'message'
    ].forEach(function(item) {
      if (typeof result.value[item] != 'undefined') {
        delete result.value[item];
      }
    });

    if (errorDetails && errorDetails.length > 0) {
      result.value.message = errorDetails.shift();
    }

    if (errorDetails) {
      result.value.error = errorDetails;
    }
  }

  ////////////////////////////////////////////////////////////////////////
  // Error handling
  ////////////////////////////////////////////////////////////////////////
  handleProtocolError(result, response, screenshotContent) {
    let errorMessage = response && response.statusCode === 404 ? 'Unknown command' : 'An unknown error has occurred.';

    if (screenshotContent) {
      this.reporter && this.reporter.saveErrorScreenshot(result, screenshotContent);
    }

    if (result && result.status) {
      if (result.value && result.value.message) {
        errorMessage = result.value && result.value.message;
      } else {
        let error = Errors.findErrorById(result.status);
        if (error) {
          errorMessage = Errors.findErrorById(result.status).message;
        }
      }
    } else if (response && response.statusCode && response.statusMessage) {
      errorMessage += ` ${response.statusCode} ${response.statusMessage}`;
    }

    return {
      status: -1,
      state: result.state || '',
      value : result && result.value || null,
      errorStatus: result && result.status || '',
      error : errorMessage,
      httpStatusCode: response && response.statusCode
    };
  }

  static parseErrorDetails(result) {
    let errorDetails = result.localizedMessage ? result.localizedMessage : result.message;

    return errorDetails.split('\n');
  }
}

module.exports = JsonWireProtocol;
