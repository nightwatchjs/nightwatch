var Walk = require('./walk.js');
var TestSuite = require('./testsuite.js');
var Logger = require('../util/logger.js');
var Reporter = require('./reporter.js');
var path = require('path');
var Q = require('q');

var globalResults;
var currentTestSuite;
var finishCallback;

function processListener() {
  process.on('exit', function (code) {
    var exitCode = code;

    if (exitCode === 0 && globalResults && (globalResults.errors > 0 || globalResults.failed > 0)) {
      exitCode = 1;
    }

    process.exit(exitCode);
  });

  process.on('uncaughtException', function (err) {
    if (currentTestSuite) {
      var testCase = currentTestSuite.getCurrentTestCase();
      if (testCase/* && testCase.running*/) {
        testCase.catchHandler(err);
        return;
      }
    }

    if (finishCallback) {
      finishCallback(err);
    } else {
      console.log(err)
    }
  });
}

function Runner(testSource, opts, additionalOpts, doneCb) {
  this.testSource = testSource || [];
  this.options = opts;
  this.additionalOpts = additionalOpts;
  this.doneCb = doneCb || function() {};
  this.globalStartTime = new Date().getTime();
  this.currentTestSuite = null;
  globalResults = this.globalResults = {
    passed : 0,
    failed : 0,
    errors : 0,
    skipped : 0,
    tests : 0,
    errmessages : [],
    modules : {}
  };

  this.setOptions();
}

Runner.setFinishCallback = function(cb) {
  finishCallback = cb;
};

Runner.prototype.setOptions = function() {
  this.options.parallelMode = process.env.__NIGHTWATCH_PARALLEL_MODE == '1';
  if (this.options.parallelMode) {
    this.options.currentEnv = process.env.__NIGHTWATCH_ENV_KEY;
  }
  this.options.live_output = this.additionalOpts.live_output;
  this.options.detailed_output = this.additionalOpts.detailed_output;
  this.options.start_session = this.additionalOpts.start_session;
  this.options.report_prefix = '';
  this.options.test_worker = this.additionalOpts.test_worker;
};

Runner.prototype.runTestModule = function(modulePath, fullPaths) {
  try {
    currentTestSuite = this.currentTestSuite = new TestSuite(modulePath, fullPaths, this.options, this.additionalOpts, this.doneCb);
  } catch (err) {
    this.doneCb(err);
    return null;
  }

  var moduleKey = this.currentTestSuite.getReportKey();

  this.globalResults.modules[moduleKey] = {
    completed : {},
    skipped : null,
    time : null,
    timestamp : null,
    group : this.currentTestSuite.getGroupName()
  };

  return this.currentTestSuite
    .on('testcase:finished', function(results, errors, time) {
      var tests = this.globalResults.modules[moduleKey].completed[this.currentTestSuite.currentTest] = {
        passed  : results.passed,
        failed  : results.failed,
        errors  : results.errors,
        skipped : results.skipped,
        assertions  : [].concat(results.tests),
        timeMs : time,
        time : (time/1000).toPrecision(4),
        stackTrace : results.stackTrace
      };

      if (Array.isArray(errors) && errors.length) {
        this.globalResults.errmessages = this.globalResults.errmessages.concat(errors);
      }

      this.globalResults.passed += results.passed;
      this.globalResults.failed += results.failed;
      this.globalResults.errors += results.errors;
      this.globalResults.skipped += results.skipped;
      this.globalResults.tests += results.tests.length;

      this.globalResults.assertions = this.globalResults.tests;

      if (this.options.output && this.options.detailed_output &&
        (this.options.modulesNo > 1 || results.tests !== this.globalResults.tests || results.steps.length > 1)
      ) {
        this.currentTestSuite.printResult(time);
      } else if (this.options.output && !this.options.detailed_output) {

        var error = (results.failed > 0 || results.errors > 0) ? new Error('') : null;
        console.log(Reporter.getTestOutput(error, this.currentTestSuite.currentTest, time));

        if (error !== null) {
          Reporter.printAssertions(tests);
        }
      }

    }.bind(this))
    .run()
    .then(function onTestSuiteResolved(testResults) {
      var testSuiteResult = this.globalResults.modules[moduleKey];
      testSuiteResult.skipped = testResults.steps;
      testSuiteResult.timestamp = testResults.timestamp;
      testSuiteResult.time = (testResults.time/1000).toPrecision(4);
      testSuiteResult.tests = Object.keys(testSuiteResult.completed).length + (testSuiteResult.skipped && testSuiteResult.skipped.length || 0);

      var failures = 0;
      var errors = testResults.errors || 0;
      Object.keys(testSuiteResult.completed).forEach(function(item) {
        if (testSuiteResult.completed[item].failed > 0) {
          failures++;
        }
      });

      testSuiteResult.errmessages = testResults.errmessages || [];
      testSuiteResult.failures = failures;
      testSuiteResult.errors = errors;
      if (typeof process.send == 'function') {
        process.send(JSON.stringify({
          type: 'testsuite_finished',
          itemKey: process.env.__NIGHTWATCH_ENV_LABEL,
          moduleKey: moduleKey,
          results: this.globalResults.modules[moduleKey],
          errmessages: testSuiteResult.errmessages,
          passed: this.globalResults.passed,
          failed: this.globalResults.failed,
          errors: this.globalResults.errors,
          skipped: this.globalResults.skipped,
          tests: this.globalResults.tests
        }));
      }

      return testResults;
    }.bind(this));
};

Runner.readPaths = function(testSource, opts, cb) {
  var deferred = Q.defer();
  cb = cb || function() {};

  if (typeof testSource == 'string') {
    testSource = [testSource];
  }

  var fullPaths = testSource.map(function (p) {
    if (p.indexOf(process.cwd()) === 0 || path.resolve(p) === p) {
      return p;
    }

    return path.join(process.cwd(), p);
  });

  if (fullPaths.length === 0) {
    throw new Error('No source folder defined. Check configuration.');
  }

  var errorMessage = ['No tests defined! using source folder:', fullPaths];
  if (opts.tag_filter) {
    errorMessage.push('; using tags:', opts.tag_filter);
  }

  Walk.readPaths(fullPaths, function (err, modules) {
    if (err) {
      if (err.code == 'ENOENT') {
        var error = new Error('Cannot read source folder: ' + err.path);
        cb(error, false);
        deferred.reject(error);
        return;
      }
      cb(err, false);
      deferred.reject(err);
      return;
    }

    opts.modulesNo = modules.length;

    if (modules.length === 0) {
      var error2 = new Error(errorMessage.join(' '));
      cb(error2);
      deferred.reject(error2);
      return;
    }

    cb(null, modules, fullPaths);
    deferred.resolve([modules, fullPaths]);
  }, opts);

  return deferred.promise;
};

Runner.prototype.run = function runner() {
  var deferred = Q.defer();
  var self = this;

  finishCallback = this.doneCb;

  Runner.readPaths(this.testSource, this.options)
    .spread(function(modulePaths, fullPaths) {

      (function runNextModule() {
        var modulePath = modulePaths.shift();
        var promise = self.runTestModule(modulePath, fullPaths);

        if (promise === null) {
          deferred.resolve();
          return;
        }

        promise.then(function(testResults) {
          if (modulePaths.length) {
            setImmediate(runNextModule);
          } else {
            var reporter = new Reporter(self.globalResults, testResults, self.globalStartTime, {
              output_folder : self.additionalOpts.output_folder,
              filename_prefix : self.options.report_prefix,
              globals : self.options.globals,
              reporter : self.additionalOpts.reporter,
              start_session : self.options.start_session
            });

            if (self.options.output) {
              reporter.printTotalResults(self.globalResults, testResults);
            }

            reporter.save().then(function() {
              reporter.globalReporter(self.options.globals)(self.globalResults, function() {
                try {
                  self.doneCb(null, self.globalResults);
                  deferred.resolve(self.globalResults);
                } catch (err) {
                  deferred.reject(err);
                }
              });
            }, function(err) {
              console.log(Logger.colors.yellow('Output folder doesn\'t exist and cannot be created.'));
              console.log(err.stack);
              self.doneCb(null);
              deferred.resolve();
            });
          }
        }, function(err) {
          self.doneCb(err, self.globalResults);
        }).catch(function(err) {
          deferred.reject(err);
        });
      })();
    })
    .catch(function(err) {
      self.doneCb(err, false);
    })
    .catch(function(err) {
      deferred.reject(err);
    });

  return deferred.promise;
};

processListener();

module.exports = Runner;
