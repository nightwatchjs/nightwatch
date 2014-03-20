/*!
 * Module dependencies.
 */
var util = require('util');
var fs = require('fs');
var path = require('path');
var events = require('events');
var HttpRequest = require('./request.js');
var CommandQueue = require('./queue.js');
var Assertion = require('./assertion.js');
var Logger = require('./logger.js');
var Api = require('./api.js');

function Nightwatch(options) {
  var self = this;
  events.EventEmitter.call(this);

  this.locateStrategy = 'css selector';
  this.api = {
    capabilities : {},
    globals : {},
    sessionId : null,
    useXpath : function() {
      self.locateStrategy = 'xpath';
      return this;
    },
    useCss : function() {
      self.locateStrategy = 'css selector';
      return this;
    }
  };
  this.setMaxListeners(0);
  this.sessionId = null;
  this.context = null;
  this.terminated = false;

  this.setOptions(options);
  this.setCapabilities();

  this.errors = [];
  this.results = {
    passed:0,
    failed:0,
    errors:0,
    skipped:0,
    tests:[]
  };

  Assertion.init(this);
  Api.init(this).load();

  this.queue = CommandQueue;
  this.queue.empty();
  this.queue.reset();
}

Nightwatch.DEFAULT_CAPABILITIES = {
  browserName: 'firefox',
  javascriptEnabled: true,
  acceptSslCerts: true,
  platform: 'ANY'
};

util.inherits(Nightwatch, events.EventEmitter);

Nightwatch.prototype.assertion = Assertion.assert;

Nightwatch.prototype.setOptions = function(options) {
  this.options = options || {};

  this.api.launchUrl = this.options.launchUrl || this.options.launch_url || null;
  // backwords compatibility
  this.api.launch_url = this.api.launchUrl;

  if (this.options.globals) {
    if (typeof this.options.globals == 'object') {
      for (var globalKey in this.options.globals) {
        this.api.globals[globalKey] = this.options.globals[globalKey];
      }
    }
  }

  var screenshots = this.options.screenshots;
  if (screenshots && screenshots.enabled) {
    if (!screenshots.path || !fs.existsSync(screenshots.path)) {
      throw new Error('A valid path for screenshots.path must be specified.');
    }

    this.api.screenshotsPath = screenshots.path;
  } else {
    this.options.screenshots = {
      'enabled' : false,
      'path' : ''
    };
  }

  this.options.output = this.options.output || typeof this.options.output === 'undefined';

  if (this.options.silent) {
    Logger.disable();
  } else {
    Logger.enable();
  }

  var seleniumPort = this.options.seleniumPort || this.options.selenium_port;
  var seleniumHost = this.options.seleniumHost || this.options.selenium_host;
  var useSSL       = this.options.useSsl || this.options.use_ssl;

  if (seleniumPort) {
    HttpRequest.setSeleniumPort(seleniumPort);
  }
  if (seleniumHost) {
    HttpRequest.setSeleniumHost(seleniumHost);
  }
  if (useSSL) {
    HttpRequest.useSSL(true);
  }

  var username = this.options.username;
  var key = this.options.accesKey || this.options.access_key || this.options.password;

  if (username && key) {
    HttpRequest.setCredentials({
      username : username,
      key : key
    });
  }

  return this;
};

Nightwatch.prototype.setCapabilities = function() {
  this.desiredCapabilities = Nightwatch.DEFAULT_CAPABILITIES;
  if (this.options.desiredCapabilities) {
    for (var prop in this.options.desiredCapabilities) {
      if (this.options.desiredCapabilities.hasOwnProperty(prop)) {
        this.desiredCapabilities[prop] = this.options.desiredCapabilities[prop];
      }
    }
  }
};

Nightwatch.prototype.start = function() {
  if (!this.sessionId) {
    this.startSession().once('selenium:session_create', this.start);
    return this;
  }

  var self = this;

  this.queue.reset();
  this.queue.run(function(error) {
    if (error) {
      var stackTrace = '';
      if (error.stack) {
        stackTrace = '\n' + error.stack.split('\n').slice(1).join('\n');
      }

      self.results.errors++;
      self.errors.push(error.name + ': ' + error.message + stackTrace);
      self.terminate();
      return;
    }
    Logger.info('FINISHED');
    self.emit('queue:finished', self.results, self.errors);
    self.printResult();
  });
  return this;
};

Nightwatch.prototype.terminate = function() {
  var self = this;
  this.results.skipped = this.queue.getSkipped();
  this.terminated = true;
  this.queue.reset();
  this.queue.empty();

  this.enqueueCommand('session', ['delete'], function(result) {
    self.emit('queue:finished', self.results, self.errors);
    self.printResult();
  });

  return this;
};

Nightwatch.prototype.complete = function() {
  return this.emit('complete');
};

Nightwatch.prototype.printResult = function() {
  if (!this.options.output) {
    return;
  }
  var ok = false;
  if (this.results.failed === 0 && this.results.errors === 0) {
    ok = true;
  }

  if (ok && this.results.passed > 0) {
    console.log(Logger.colors.green('OK.'),
      Logger.colors.green(this.results.passed) + ' assertions passed.');
  } else if (ok && this.results.passed === 0) {
    console.log(Logger.colors.green('No assertions ran.'));
  } else {
    var errors = '';
    if (this.results.errors) {
      errors = this.results.errors + ' errors during the test. ';
      for (var i = 0; i < this.errors.length; i++) {
        console.log(Logger.colors.red(this.errors[i]));
      }
    }
    var failure_msg = [];
    if (this.results.failed > 0) {
      failure_msg.push(Logger.colors.red(this.results.failed) +
        ' assertions failed');
    }
    if (this.results.errors > 0) {
      failure_msg.push(Logger.colors.red(this.results.errors) + ' errors');
    }
    if (this.results.passed > 0) {
      failure_msg.push(Logger.colors.green(this.results.passed) + ' passed');
    }
    if (this.results.skipped > 0) {
      failure_msg.push(Logger.colors.blue(this.results.skipped) + ' skipped');
    }

    console.log(Logger.colors.red('FAILED: '), failure_msg.join(', ')
      .replace(/,([^,]*)$/g, function($0, $1) {
      return  ' and' + $1;
    }));
  }

  this.errors.length = 0;
  this.results.passed = 0;
  this.results.failed = 0;
  this.results.errors = 0;
  this.results.skipped = 0;
  this.results.tests.length = 0;
};

Nightwatch.prototype.runProtocolAction = function(requestOptions, callback) {
  var self = this;

  var request = new HttpRequest(requestOptions);
  request.on('success', function(result, response) {
    if (result.status && result.status !== 0) {
      result = self.handleTestError(result);
    }
    request.emit('result', result, response);
  })
  .on('error', function(result, response, screenshotContent) {
    result = self.handleTestError(result);
    if (screenshotContent && self.options.screenshots.enabled) {
      var d = new Date();
      var dateStamp = d.toLocaleString('en-GB', {
        weekday       : 'narrow',
        year          : 'numeric',
        month         : '2-digit',
        day           : '2-digit',
        timeZoneName  : 'short',
        hour          : '2-digit',
        minute        : '2-digit',
        second        : '2-digit',
        era           : 'short'
      }).replace(/:/g,'').replace(/\s/g,'-').replace(/-\(.+?\)/,'');

      var fileName = path.join(self.options.screenshots.path, 'ERROR_' +
        dateStamp + '.png');
      self.saveScreenshotToFile(fileName, screenshotContent);
    }

    request.emit('result', result, response);
  })
  .on('result', function(result) {
    if (callback) {
      try {
        if (typeof callback != 'function') {
          var error = new Error('Callback parameter is not a function - ' + typeof(callback) + ' passed: "' + callback + '"');
          self.errors.push(error.stack);
          self.results.errors++;
        } else {
          callback.call(self.api, result);
        }
      } catch (ex) {
        self.errors.push('Error while running tests: ' + ex.message);
        var stack = ex.stack.split('\n');
        var firstLine = stack.shift();
        console.log('    ' + Logger.colors.light_green(firstLine));
        console.log(stack.join('\n'));

        self.results.errors++;
      }
    }
  });

  return request;
};


Nightwatch.prototype.enqueueCommand = function(commandName, args, callback) {
  if (commandName in this.api) {
    args.push(callback);
    this.api[commandName].apply(this.api, args);
  } else {
    this.results.errors++;
    var error = new Error('No such command: ' + commandName);
    this.errors.push(error.stack);
    throw error;
  }

  return this.queue.run();
};

Nightwatch.prototype.saveScreenshotToFile = function(fileName, content) {
  fs.writeFile(fileName, content, 'base64', function(err) {
    if (err) {
      console.log(Logger.colors.yellow('Couldn\'t save screenshot to '), fileName);
      Logger.warn(err);
    }
  });
};

Nightwatch.prototype.handleTestError = function(result) {
  var errorMessage = '';
  if (result && result.status) {
    var errorCodes = require('./selenium/errors.json');
    errorMessage = errorCodes[result.status] && errorCodes[result.status].message || '';
  }

  return {
    status: -1,
    value : result && result.value || null,
    errorStatus: result && result.status || '',
    error : errorMessage
  };
};

Nightwatch.prototype.startSession = function() {
  var self = this;
  var request = new HttpRequest({
    path : '/session',
    data : {
      desiredCapabilities : this.desiredCapabilities,
      sessionId : null
    }
  });

  request.on('success', function(data, response) {
    if (data.sessionId) {
      self.sessionId = self.api.sessionId = data.sessionId;
      if (data.value) {
        self.api.capabilities = data.value;
      }
      Logger.info('Got sessionId from selenium', self.sessionId);
      self.emit('selenium:session_create', self.sessionId, request, response);
    } else {
      Logger.warn('Couldn\'t retrieve a new session from selenium server.');
    }
  })
  .on('error', function(data, err) {
    console.error(Logger.colors.red('Connection refused!'),
      'Is selenium server started?');
    self.emit('error', data, err);
  })
  .send();

  return this;
};

exports.client = function(options) {
  return new Nightwatch(options);
};

