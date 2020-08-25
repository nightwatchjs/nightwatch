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
    if (!result.value || typeof result.value != 'object') {
      return;
    }

    if (result['[[isNightwatch]]']) {
      delete result['[[isNightwatch]]'];

      return;
    }

    if (result.class) {
      delete result.class;
    }

    if (result.hCode) {
      delete result.hCode;
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
    result = result || {};
    response = response || {};

    const {status = '', value = null, code = '', message = null} = result;
    let errorMessage;
    let {state = ''} = result;

    if (code && message) {
      errorMessage = `Error ${code}: ${message}`;
    } else {
      errorMessage = response.statusCode === 404 ? 'Unknown command' : 'An unknown error has occurred';
    }

    if (screenshotContent) {
      this.reporter && this.reporter.saveErrorScreenshot(result, screenshotContent);
    }

    if (status) {
      let error = Errors.findErrorById(status);
      if (error) {
        errorMessage = Errors.findErrorById(result.status).message;
      }

      if (value && value.message) {
        errorMessage = `${errorMessage} – ${result.value.message}`;
      }
    } else if (response.statusCode && response.statusMessage) {
      errorMessage += ` ${response.statusCode} ${response.statusMessage}`;
    }

    if (response.headers && (response.headers['content-type'] === 'text/html' || response.headers['content-type'] === 'text/plain')) {
      errorMessage = errorMessage.replace(/(<([^>]+)>)/gi, ''); // strip html tags
    }

    if (errorMessage.length > 120) {
      errorMessage = errorMessage.substr(0, 120) + '...';
    }

    return {
      status: -1,
      state,
      code,
      value,
      errorStatus: status,
      error : errorMessage,
      httpStatusCode: response.statusCode || null
    };
  }

  static parseErrorDetails(result) {
    let errorDetails = result.localizedMessage ? result.localizedMessage : result.message;

    return errorDetails.split('\n');
  }
}

module.exports = JsonWireProtocol;
