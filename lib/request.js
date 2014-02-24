var util    = require('util'),
    events  = require('events'),
    qs      = require('querystring'),
    http    = require('http'),
    https   = require('https'),
    Logger  = require('./logger');

var Settings = {
  selenium_host : 'localhost',
  selenium_port : 4444,
  default_path  : '/wd/hub',
  credentials   : null,
  use_ssl       : false
}

var DO_NOT_LOG_ERRORS = [
  'Unable to locate element'
];

function HttpRequest(options) {
  events.EventEmitter.call(this);
  this.data       = options.data && JSON.stringify(options.data) || '';
  this.reqOptions = this.createOptions(options);
  this.request    = null;
}

util.inherits(HttpRequest, events.EventEmitter);

HttpRequest.prototype.createOptions = function(options) {
  var reqOptions = {
    path    : Settings.default_path + (options.path || ''),
    host    : options.host || Settings.selenium_host,
    port    : options.selenium_port || Settings.selenium_port,
    method  : options.method || 'POST',
    headers : {}
  };

  if (options.sessionId) {
    reqOptions.path = reqOptions.path.replace(':sessionId', options.sessionId);
  }

  if (reqOptions.method.toUpperCase() === 'GET') {
    reqOptions.headers['Accept'] = 'application/json';
  }

  if (this.data && this.data.length > 0) {
    reqOptions.headers['Content-Type']   = 'application/json';
    reqOptions.headers['Content-Length'] = this.data.length;
  }

  if (Settings.credentials &&
      Settings.credentials.username && Settings.credentials.key
    ) {
    var authHeader = new Buffer(Settings.credentials.username + ':' + Settings.credentials.key).toString('base64');
    reqOptions.headers['Authorization'] = 'Basic ' + authHeader;
  }

  return reqOptions;
}

HttpRequest.prototype.send = function() {
  var self = this;
  this.request = (Settings.use_ssl ? https: http).request(this.reqOptions, function (response) {
    response.setEncoding('utf8');

    if (response.statusCode === 302 || response.statusCode === 304) {
      Logger.info('Response ' + response.statusCode + ' ' + self.reqOptions.method + ' ' + self.reqOptions.path);
      try {
        self.emit('success', {}, response);
      } catch (ex) {
        console.log(ex.message);
        console.log(ex.stack);
        self.emit('error', {error:ex.message}, response);
      }

      self.emit('complete', response)
      return self;
    }

    var flushed = '';
    response.on('data', function (chunk) {
      if (self.reqOptions.method !== 'HEAD') {
        flushed += chunk;
      }
    });

    response.on('end', function () {
      var data = '', result, errorMessage = '';
      if (flushed) {
        result = parseResult(flushed);
        if (result.value) {
          if (result.value.screen) {
            var screenshotContent = result.value.screen;
            delete result.value.screen;
          }

          if (result.value.message && shouldLogErrorMessage(result.value.message)) {
            errorMessage = result.value.message.replace(/\n/g,'\n\t');
            delete result.value.message;
          }
        }
      } else {
        result = {};
      }

      if (errorMessage != '') {
        util.puts(Logger.colors.yellow('There was an error while executing the Selenium command') +
          (!Logger.isEnabled() ? ' - enabling the --verbose option might offer more details.' : '')
        );
        util.puts(errorMessage);
      }

      var logMethod = response.statusCode.toString().indexOf('5') == 0 ? 'error' : 'info';
      Logger[logMethod]('Response ' + response.statusCode + ' ' + self.reqOptions.method + ' ' + self.reqOptions.path, result);

      if (response.statusCode.toString().indexOf('2') === 0) {
        self.emit('success', result, response);
      } else {
        self.emit('error', result, response, screenshotContent);
      }

      self.emit('complete', response);
    });
  });

  this.request.on('error', function(response) {
    self.emit('error', {}, response);
  });

  Logger.info('Request: ' + this.reqOptions.method + ' ' + this.reqOptions.path,
    (this.data.length ? '\n - data: ' + this.data : ''), '\n - headers: ', JSON.stringify(this.reqOptions.headers));
  if (this.data.length > 0) {
    this.request.write(this.data);
  }

  this.request.end();

  return this;
}

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

function parseResult(data) {
  var result;
  data = stripUnknownChars(data);

  try {
    result = JSON.parse(data);
  } catch (err) {
    console.log(err.stack)
    result = {value: -1, error: err.message};
  }
  return result;
}

function shouldLogErrorMessage(msg) {
  return !DO_NOT_LOG_ERRORS.some(function(item) {
    return msg.indexOf(item) == 0
  })
}

function stripUnknownChars(str) {
  var x = [], i = 0, length = str.length;

  for (i; i < length; i++) {
    if (str.charCodeAt(i)) {
      x.push(str.charAt(i));
    }
  }

  return x.join('');
};

module.exports = HttpRequest;
