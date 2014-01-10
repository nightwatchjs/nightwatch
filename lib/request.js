var util = require("util"),
    events = require("events"),
    qs = require('querystring'),
    http = require('http'),
    Logger = require('./logger');

var Settings = {
  selenium_host : "localhost",
  selenium_port : 4444,
  default_path  : "/wd/hub"  
} 
var DO_NOT_LOG_ERRORS = [
  'Unable to locate element'
];
   
function HttpRequest(options) {
  events.EventEmitter.call(this);
  this.data = options.data && JSON.stringify(options.data) || "";
  this.requestOptions = this.createOptions(options);
  this.request = null;
}

util.inherits(HttpRequest, events.EventEmitter);

HttpRequest.prototype.createOptions = function(options) {
  var reqOptions = {
    host : options.host || Settings.selenium_host,
    port : options.port || Settings.selenium_port,
    method: options.method || "POST",
    path : Settings.default_path + (options.path || "")
  };
  
  if (options.sessionId) {
    reqOptions.path = reqOptions.path.replace(':sessionId', options.sessionId);
  }
  
  reqOptions.headers = {
    'content-type': 'application/json',
    'content-length':  this.data.length
  }
  
  return reqOptions;
}

HttpRequest.prototype.send = function() {
  var self = this;
  this.request = http.request(this.requestOptions, function (response) {
    response.setEncoding('utf8');
    
    if (response.statusCode === 302 || response.statusCode === 304) {
      Logger.info("Response " + response.statusCode + ' ' + self.requestOptions.method + " " + self.requestOptions.path);
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
      if (self.requestOptions.method !== 'HEAD') {
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
      Logger[logMethod]("Response " + response.statusCode + ' ' + self.requestOptions.method + " " + self.requestOptions.path, result);

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
  
  Logger.info("Request: " + this.requestOptions.method + " " + this.requestOptions.path, 
    "\n - data: ", this.data, "\n - headers: ", JSON.stringify(this.requestOptions.headers));
    
  this.request.write(this.data);
  this.request.end();
  
  return this;
}

HttpRequest.setSeleniumPort = function(port) {
  Settings.selenium_port = port;  
};
HttpRequest.setSeleniumHost = function(host) {
  Settings.selenium_host = host;  
};

function parseResult(data) {
  var result;
  data = stripUnknown(data);
  
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

function stripUnknown(str) {
  var x = [],
      i = 0,
      il = str.length;

  for (i; i < il; i++) {
    if (str.charCodeAt(i)) {
      x.push(str.charAt(i));
    }
  }

  return x.join('');
};

module.exports = HttpRequest;