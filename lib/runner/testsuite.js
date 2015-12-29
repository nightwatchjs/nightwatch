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
  this.module = new Module(modulePath, opts, addtOpts);
  this.setTestResult();
  this.currentTest = '';
  this.module.setReportKey(fullPaths, addtOpts.src_folders);
  this.options = opts;
  this.testMaxRetries = addtOpts.retries || 0;
  this.suiteMaxRetries = addtOpts.suite_retries || 0;
  this.suiteRetries = 0;
  this.suiteName = Utils.getTestSuiteName(this.module.moduleKey);
  this.setupClient();
  this.initHooks();
}

util.inherits(TestSuite, events.EventEmitter);

TestSuite.prototype.setupClient = function() {
  this.updateDesiredCapabilities();
  this.client = new ClientManager();
  var self = this;
  this.client.on('error', function(err) {
    self.deferred.reject(err);
  });
  this.client.init(this.options);
  this.client.api('currentEnv', this.options.currentEnv);
  this.module.set('client', this.client.api());
  if (this.client.endSessionOnFail() && !this.module.endSessionOnFail()) {
    this.client.endSessionOnFail(false);
  }
};

TestSuite.prototype.initHooks = function() {
  var self = this;
  var api = this.client.api();
  var context = this.module.get();
  var argsCount;

  this.hooks = {};

  var hooks = ['before', 'after', ['beforeEach', 'setUp']];
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
        return self.makePromise(function(done) {
          var callbackDeffered = false;
          var called = false;
          var originalFn = self.module.get(key);

          var doneFn = function() {
            called = true;
            if (callbackDeffered) {
              return;
            }
            return done();
          };

          var hookFn = self.adaptHookMethod(item, context, argsCount);
          hookFn.call(context, api, doneFn);

          if (originalFn && (originalFn.length == 2) && self.client.shouldRestartQueue()) {
            callbackDeffered = true;
            var asyncDoneFn = function(err) {
              if (called) {
                done();
              } else {
                callbackDeffered = false;
              }
            };

            if (key == 'before' || key == 'beforeEach') {
              self.client.start(asyncDoneFn);
            } else if (key == 'after') {
              self.client.restartQueue(asyncDoneFn);
            }

          }
        });
      };
    })(item, argsCount);

    if (index > -1) {
      self.testResults.steps.splice(index, 1);
      self.module.removeKey(item);
    }
  });
  this.initAfterEachHook();
};

TestSuite.prototype.initAfterEachHook = function() {
  var self = this;
  var api = this.client.api();
  var module = this.module.get();
  var key = 'afterEach';
  var hookFn;
  var index = self.testResults.steps.indexOf(key);

  if (!module[key]) {
    // backwards compatibility
    key = 'tearDown';
    index = self.testResults.steps.indexOf(key);
  }

  if (module[key]) {
    hookFn = module[key];
    if (index > -1) {
      // not running with --testcase
      self.testResults.steps.splice(index, 1);
      self.module.removeKey(key);
    }
  } else {
    hookFn = function() {};
  }

  var expectedArgs = hookFn.length;
  this.hooks.afterEach = function(results, errors) {
    self.module
      .set('results', results)
      .set('errors', errors);
    var asyncFn, asyncArgsCount;
    if (expectedArgs <= 1) {
      asyncArgsCount = 1;
    } else {
      asyncArgsCount   = 2;
    }
    asyncFn = Utils.makeFnAsync(asyncArgsCount, hookFn, module);
    return self.makePromise(function(done, deferred) {
      var doneFn = self.adaptDoneCallback(done, 'afterEach', deferred);
      self.client.publishTestResults(self.currentTest, self.module.get('results'), errors);

      if (expectedArgs < 2) {
        // user has only supplied the done callback argument (pre v0.6 behaviour), e.g.:
        // afterEach : function(done) { ... }
        asyncFn.call(module, doneFn);
      } else {
        // user has supplied both the client and the done callback argument (v0.6 behaviour), e.g.:
        // afterEach : function(browser, done) { ... }
        // in which case we may need to restart the queue if any selenium related actions are added
        asyncFn.call(module, api, function() {
          doneFn();
        });
        // this will restart the queue if needed
        self.client.checkQueue();
      }
    });
  };
  return this;
};

TestSuite.prototype.run = function() {
  var self = this;
  this.print();
  if (this.module.isDisabled()) {
    if (this.options.output) {
      console.log(Logger.colors.cyan(this.module.getName()), 'module is disabled, skipping...');
    }
    this.deferred.resolve(this.testResults);
  } else {
    this.setCurrentTest();
    this.globalBeforeEach()
      .then(function() {
        if (self.client.terminated() && self.client.skipTestcasesOnFail()) {
          self.deferred.resolve(self.testResults);
          return null;
        }
        return self.runTestSuiteModule();
      })

      .then(function(results) {
        return self.globalAfterEach();
      })

      .then(function() {
        self.deferred.resolve(self.testResults);
      })
      .catch(function(e) {
        self.deferred.reject(e);
      });
  }

  return this.deferred.promise;
};

TestSuite.prototype.getReportKey = function() {
  return this.module.moduleKey;
};

TestSuite.prototype.getGroupName = function() {
  return this.module.groupName;
};

TestSuite.prototype.printResult = function(startTime) {
  return this.client.print(startTime);
};

TestSuite.prototype.setTestResult = function() {
  this.testResults = {};
  this.testResults.steps = this.module.keys.slice(0);
  this.clearTestResult();
  return this;
};

TestSuite.prototype.clearTestResult = function() {
  this.testResults.passed = 0;
  this.testResults.failed = 0;
  this.testResults.errors = 0;
  this.testResults.skipped = 0;
  this.testResults.tests = 0;
  this.testResults.testcases = {};
  this.testResults.timestamp = new Date().toUTCString();
  this.testResults.time = 0;
  return this;
};

TestSuite.prototype.clearResult = function() {
  this.clearTestResult();
  this.client.clearGlobalResult();
  return this;
};

TestSuite.prototype.printRetry = function() {
  if (this.options.output) {
    console.log('Retrying: ',
      Logger.colors.red('[' + this.suiteName + '] Test Suite '),
      '(' + this.suiteRetries + '/' + this.suiteMaxRetries + '): ');
  }
};

TestSuite.prototype.retryTestSuiteModule = function() {
  this.suiteRetries +=1;
  this.resetTestCases();
  this.printRetry();
  this.globalBeforeEach();
  return this.runTestSuiteModule();
};

TestSuite.prototype.runTestSuiteModule = function() {
  var self = this;
  return this.before()
    .then(function() {
      return self.runNextTestCase();
    })
    .then(function(skipped) {
      return self.after();
    })
    .then(function() {
      return self.client.checkQueue();
    })
    .then(function() {
      if (self.suiteMaxRetries > self.suiteRetries && (self.testResults.failed > 0 || self.testResults.errors > 0)) {
        self.globalAfterEach();
        self.client.resetTerminated();
        self.clearResult();
        return self.retryTestSuiteModule();
      }
    })
    .catch(function(e) {
      this.testResults.errors++;
      throw e;
    }.bind(this));
};

TestSuite.prototype.onTestCaseFinished = function(results, errors, time) {
  this.testResults.time += time;
  this.testResults.testcases[this.currentTest] = this.testResults.testcases[this.currentTest] || {};
  this.testResults.testcases[this.currentTest].time = (time/1000).toPrecision(4);
  this.emit('testcase:finished', results, errors, time);
};

TestSuite.prototype.resetTestCases = function() {
  var self = this;
  this.module.resetKeys();
  Object.keys(this.hooks).forEach(function(hook) {
    self.module.removeKey(hook);
  });
};

TestSuite.prototype.setCurrentTest = function() {
  var moduleKey = this.getReportKey();
  this.client.clearGlobalResult();

  this.client.api('currentTest', {
    name : this.currentTest,
    module : moduleKey.replace(path.sep , '/'),
    results : this.testResults,
    group : this.getGroupName()
  });
  return this;
};

TestSuite.prototype.runNextTestCase = function(deffered) {
  this.currentTest = this.module.getNextKey();
  this.setCurrentTest();

  deffered = deffered || Q.defer();

  if (this.currentTest) {
    this.testResults.steps.splice(this.testResults.steps.indexOf(this.currentTest), 1);

    this.runTestCase(this.currentTest, deffered, 0);
  } else {
    deffered.resolve();
  }

  return deffered.promise;
};

TestSuite.prototype.runTestCase = function(currentTest, deffered, numRetries) {
  var self = this;
  var testCase = new TestCase(this, currentTest, numRetries, this.testMaxRetries);

  if (self.client.terminated() && self.client.skipTestcasesOnFail()) {
    deffered.resolve(self.module.keys);
    return deffered;
  }

  testCase.print().run().then(function(response) {
    var foundFailures = !!(response.results.failed || response.results.errors);
    if (foundFailures && numRetries < self.testMaxRetries) {
      numRetries++;
      self.client.resetTerminated();
      self.clearResult();
      self.runTestCase(currentTest, deffered, numRetries);
    } else if (foundFailures && self.suiteRetries < self.suiteMaxRetries) {
      deffered.resolve(self.module.keys);
    } else {
      self.onTestCaseFinished(response.results, response.errors, response.time);

      if (self.client.terminated() && self.client.skipTestcasesOnFail()) {
        deffered.resolve(self.module.keys);
      } else {
        process.nextTick(function() {
          self.runNextTestCase(deffered);
        });
      }
    }
  }, function(error) {
    deffered.reject(error);
  });

  return deffered;
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
  return this.adaptGlobalHook('beforeEach');
};

TestSuite.prototype.globalAfterEach = function() {
  return this.adaptGlobalHook('afterEach');
};

TestSuite.prototype.adaptGlobalHook = function(hookName) {
  return this.makePromise(function(done, deffered) {
    var callbackDeffered = false;
    var doneFn = function() {
      if (callbackDeffered) {
        return;
      }
      var fn = this.adaptDoneCallback(done, 'global ' + hookName, deffered);
      return fn();
    }.bind(this);

    var argsCount;
    var expectedCount = 1;

    if (Utils.checkFunction(hookName, this.options.globals)) {
      argsCount = this.options.globals[hookName].length;
      expectedCount = argsCount == 2 ? 2 : 1;
    }

    var globalHook = this.adaptHookMethod(hookName, this.options.globals, expectedCount);
    var args = [doneFn];
    if (argsCount == 2) {
      args.unshift(this.client.api());
    }

    globalHook.apply(this.options.globals, args);

    if (this.client.shouldRestartQueue()) {
      callbackDeffered = true;
      if (hookName == 'before' || hookName == 'beforeEach') {
        this.client.start(function(err) {
          if (err) {
            this.testResults.errors++;
            this.testResults.errmessages = [err.message];
          }
          done(err);
        }.bind(this));
      } else {
        this.client.restartQueue(function() {
          done();
        });
      }
    }

  });
};

TestSuite.prototype.adaptDoneCallback = function(done, hookName, deferred) {
  var maxTimeout = this.client.api().globals.asyncHookTimeout || 10000;
  var timeout = setTimeout(function() {
    try {
      throw new Error('done() callback timeout was reached while executing ' + hookName + '.' +
        ' Make sure to call the done() callback when the operation finishes.');
    } catch (err) {
      deferred.reject(err);
    }
  }, maxTimeout);

  return function() {
    clearTimeout(timeout);
    done();
  };
};

//////////////////////////////////////////////////////////////////////
// Utilities
//////////////////////////////////////////////////////////////////////
TestSuite.prototype.makePromise = function (fn) {
  var deferred = Q.defer();
  try {
    fn.call(this, function() {
      deferred.resolve();
    }, deferred);
  } catch (e) {
    deferred.reject(e);
  }

  return deferred.promise;
};

TestSuite.prototype.updateDesiredCapabilities = function() {
  this.options.desiredCapabilities = this.options.desiredCapabilities || {};
  if (this.options.sync_test_names || (typeof this.options.sync_test_names == 'undefined')) {
    // optionally send the local test name (derived from filename)
    // to the remote selenium server. useful for test reporting in cloud service providers
    this.options.desiredCapabilities.name = this.suiteName;
  }

  if (this.module.desiredCapabilities()) {
    for (var capability in this.module.desiredCapabilities()) {
      if (this.module.desiredCapabilities().hasOwnProperty(capability)) {
        this.options.desiredCapabilities[capability] = this.module.desiredCapabilities(capability);
      }
    }
  }
};

TestSuite.prototype.print = function() {
  if (this.options.output) {
    var testSuiteDisplay = '[' + this.suiteName + '] Test Suite';
    console.log('\n' + Logger.colors.cyan(testSuiteDisplay, Logger.colors.background.black));
    console.log(Logger.colors.purple(new Array(testSuiteDisplay.length + 1).join('=')));
  }
};

TestSuite.prototype.adaptHookMethod = function(fn, context, asyncArgCount) {
  var hookFn;
  if (Array.isArray(fn) && (fn.length >= 2)) {
    hookFn = Utils.checkFunction(fn[0], context) || Utils.checkFunction(fn[1], context) || noop;
  } else {
    hookFn = Utils.checkFunction(fn, context) || noop;
  }

  return Utils.makeFnAsync(asyncArgCount, hookFn, context);
};

module.exports = TestSuite;
