const events = require('events');
const HttpRequest = require('../http/request.js');
const Reporter = require('../core/reporter.js');

module.exports = class SeleniumProtocol extends events.EventEmitter {
  constructor(desiredCapabilites) {
    super();

    this.__desiredCapabilites = desiredCapabilites;
  }

  get desiredCapabilites() {
    return this.__desiredCapabilites;
  }

  createSession() {
    let request = new HttpRequest({
      path : '/session',
      data : {
        desiredCapabilities : this.desiredCapabilites
      }
    });

    request.on('error', function(err) {
      let message = '';
      if (typeof err == 'object' && Object.keys(data).length > 0) {
        message = err.message || JSON.stringify(err);
      } else if (typeof err == 'string') {
        message = err;
      }

      this.emit('error', message, err);
    })
    .on('success', (data, response, isRedirect) => {
      if (data && data.sessionId) {
        let sessionId = data.sessionId;
        let capabilities = data.value;

        this.emit('session:create', {
          sessionId: sessionId,
          capabilities: capabilities || {}
        }, request, response);
      } else if (isRedirect) {
        this.followRedirect(request, response);
      } else {
        request.emit('error', data);
      }
    })
    .send();
  }

  followRedirect(request, response) {
    if (!response.headers || !response.headers.location) {
      this.emit('error', null, null);
      return this;
    }

    const url = require('url');
    let urlParts = url.parse(response.headers.location);
    request.setOptions({
      path   : urlParts.pathname,
      host   : urlParts.hostname,
      port   : urlParts.port,
      method : 'GET'
    }).send();

    return this;
  }

  runProtocolAction(requestOptions, callback) {
    let request = new HttpRequest(requestOptions)
      .on('result', function(result) {
        if (typeof callback != 'function') {
          let error = new Error(`Callback parameter is not a function - ${typeof(callback)} passed: "${callback}".`);
          Reporter.registerTestError(error);
        } else {
          callback.call(self.api, result);
        }

        request.emit('complete');
      })
      .on('success', (result, response) => {
        if (result.status && result.status !== 0) {
          result = SeleniumProtocol.handleTestError(result);
        }

        request.emit('result', result, response);
      })
      .on('error', function(result, response, screenshotContent) {
        result = SeleniumProtocol.handleTestError(result);

        if (screenshotContent) {
          Reporter.saveErrorScreenshot(screenshotContent)
        }

        request.emit('result', result, response);
      });

    return request;
  }

  static handleTestError(result) {
    let errorMessage = '';
    if (result && result.status) {
      let errorCodes = require('../api/errors.json');
      errorMessage = errorCodes[result.status] && errorCodes[result.status].message || '';
    }

    return {
      status: -1,
      value : result && result.value || null,
      errorStatus: result && result.status || '',
      error : errorMessage
    };
  }
}