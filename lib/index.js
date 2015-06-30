/*!
 * Module dependencies.
 */
var path = require('path');
var util = require('util');
var events = require('events');
var HttpRequest = require('./http/request.js');
var CommandQueue = require('./core/queue.js');
var Assertion = require('./core/assertion.js');
var Logger = require('./util/logger.js');
var Api = require('./core/api.js');
var Utils = require('./util/utils.js');

function Nightwatch(options) {
  events.EventEmitter.call(this);

  this.locateStrategy = 'css selector';
  this.api = {
    capabilities : {},
    globals : {},
    sessionId : null
  };
  this.setMaxListeners(0);
  this.sessionId = null;
  this.context = null;
  this.terminated = false;

  this.setOptions(options)
      .setCapabilities()
      .loadKeyCodes();

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
  var fs = require('fs');
  this.options = {};
  this.api.options = {};
  if (options && typeof options == 'object') {
    for (var propName in options) {
      this.options[propName] = options[propName];
    }
  }

  this.api.launchUrl = this.options.launchUrl || this.options.launch_url || null;
  // backwords compatibility
  this.api.launch_url = this.api.launchUrl;

  if (this.options.globals && typeof this.options.globals == 'object') {
    for (var globalKey in this.options.globals) {
      this.api.globals[globalKey] = this.options.globals[globalKey];
    }
  }

  var screenshots = this.options.screenshots;
  var screenshotsEnabled = screenshots && screenshots.enabled || false;

  this.api.options.screenshots = screenshotsEnabled;
  if (screenshotsEnabled) {
    if (typeof screenshots.path == 'undefined') {
      throw new Error('Please specify the screenshots.path in nightwatch.json.');
    }
    this.options.screenshots.on_error = this.options.screenshots.on_error ||
      (typeof this.options.screenshots.on_error == 'undefined');
    this.api.screenshotsPath = this.api.options.screenshotsPath = screenshots.path;
  } else {
    this.options.screenshots = {
      enabled : false,
      path : ''
    };
  }

  if (this.options.use_xpath) {
    this.locateStrategy = 'xpath';
  }

  if (this.options.silent) {
    Logger.disable();
  } else {
    Logger.enable();
  }

  this.options.start_session = this.options.start_session || (typeof this.options.start_session == 'undefined');
  this.options.skip_testcases_on_fail = this.options.skip_testcases_on_fail || (typeof this.options.skip_testcases_on_fail == 'undefined');

  this.api.options.log_screenshot_data = this.options.log_screenshot_data ||
    (typeof this.options.log_screenshot_data == 'undefined');
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
    this.api.options.username = username;
    this.api.options.accessKey = key;

    HttpRequest.setCredentials({
      username : username,
      key : key
    });
  }

  this.endSessionOnFail(typeof this.options.end_session_on_fail == 'undefined' || this.options.end_session_on_fail);

  return this;
};

Nightwatch.prototype.endSessionOnFail = function(value) {
  if (typeof value == 'undefined') {
    return this.options.end_session_on_fail;
  }

  this.options.end_session_on_fail = value;
  return this;
};

Nightwatch.prototype.setCapabilities = function() {
  this.desiredCapabilities = {};
  for (var capability in Nightwatch.DEFAULT_CAPABILITIES) {
    this.desiredCapabilities[capability] = Nightwatch.DEFAULT_CAPABILITIES[capability];
  }

  if (this.options.desiredCapabilities) {
    for (var prop in this.options.desiredCapabilities) {
      if (this.options.desiredCapabilities.hasOwnProperty(prop)) {
        this.desiredCapabilities[prop] = this.options.desiredCapabilities[prop];
      }
    }
  }
  this.api.options.desiredCapabilities = this.desiredCapabilities;
  return this;
};

Nightwatch.prototype.loadKeyCodes = function() {
  this.api.Keys = require('./util/keys.json');
  return this;
};

Nightwatch.prototype.start = function() {
  if (!this.sessionId && this.options.start_session) {
    this
      .once('selenium:session_create', this.start)
      .startSession();
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
      if (self.options.start_session) {
        self.terminate();
      }
      return;
    }
    Logger.info('FINISHED');
    self.emit('nightwatch:finished', self.results, self.errors);
  });

  return this;
};

Nightwatch.prototype.terminate = function() {
  var self = this;
  this.terminated = true;
  this.queue.reset();
  this.queue.empty();

  if (this.options.end_session_on_fail) {
    //this.enqueueCommand('session', ['delete'], function(result) {
    //  self.finished();
    //});
    this.api.end(function() {
      self.finished();
    });

    this.queue.run();
  } else {
    this.finished();
  }

  return this;
};

Nightwatch.prototype.complete = function() {
  return this.emit('complete');
};

Nightwatch.prototype.finished = function() {
  if (this.options.end_session_on_fail) {
    this.sessionId = this.api.sessionId = null;
  }
  this.emit('nightwatch:finished', this.results, this.errors);
  return this;
};


Nightwatch.prototype.printResult = function(elapsedTime) {
  if (this.options.output) {
    var ok = false;
    if (this.results.failed === 0 && this.results.errors === 0) {
      ok = true;
    }

    if (ok && this.results.passed > 0) {
      console.log('\n' + Logger.colors.green('OK.'),
        Logger.colors.green(this.results.passed) + ' assertions passed. (' + Utils.formatElapsedTime(elapsedTime, true) + ')');
    } else if (ok && this.results.passed === 0) {
      if (this.options.start_session) {
        console.log(Logger.colors.green('No assertions ran.'));
      }
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

      console.log('\n' +  Logger.colors.red('FAILED: '), failure_msg.join(', ')
        .replace(/,([^,]*)$/g, function($0, $1) {
          return  ' and' + $1;
        }), '(' + Utils.formatElapsedTime(elapsedTime, true) + ')');
    }
  }

  this.clearResult();
};

Nightwatch.prototype.clearResult = function() {
  this.errors.length = 0;
  this.results.passed = 0;
  this.results.failed = 0;
  this.results.errors = 0;
  this.results.skipped = 0;
  this.results.tests.length = 0;
};

Nightwatch.prototype.runProtocolAction = function(requestOptions, callback) {
  var self = this;

  var request = new HttpRequest(requestOptions)
    .on('result', function(result) {
      if (typeof callback != 'function') {
        var error = new Error('Callback parameter is not a function - ' + typeof(callback) + ' passed: "' + callback + '"');
        self.errors.push(error.stack);
        self.results.errors++;
      } else {
        try {
          callback.call(self.api, result);
        } catch (ex) {
          self.errors.push('Error while running tests: ' + ex.message);
          var stack = ex.stack.split('\n');
          var firstLine = stack.shift();
          console.log('    ' + Logger.colors.red(firstLine));
          console.log(stack.join('\n'));
          self.results.errors++;
        }
      }

      if (result.lastScreenshotFile && self.results.tests.length > 0) {
        var lastTest = self.results.tests[self.results.tests.length-1];
        lastTest.screenshots = lastTest.screenshots || [];
        lastTest.screenshots.push(result.lastScreenshotFile);
        delete result.lastScreenshotFile;
      }
      request.emit('complete');
    })
    .on('success', function(result, response) {
      if (result.status && result.status !== 0) {
        result = self.handleTestError(result);
      }
      request.emit('result', result, response);
    })
    .on('error', function(result, response, screenshotContent) {
      result = self.handleTestError(result);
      if (screenshotContent && self.options.screenshots.on_error) {
        var fileNamePath = Utils.getScreenshotFileName('ERROR_', self.options.screenshots.path);
        self.saveScreenshotToFile(fileNamePath, screenshotContent);
        result.lastScreenshotFile = fileNamePath;
      }

      request.emit('result', result, response);
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

Nightwatch.prototype.saveScreenshotToFile = function(fileName, content, cb) {
  var mkpath = require('mkpath');
  var fs = require('fs');
  var self = this;
  cb = cb || function() {};

  var dir = path.resolve(fileName, '..');
  var fail = function(err) {
    if (self.options.output) {
      console.log(Logger.colors.yellow('Couldn\'t save screenshot to '), fileName);
    }

    Logger.warn(err);
    cb(err);
  };

  mkpath(dir, function(err) {
    if (err) {
      fail(err);
    } else {
      fs.writeFile(fileName, content, 'base64', function(err) {
        if (err) {
          fail(err);
        } else {
          cb(null, fileName);
        }
      });
    }
  });
};

Nightwatch.prototype.handleTestError = function(result) {
  var errorMessage = '';
  if (result && result.status) {
    var errorCodes = require('./api/errors.json');
    errorMessage = errorCodes[result.status] && errorCodes[result.status].message || '';
  }

  return {
    status: -1,
    value : result && result.value || null,
    errorStatus: result && result.status || '',
    error : errorMessage
  };
};

Nightwatch.prototype.startSession = function () {
  var self = this;
  var options = {
    path : '/session',
    data : {
      desiredCapabilities : this.desiredCapabilities
    }
  };

  var request = new HttpRequest(options);
  request.on('success', function(data, response, isRedirect) {
    if (data && data.sessionId) {
      self.sessionId = self.api.sessionId = data.sessionId;
      if (data.value) {
        self.api.capabilities = data.value;
      }
      Logger.info('Got sessionId from selenium', self.sessionId);
      self.emit('selenium:session_create', self.sessionId, request, response);
    } else if (isRedirect) {
      self.followRedirect(request, response);
    } else {
      Logger.warn('Couldn\'t retrieve a new session from selenium server.');
    }
  })
  .on('error', function(data, err) {
    console.error('\n' + Logger.colors.light_red('Error retrieving a new session from the selenium server'));

    if (typeof data == 'object' && Object.keys(data).length === 0) {
      data = '';
    }

    if (!data && err) {
      data = err;
    }

    if (data) {
      var error = data;
      if (typeof data == 'object') {
        if (data.stack) {
          error = data.stack;
        } else {
          error = util.inspect(data, true, 3, true);
        }
      }
      console.error(error);
    }

    self.emit('error', data);
  })
  .send();

  return this;
};

Nightwatch.prototype.followRedirect = function (request, response) {
  if (!response.headers || !response.headers.location) {
    this.emit('error', null, null);
    return this;
  }
  var url = require('url');
  var urlParts = url.parse(response.headers.location);
  request.setOptions({
    path   : urlParts.pathname,
    host   : urlParts.hostname,
    port   : urlParts.port,
    method : 'GET'
  }).send();

  return this;
};

module.exports = new (function() {

  this.client = function(options) {
    return new Nightwatch(options);
  };

  var cli = this.cli = function(runTests) {
    var cli = require('./runner/cli/cli.js');
    cli.setup();
    var argv = cli.init();

    if (argv.help) {
      cli.showHelp();
    } else if (argv.version) {
      var packageConfig = require(__dirname + '/../package.json');
      console.log(packageConfig.name + ' v' + packageConfig.version);
    } else {
      if (typeof runTests != 'function') {
        throw new Error('Supplied argument needs to be a function!');
      }
      runTests(argv);
    }
  };

  var runner = this.runner = function(argv, done, settings) {
    var CliRunner = require('./runner/cli/clirunner.js');
    var runner = new CliRunner(argv);

    return runner.setup(settings, done).runTests(done);
  };

  this.initGrunt = function(grunt) {
    grunt.registerMultiTask('nightwatch', 'run nightwatch.', function() {
      var done = this.async();
      var options = this.options();
      var settings = this.data && this.data.settings;
      var argv = this.data && this.data.argv;

      cli(function(a) {
        for (var key in argv) {
          if (key === 'env' && a['parallel-mode'] === true) {
            continue;
          }
          a[key] = argv[key];
        }

        if (a.test) {
          a.test = path.resolve(a.test);
        }

        if (options.cwd) {
          process.chdir(options.cwd);
        }

        runner(a, done, settings);
      });
    });
  };
})();
