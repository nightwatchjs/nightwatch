var util = require('util'),
    fs = require('fs'),
    path = require('path'),
    events = require('events'),
    HttpRequest = require('./request.js'),
    CommandQueue = require('./queue.js'),
    Logger = require('./logger.js');

function Nightwatch(options) {
  events.EventEmitter.call(this);
  this.setMaxListeners(0);
  this.options = options || {};

  var self = this;
  this.sessionId = null;
  this.context = null;
  this.terminated = false;
  this.capabilities = {};

  if (!this.options.screenshots) {
    this.options.screenshots = {
      'enabled' : false,
      'path' : ''
    };
  }

  this.options.output = this.options.output || typeof this.options.output == 'undefined';
  this.screenshotPath = this.options.screenshotPath || '';
  this.launch_url = this.options.launch_url || null;

  if (this.options.silent) {
    Logger.disable();
  } else {
    Logger.enable();
  }

  if (this.options.selenium_port) {
    HttpRequest.setSeleniumPort(this.options.selenium_port);
  }
  if (this.options.selenium_host) {
    HttpRequest.setSeleniumHost(this.options.selenium_host);
  }
  if (this.options.use_ssl) {
    HttpRequest.useSSL(true);
  }
  if (this.options.username && this.options.access_key) {
    HttpRequest.setCredentials({
      username : this.options.username,
      key : this.options.access_key
    });
  }
  this.desiredCapabilities = {
    browserName: 'firefox',
    javascriptEnabled: true,
    acceptSslCerts: true,
    platform: 'ANY'
  };

  if (this.options.desiredCapabilities) {
    for (var prop in this.options.desiredCapabilities) {
      this.desiredCapabilities[prop] = this.options.desiredCapabilities[prop];
    }
  }
  this.errors = [];
  this.results = {
    passed:0,
    failed:0,
    errors:0,
    skipped:0,
    tests:[]
  };

  this.queue = CommandQueue;
  this.queue.empty();
  this.queue.reset();

  this.loadProtocolActions()
      .loadCommands()
      .addVerifyTests()
      .loadAssertions();

  if (this.options.custom_commands_path) {
    this.loadCustomCommands();
  }
}

util.inherits(Nightwatch, events.EventEmitter);

Nightwatch.prototype.start = function() {
  if (!this.sessionId) {
    this.startSession().once('selenium:session_create', this.start);
    return this;
  }

  var self = this;

  this.queue.reset();
  this.queue.run(function(error) {
    if (error) {
      self.results.errors++;
      self.errors.push(error.name + ': ' + error.message);
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

  this.runCommand('session', ['delete'], function(result) {
    self.emit('queue:finished', self.results, self.errors);
    self.printResult();
  });

  return this;
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
    console.log(Logger.colors.green('OK.'), Logger.colors.green(this.results.passed) + ' assertions passed.');
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
      failure_msg.push(Logger.colors.red(this.results.failed) + ' assertions failed');
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

    console.log(Logger.colors.red('FAILED: '), failure_msg.join(', ').replace(/,([^,]*)$/g, function($0, $1, index, str) {
      return  ' and' +$1;
    }));
  }

  this.errors.length = 0;
  this.results.passed = 0;
  this.results.failed = 0;
  this.results.errors = 0;
  this.results.skipped = 0;
  this.results.tests.length = 0;
};

Nightwatch.prototype.loadProtocolActions = function() {
  var protocol = require('./selenium/protocol.js');
  var actions  = Object.keys(protocol.actions);
  var self = this;
  actions.forEach(function(command, index) {
    self.addCommand(command, protocol.actions[command], self);
  });

  return this;
};

Nightwatch.prototype.loadCommands = function() {
  require('./selenium/commands.js').addCommands.call(this);
  return this;
};

Nightwatch.prototype.loadCustomCommands = function() {
  var absPath = path.join(process.cwd(), this.options.custom_commands_path);
  var commandFiles = fs.readdirSync(absPath);
  var self = this;

  commandFiles.forEach(function(file) {
    if (path.extname(file) == '.js') {
      var command = require(path.join(absPath, file));
      var name = path.basename(file, '.js');
      if (typeof command === 'function') {
        command = new command();
        command.client = self;
        self.addCommand(name, command.command, command, self);
      } else {
        self.addCommand(name, command.command, self, self);
      }
    }
  });
};

Nightwatch.prototype.loadAssertions = function() {
  var self = this;
  var assertModule = require('assert');

  this.assert = {};

  for (var prop in assertModule) {
    if (assertModule.hasOwnProperty(prop)) {
      this.assert[prop] = (function(prop) {
          return function() {
            var passed, message, expected = null;
            var actual = arguments[0];

            message = typeof arguments[arguments.length-1] == 'string' &&
                        (arguments.length > 2 || typeof arguments[0] === 'boolean') &&
                        arguments[arguments.length-1] ||
                        (typeof arguments[0] === 'function' && '[Function]') ||
                        '' + actual;

            try {
              assertModule[prop].apply(null, arguments);
              passed = true;
              message = 'Assertion passed: ' + message;
            } catch (ex) {
              passed = false;
              message = 'Assertion failed: ' + (ex.message || message);
              actual = ex.actual;
              expected = ex.expected;
            }
            return self.assertion(passed, actual, expected, message, true);
          };
      })(prop);
    }
  }

  this.loadAssertionFiles(this.assert, true);

  if (this.options.custom_assertions_path) {
    this.loadCustomAssertions(this.assert, true);
  }
};

Nightwatch.prototype.addVerifyTests = function() {
  this.verify = {};
  this.loadAssertionFiles(this.verify, false);

  if (this.options.custom_assertions_path) {
    this.loadCustomAssertions(this.verify, false);
  }

  return this;
};

Nightwatch.prototype.loadAssertionFiles = function(parent, abortOnFailure) {
  var relativePath = './selenium/assertions/';
  var commandFiles = fs.readdirSync(path.join(__dirname, relativePath));

  for (var i = 0, len = commandFiles.length; i < len; i++) {
    if (path.extname(commandFiles[i]) == '.js') {
      var commandName = path.basename(commandFiles[i], '.js');
      var Module = require(path.join(__dirname, relativePath) + commandFiles[i]);
      var m = new Module();
      AbstractAssertion.call(m, abortOnFailure, this);
      this.addCommand(commandName, m.command, m, parent);
    }
  }
};

Nightwatch.prototype.loadCustomAssertions = function(parent, abortOnFailure) {
  var absPath = path.join(process.cwd(), this.options.custom_assertions_path);
  var assertionFiles = fs.readdirSync(absPath);
  var self = this;

  assertionFiles.forEach(function(file) {
    if (path.extname(file) == '.js') {
      var Module = require(path.join(absPath, file));
      var name = path.basename(file, '.js');
      var m = new Module();
      AbstractAssertion.call(m, abortOnFailure, self);
      self.addCommand(name, m.command, m, parent);
    }
  });
};

Nightwatch.prototype.addCommand = function(name, command, context, parent) {
  parent = parent || this;
  if (parent[name]) {
    this.results.errors++;
    var error = new Error('The command "' + name + '" is already defined!');
    this.errors.push(error.stack);
    throw error;
  }
  var self = this;
  parent[name] = (function(internalCommandName) {
    return function() {
      var args = Array.prototype.slice.call(arguments);
      CommandQueue.add(internalCommandName, command, context, args);
      return self;
    };
  })(name);

  return this;
};

/**
 *
 * @param {Object} requestOptions
 * @param {Function} callback
 */
Nightwatch.prototype.runProtocolCommand = function(requestOptions, callback) {
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
      var datestamp = d.toLocaleString('en-GB', {
        weekday: 'narrow',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZoneName : 'short',
        hour : '2-digit',
        minute : '2-digit',
        second : '2-digit',
        era : 'short'
      }).replace(/:/g,'').replace(/\s/g,'-').replace(/-\(.+?\)/,'');
      var fileName = path.join(self.options.screenshots.path, 'ERROR_' + datestamp + '.png');
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
          callback.call(self, result);
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

Nightwatch.prototype.runCommand = function(commandName, args, callback) {
  var self = this;

  if (commandName in this) {
    args.push(callback);
    this[commandName].apply(this, args);
  } else {
    this.results.errors++;
    var error = new Error('No such command: ' + commandName);
    this.errors.push(error.stack);
    throw error;
  }

  return this.queue.run();
};

Nightwatch.prototype.getElement = function(using, value, callback) {
  var self = this;
  return this.runCommand('element', [using, value, function(result) {
    if (result.status === 0) {
      callback.call(self, result.value.ELEMENT, result);
    } else {
      callback.call(self, false, result);
    }
  }]);
};

Nightwatch.prototype.assertion = function(passed, receivedValue, expectedValue, message, abortOnFailure, stripExpected) {
  var failure = '', stacktrace = '';

  if (passed) {
    if (this.options.output) {
      console.log(Logger.colors.green('✔') + '  ' + message);
    }
    this.results.passed++;
  } else {
    failure = 'Expected "' + expectedValue + '" but got: "' + receivedValue + '"';
    try {
      var err = new Error();
      err.name = 'Assertion failed in: ' + message;
      err.message = failure;
      Error.captureStackTrace(err, arguments.callee);
      throw err;
    } catch (ex) {
      stripExpected = stripExpected || false;
      var logged = Logger.colors.red('✖') + '  ' + message;
      if (typeof expectedValue != 'undefined' && typeof receivedValue != 'undefined') {
        logged += stripExpected ? (' ' + Logger.colors.white(' - expected ' + Logger.colors.green('"' +
          expectedValue + '"')) + ' but got: ' + Logger.colors.red(receivedValue)) : '';
      }

      if (this.options.output) {
        console.log(logged);
      }
      stacktrace = ex.stack;
    }
    this.results.failed++;
  }

  this.results.tests.push({
    message : message,
    stacktrace : stacktrace,
    failure : failure !== '' ? failure : false
  });

  if (!passed && abortOnFailure) {
    this.terminate();
  }
  return this;
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

  var rv = {
    status: -1,
    value : result && result.value || null,
    errorStatus: result && result.status || '',
    error : errorMessage
  };

  return rv;
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
      self.sessionId = data.sessionId;
      if (data.value) {
        self.capabilities = data.value;
      }
      Logger.info('Got sessionId from selenium', self.sessionId);
      self.emit('selenium:session_create', self.sessionId, request, response);
    } else {
      Logger.warn('Couldn\'t retrieve a new session from selenium server.');
    }
  })
   .on('error', function(data, err) {
     console.error(Logger.colors.red('Connection refused!'), 'Is selenium server started?');
     self.emit('error', data, err);
   })
   .send();

  return this;
};

function AbstractAssertion(abortOnFailure, client) {
  this.abortOnFailure = abortOnFailure;
  this.client = client;
}

exports.client = function(options) {
  return new Nightwatch(options);
};

