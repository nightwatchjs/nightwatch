var util   = require('util');
var events = require('events');
var http   = require('http');
var https  = require('https');
var Logger = require('./../util/logger');

module.exports = (function() {
  var Settings = {
    selenium_host : 'localhost',
    selenium_port : 4444,
    default_path  : '/wd/hub',
    credentials   : null,
    use_ssl       : false
  };

  var DO_NOT_LOG_ERRORS = [
    'Unable to locate element',
    '{"errorMessage":"Unable to find element',
    'no such element'
  ];

  function HttpRequest(options) {
    events.EventEmitter.call(this);
    this.setOptions(options);
  }

  util.inherits(HttpRequest, events.EventEmitter);

  HttpRequest.prototype.setOptions = function(options) {
    this.data          = options.data && jsonStringify(options.data) || '';
    this.contentLength = this.data.length;
    this.reqOptions    = this.createOptions(options);
    this.hostname      = formatHostname(this.reqOptions.host, this.reqOptions.port);
    this.request       = null;

    return this;
  };

  HttpRequest.prototype.setPathPrefix = function(options) {
    this.defaultPathPrefix = options.path && options.path.indexOf(Settings.default_path) === -1 ?
      Settings.default_path : '';
    return this;
  };

  HttpRequest.prototype.createOptions = function(options) {
    this.setPathPrefix(options);

    var reqOptions = {
      path    : this.defaultPathPrefix + (options.path || ''),
      host    : options.host || Settings.selenium_host,
      port    : options.selenium_port || Settings.selenium_port,
      method  : options.method || 'POST',
      headers : {}
    };
    var requestMethod = reqOptions.method.toUpperCase();
    if (options.sessionId) {
      reqOptions.path = reqOptions.path.replace(':sessionId', options.sessionId);
    }

    if (requestMethod === 'GET') {
      reqOptions.headers['Accept'] = 'application/json';
    }

    if (this.contentLength > 0) {
      reqOptions.headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    if (needsContentLengthHeader(requestMethod)) {
      reqOptions.headers['Content-Length'] = this.contentLength;
    }

    if (Settings.credentials &&
      Settings.credentials.username && Settings.credentials.key
      ) {
      var authHeader = new Buffer(Settings.credentials.username + ':' + Settings.credentials.key).toString('base64');
      reqOptions.headers['Authorization'] = 'Basic ' + authHeader;
    }

    return reqOptions;
  };

  HttpRequest.prototype.send = function() {
    var self = this;

    this.request = (Settings.use_ssl ? https: http).request(this.reqOptions, function (response) {
      response.setEncoding('utf8');
      var redirected = false;
      if (isRedirect(response.statusCode)) {
        redirected = true;
      }

      var flushed = '';
      response.on('data', function (chunk) {
        if (self.reqOptions.method !== 'HEAD') {
          flushed += chunk;
        }
      });

      response.on('end', function () {
        var screenshotContent;
        var result, errorMessage = '';
        if (flushed) {
          result = parseResult(flushed);
          if (result.value) {
            if (result.value.screen) {
              screenshotContent = result.value.screen;
              delete result.value.screen;
            }

            if (result.value.stackTrace) {
              // Selenium stack traces won't help us here and they will pollute the output
              delete result.value.stackTrace;
            }

            if (needsFormattedErrorMessage(result)) {
              errorMessage = formatErrorMessage(result.value);
              delete result.value.localizedMessage;
              delete result.value.message;
            }
          }
        } else {
          result = {};
        }

        if (errorMessage !== '') {
          console.log(Logger.colors.yellow('There was an error while executing the Selenium command') +
            (!Logger.isEnabled() ? ' - enabling the --verbose option might offer more details.' : '')
          );
          console.log(errorMessage);
        }

        self.emit('beforeResult', result);

        var base64Data;
        if (result.suppressBase64Data) {
          base64Data = result.value;
          result.value = '';
        }

        var logMethod = response.statusCode.toString().indexOf('5') === 0 ? 'error' : 'info';
        Logger[logMethod]('Response ' + response.statusCode + ' ' + self.reqOptions.method + ' ' + self.hostname + self.reqOptions.path, result);

        if (result.suppressBase64Data) {
          result.value = base64Data;
        }

        if (response.statusCode.toString().indexOf('2') === 0 || redirected) {
          self.emit('success', result, response, redirected);
        } else {
          self.emit('error', result, response, screenshotContent);
        }
      });
    });

    this.request.on('error', function(response) {
      self.emit('error', {}, response);
    });

    Logger.info('Request: ' + this.reqOptions.method + ' ' + this.hostname + this.reqOptions.path,
      '\n - data: ', this.data, '\n - headers: ', JSON.stringify(this.reqOptions.headers));

    this.request.write(this.data);
    this.request.end();

    return this;
  };

  /**
   *
   * @param s
   * @param emit_unicode
   * @returns {string}
   */
  HttpRequest.JSON_stringify = function(s, emit_unicode) {
    var json = JSON.stringify(s);
    if (json) {
      return emit_unicode ? json : json.replace(jsonRegex, jsonRegexReplace);
    }
  };

  HttpRequest.setSeleniumPort = function(port) {
    Settings.selenium_port = port;
  };
  HttpRequest.useSSL = function(value) {
    Settings.use_ssl = value;
  };
  HttpRequest.setSeleniumHost = function(host) {
    Settings.selenium_host = host;
  };
  HttpRequest.setCredentials = function(credentials) {
    Settings.credentials = credentials;
  };
  ///////////////////////////////////////////////////////////
  // Helpers
  ///////////////////////////////////////////////////////////
  var jsonRegex = new RegExp('[\\u007f-\\uffff]', 'g');
  var jsonRegexReplace = function(c) {
    return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
  };

  /**
   * Built in JSON.stringify() will return unicode characters that require UTF-8 encoding on the wire.
   * This function will replace unicode characters with their escaped (ASCII-safe) equivalents to support
   * the keys sending command.
   *
   * @param {object} s
   * @returns {string}
   */
  function jsonStringify(s) {
    var json = JSON.stringify(s);
    if (json) {
      return json.replace(jsonRegex, jsonRegexReplace);
    }

    return json;
  }

  function formatHostname(hostname, port) {
    var isLocalHost = ['127.0.0.1', 'localhost'].indexOf(hostname) > -1;
    var protocol = Settings.use_ssl ? 'https://' : 'http://';
    var isPortDefault = [80, 443].indexOf(port) > -1;
    if (isLocalHost) {
      return '';
    }
    return protocol + hostname + (!isPortDefault && (':' + port) || '');
  }

  function isRedirect(statusCode) {
    return [302, 303, 304].indexOf(statusCode) > -1;
  }

  function needsContentLengthHeader(requestMethod) {
    return ['POST', 'DELETE'].indexOf(requestMethod) > -1;
  }

  function needsFormattedErrorMessage(result) {
    return !!(result.localizedMessage || result.message);
  }

  function hasLocalizedMessage(result) {
    return !!result.localizedMessage;
  }

  function formatErrorMessage(info) {
    var msg = hasLocalizedMessage(info) ? info.localizedMessage : info.message;
    if (shouldLogErrorMessage(msg)) {
      msg = msg.replace(/\n/g, '\n\t');
    }
    return msg;
  }

  function parseResult(data) {
    var result;
    data = stripUnknownChars(data);

    try {
      result = JSON.parse(data);
    } catch (err) {
      console.log(Logger.colors.red('Error processing the server response:'), '\n', data);
      result = {value: -1, error: err.message};
    }
    return result;
  }

  function shouldLogErrorMessage(msg) {
    return !DO_NOT_LOG_ERRORS.some(function(item) {
      return msg.indexOf(item) === 0;
    });
  }

  function stripUnknownChars(str) {
    var x = [], i = 0, length = str.length;

    for (i; i < length; i++) {
      if (str.charCodeAt(i)) {
        x.push(str.charAt(i));
      }
    }
    return x.join('');
  }

  return HttpRequest;
})();
