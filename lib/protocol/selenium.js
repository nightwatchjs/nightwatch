const events = require('events');
const HttpRequest = require('../http/request.js');
const Reporter = require('../core/reporter.js');
const Logger = require('../util/logger.js');

module.exports = class SeleniumProtocol extends events.EventEmitter {
  constructor(desiredCapabilites, outputEnabled) {
    super();

    this.__outputEnabled = outputEnabled;
    this.__desiredCapabilites = desiredCapabilites;
  }

  get desiredCapabilites() {
    return this.__desiredCapabilites;
  }

  get outputEnabled() {
    return this.__outputEnabled;
  }

  createSession() {
    let request = new HttpRequest({
      path : '/session',
      data : {
        desiredCapabilities : this.desiredCapabilites
      }
    });

    request.on('error', function(err) {
      this.handleErrorResponse(err);
    })
    .on('success', (data, response, isRedirect) => {
      if (data && data.sessionId) {
        let sessionId = data.sessionId;
        let capabilities = data.value;

        this.emit('transport:session.create', {
          sessionId: sessionId,
          capabilities: capabilities || {}
        }, request, response);
      } else if (isRedirect) {
        this.followRedirect(request, response);
      } else {
        this.handleErrorResponse(data);
      }
    })
    .send();
  }

  handleErrorResponse(data) {
    let message = '';

    if (typeof data == 'object' && Object.keys(data).length > 0) {
      message = data.message || JSON.stringify(data);
    } else if (typeof data == 'string') {
      message = data;
    }

    if (this.outputEnabled) {
      Logger.error(`There was an error while retrieving a new session from the Selenium server:  
    ${Logger.colors.red(message)}
      `);
    }

    this.emit('transport:session.error', message, data);
  }

  followRedirect(request, response) {
    if (!response.headers || !response.headers.location) {
      this.emit('transport:session.error', null, null);
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
    /*
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
    */
    return new Promise((resolve, reject) => {
      new HttpRequest(requestOptions)
        .on('success', (result, response) => {
          if (result.status && result.status !== 0) {
            result = SeleniumProtocol.handleTestError(result);
          }

          resolve(result);
        })
        .on('error', function(result, response, screenshotContent) {
          result = SeleniumProtocol.handleTestError(result);

          if (screenshotContent) {
            Reporter.saveErrorScreenshot(screenshotContent)
          }

          resolve(result);
        }).send();
    });
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