const events = require('events');
const Element = require('../page-object/element.js');
const HttpRequest = require('../http/request.js');
const Reporter = require('../core/reporter.js');
const Logger = require('../util/logger.js');
const Errors = require('./selenium/errors.js');
const TransportActions = require('./selenium/actions.js');

let __defaultSettings__ = {
  host           : 'localhost',
  port           : 4444,
  default_path   : '/wd/hub'
};

class SeleniumProtocol extends events.EventEmitter {
  constructor(desiredCapabilites) {
    super();

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
    return TransportActions;
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

  /**
   *
   * @param {Element} elem
   * @param callback
   * @return {function}
   */
  filterElementsForCallback(elem, callback) {
    return function elementsCallbackWrapper(result) {
      if (result && result.status === Errors.StatusCode.SUCCESS) {
        let filtered = Element.applyFiltering(elem, result.value);

        if (filtered) {
          result.value = filtered;
        } else {
          result.status = -1;
          result.value = [];

          let errorId = Errors.Status.NO_SUCH_ELEMENT;
          let errorInfo = Errors.findErrorById(errorId);

          if (errorInfo) {
            result.message = errorInfo.message;
            result.errorStatus = errorInfo.status;
          }
        }
      }

      return callback(result);
    };
  }

  resolveElement(result, multipleElements) {
    if (result.status !== Errors.StatusCode.SUCCESS) {
      return null;
    }

    return multipleElements ? result.value[0].ELEMENT : result.value.ELEMENT;
  }

  /**
   *
   * @param {Element} element
   * @param {string} sessionId
   * @param {string} compositeCommand
   * @param {Array} args
   */
  executeElementCommand(element, sessionId, compositeCommand, args) {
    let multipleElements = Element.requiresFiltering(element);

    let elementAction = multipleElements ?
      TransportActions.locateMultipleElements :
      TransportActions.locateSingleElement;

    return elementAction.call(TransportActions, {
      args: [element.locateStrategy, element.selector],
      sessionId: sessionId
    })
    .then(result => {
      let elementId = this.resolveElement(result);
      if (elementId) {
        let protocolAction = TransportActions.elementApiMappings[compositeCommand];
        args.unshift(elementId);

        return TransportActions[protocolAction]({
          args: args,
          sessionId: sessionId
        });
      }
    });
  }

  static runProtocolAction(requestOptions) {
    let request = new HttpRequest(requestOptions);

    return new Promise((resolve, reject) => {

      request.on('success', (result, response) => {
        if (result.status && result.status !== Errors.StatusCode.SUCCESS) {
          result = SeleniumProtocol.handleTestError(result);
        }

        resolve(result);
      })
      .on('error', function(result, response, screenshotContent) {
        result = SeleniumProtocol.handleTestError(result);

        if (screenshotContent) {
          Reporter.saveErrorScreenshot(screenshotContent);
        }

        resolve(result);
      }).send();

    });

  }

  static handleTestError(result) {
    let errorMessage = '';
    if (result && result.status && (result.status in Errors.Response)) {
      errorMessage = Errors.Response[result.status].message;
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