const events = require('events');
const TransportActions = require('./selenium/actions.js');
const HttpRequest = require('../http/request.js');
const Reporter = require('../core/reporter.js');
const Logger = require('../util/logger.js');

let __defaultSettings__ = {
  host           : 'localhost',
  port           : 4444,
  default_path   : '/wd/hub'
};

class SeleniumProtocol extends events.EventEmitter {
  constructor(desiredCapabilites) {
    super();

    this.__actions = new TransportActions();
    this.__desiredCapabilites = desiredCapabilites;
  }

  get desiredCapabilites() {
    return this.__desiredCapabilites;
  }

  get defaultPathPrefix() {
    return __defaultSettings__.default_path;
  }

  get defaultPort() {
    return __defaultSettings__.port;
  }

  get Actions() {
    return this.__actions;
  }

  createSession() {
    let request = new HttpRequest({
      path : '/session',
      data : {
        desiredCapabilities : this.desiredCapabilites
      }
    });

    request.on('error', err => {
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
    .post();
  }

  terminateSession(sessionId) {
    let request = new HttpRequest({
      path : `/session/${sessionId}`
    });

    request.on('complete', response => {
      this.emit('transport:session.destroy', response);
    }).delete();

    return this;
  }

  handleErrorResponse(data) {
    let message = '';

    if (typeof data == 'object' && Object.keys(data).length > 0) {
      message = data.message || JSON.stringify(data);
    } else if (typeof data == 'string') {
      message = data;
    }

    Logger.error(`There was an error while retrieving a new session from the Selenium server:  
    ${Logger.colors.red(message)}
    `);

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
      port   : urlParts.port
    }).send();

    return this;
  }

  static runProtocolAction(requestOptions) {

    // TODO: Use Promise
    let request = new HttpRequest(requestOptions);

    request.on('success', (result, response) => {
      if (result.status && result.status !== 0) {
        result = SeleniumProtocol.handleTestError(result);
      }

      request.emit('result', result);
    })
    .on('error', function(result, response, screenshotContent) {
      result = SeleniumProtocol.handleTestError(result);

      if (screenshotContent) {
        Reporter.saveErrorScreenshot(screenshotContent)
      }

      request.emit('result', result);
    }).send();

    return request;

  }

  static handleTestError(result) {
    let errorMessage = '';
    if (result && result.status) {
      let errorCodes = require('./selenium/errors.json');
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

module.exports = SeleniumProtocol;