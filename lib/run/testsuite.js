var path = require('path');
var util = require('util');
var events = require('events');
var Q = require('q');
var ClientManager = require('./clientmanager.js');
var Module = require('./module.js');
var TestCase = require('./testcase.js');
var Logger = require('../util/logger.js');
var Utils = require('../util/utils.js');

function noop() {}

function TestSuite(modulePath, fullPaths, opts, addtOpts) {
  events.EventEmitter.call(this);
  this.deferred = Q.defer();
  this.module = new Module(modulePath, opts);
  this.testResults = {
    passed  : 0,
    failed  : 0,
    errors  : 0,
    skipped : 0,
    tests   : 0,
    testcases : {},
    timestamp : new Date().toUTCString(),
    time : 0,
    steps   : this.module.keys.slice(0)
  };

  this.currentTest = '';
  this.module.setReportKey(fullPaths, addtOpts.src_folders);
  this.options = opts;

  this.setupClient();
  this.initHooks();
}

util.inherits(TestSuite, events.EventEmitter);

TestSuite.prototype.setupClient = function() {
  this.client = new ClientManager();
  var self = this;
  this.client.on('error', function(err) {
    self.deferred.reject(err);
  });
  this.client.init(this.options);
  this.client.api('currentEnv', this.options.currentEnv);
  this.module.setClient(this.client.api());
};

TestSuite.prototype.initHooks = function() {
  var self = this;
  var api = this.client.api();
  var context = this.module.get();
  var argsCount;

  this.hooks = {};

  var hooks = ['before', 'after', ['beforeEach', 'setUp'], ['afterEach', 'tearDown', 3]];
  hooks.forEach(function(item) {
    var key;
    if (Array.isArray(item)) {
      key = item[0];
    } else {
      key = item;
    }

    var index = self.testResults.steps.indexOf(key);
    if (index === -1 && Array.isArray(item)) {
      index = self.testResults.steps.indexOf(item[1]);
    }

    if (Array.isArray(item) && (item.length == 3)) {
      argsCount = item[2];
    } else {
      argsCount = 2;
    }

    self.hooks[key] = (function(item, argsCount) {
      return function() {
        var args = Array.prototype.slice.call(arguments, 0);
        return self.makePromise(function(done) {
          var hookFn = self.adaptHookMethod(item, context, argsCount);
          if (args.length > 0) {
            args.push(done);
            hookFn.apply(context, args);
          } else {
            hookFn.call(context, api, done);
          }
        });
      };
   })(item, argsCount);

    if (index > -1) {
      self.testResults.steps.splice(index, 1);
      self.module.removeKey(item);
    }
  });

};

TestSuite.prototype.run = function() {
  var self = this;
  this.module.print();
  if (this.module.isDisabled()) {
    if (this.options.output) {
      console.log(Logger.colors.cyan(this.module.getName()), 'module is disabled, skipping...');
    }
    this.deferred.resolve(this.testResults);
  } else {
    this.globalBeforeEach()
      .then(function() {
        return self.runTestSuiteModule();
      })

      .then(function(results) {
        return self.globalAfterEach();
      })
      .then(function() {
        self.deferred.resolve(self.testResults);
      });
  }

  return this.deferred.promise;
};

TestSuite.prototype.getReportKey = function() {
  return this.module.moduleKey;
};

TestSuite.prototype.printResult = function(startTime) {
  return this.client.print(startTime);
};

TestSuite.prototype.runTestSuiteModule = function() {

  var self = this;
  this.updateDesiredCapabilities();

  return this.before()
    .then(function() {
      return self.runNextTestCase();
    })
    .then(function(skipped) {
      return self.after();
    }, function(error) {
      return false;
    })
    .then(function() {
      return self.client.checkQueue();
    });
};

TestSuite.prototype.onTestCaseFinished = function(results, errors, time) {
  var elapsedTime = (time/1000).toPrecision(4);
  this.testResults.passed += results.passed;
  this.testResults.failed += results.failed;
  this.testResults.errors += results.errors;
  this.testResults.skipped += results.skipped;
  this.testResults.tests += results.tests.length;
  this.testResults.time += time;
  this.testResults.testcases[this.currentTest] = {
    passed : results.passed,
    failed : results.failed,
    errors : results.errors,
    skipped : results.skipped,
    tests : results.tests.length,
    time : elapsedTime
  };

  this.emit('testcase:finished', results, errors, time);
};

TestSuite.prototype.runNextTestCase = function(deffered) {
  this.currentTest = this.module.getNextKey();
  var self = this;

  deffered = deffered || Q.defer();
  if (this.currentTest) {
    this.testResults.steps.splice(this.testResults.steps.indexOf(this.currentTest), 1);

    var moduleKey = this.getReportKey();
    this.client.api('currentTest', {
      name : this.currentTest,
      module : moduleKey.replace(path.sep , '/')
    });

    if (this.options.output) {
      process.stdout.write('\n');
      console.log((this.options.parallelMode && !this.options.live_output ? 'Results for: ' : 'Running: '),
        Logger.colors.green(this.currentTest), '\n');
    }

    var testCase = new TestCase(this, this.currentTest);
    testCase.run().then(function(response) {
      self.onTestCaseFinished(response.results, response.errors, response.time);

      if (self.client.terminated()) {
        deffered.resolve(self.module.keys);
      } else {
        setTimeout(function() {
          self.runNextTestCase(deffered);
        }, 0);
      }
    }, function(error) {
      deffered.reject(error);
    });
  } else {
    deffered.resolve();
  }

  return deffered.promise;
};

//////////////////////////////////////////////////////////////////////
// Test suite hooks
//////////////////////////////////////////////////////////////////////
TestSuite.prototype.before = function() {
  return this.hooks.before();
};

TestSuite.prototype.after = function() {
  return this.hooks.after();
};

TestSuite.prototype.beforeEach = function() {
  return this.hooks.beforeEach();
};

TestSuite.prototype.afterEach = function(results, errors) {
  return this.hooks.afterEach(results, errors);
};

//////////////////////////////////////////////////////////////////////
// Global hooks
//////////////////////////////////////////////////////////////////////
TestSuite.prototype.globalBeforeEach = function() {
  return this.makePromise(function(done) {
    var globalBeforeEach = this.adaptHookMethod('beforeEach', this.options.globals, 1);
    globalBeforeEach.call(this.options.globals, done);
  });
};

TestSuite.prototype.globalAfterEach = function() {
  return this.makePromise(function(done) {
    var globalAfterEach = this.adaptHookMethod('afterEach', this.options.globals, 1);
    globalAfterEach.call(this.options.globals, done);
  });
};

//////////////////////////////////////////////////////////////////////
// Utilities
//////////////////////////////////////////////////////////////////////
TestSuite.prototype.makePromise = function (fn) {
  var deferred = Q.defer();
  fn.call(this, function() {
    deferred.resolve();
  });
  return deferred.promise;
};

TestSuite.prototype.updateDesiredCapabilities = function() {
  this.options.desiredCapabilities = this.options.desiredCapabilities || {};
  if (this.options.sync_test_names || (typeof this.options.sync_test_names == 'undefined')) {
    // optionally send the local test name (derived from filename)
    // to the remote selenium server. useful for test reporting in cloud service providers
    this.options.desiredCapabilities.name = this.getReportKey();
  }

  if (this.module.desiredCapabilities()) {
    for (var capability in this.module.desiredCapabilities()) {
      if (this.module.desiredCapabilities().hasOwnProperty(capability)) {
        this.options.desiredCapabilities[capability] = this.module.desiredCapabilities(capability);
      }
    }
  }
};

TestSuite.prototype.adaptHookMethod = function(fn, context, asyncArgCount) {
  var hookFn;
  if (Array.isArray(fn) && (fn.length === 2)) {
    hookFn = Utils.checkFunction(fn[0], context) || Utils.checkFunction(fn[1], context) || noop;
  } else {
    hookFn = Utils.checkFunction(fn, context) || noop;
  }

  return Utils.makeFnAsync(asyncArgCount, hookFn);
};

module.exports = TestSuite;