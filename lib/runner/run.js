var Walk = require('./walk.js');
var TestSuite = require('./testsuite.js');
var Logger = require('../util/logger.js');
var Reporter = require('./reporter.js');
var path = require('path');

module.exports = new (function() {
  var globalStartTime;
  var globalResults = {
    passed : 0,
    failed : 0,
    errors : 0,
    skipped : 0,
    tests : 0,
    errmessages : [],
    modules : {}
  };

  function processListener(finishCallback) {
    process.on('exit', function (code) {
      var exitCode = code;
      if (exitCode === 0 && (globalResults.errors > 0 || globalResults.failed > 0)) {
        exitCode = 1;
      }
      process.exit(exitCode);
    });

    process.on('uncaughtException', function (err) {
      finishCallback({
        message: 'An error occurred while running the tests:\n' + (err && err.stack || err)
      });
    });
  }

  function runTestModule(modulePath, fullPaths, opts, addtOpts, finishCallback) {
    var testSuite;
    try {
      testSuite = new TestSuite(modulePath, fullPaths, opts, addtOpts, finishCallback);
    } catch (err) {
      finishCallback(err);
      return null;
    }

    var moduleKey = testSuite.getReportKey();

    globalResults.modules[moduleKey] = {
      completed : {},
      skipped : null,
      time : null,
      timestamp : null,
      group : testSuite.getGroupName()
    };

    return testSuite.on('testcase:finished', function(results, errors, time) {
      globalResults.modules[moduleKey].completed[testSuite.currentTest] = {
        passed  : results.passed,
        failed  : results.failed,
        errors  : results.errors,
        skipped : results.skipped,
        assertions  : [].concat(results.tests),
        time : (time/1000).toPrecision(4)
      };

      if (Array.isArray(errors) && errors.length) {
        globalResults.errmessages = globalResults.errmessages.concat(errors);
      }

      globalResults.passed += results.passed;
      globalResults.failed += results.failed;
      globalResults.errors += results.errors;
      globalResults.skipped += results.skipped;
      globalResults.tests += results.tests.length;

      globalResults.assertions = globalResults.tests;

      if (opts.output && (opts.modulesNo > 1 ||
        results.tests !== globalResults.tests ||
        results.steps.length > 1)) {
        testSuite.printResult(time);
      }

    }).run().then(function onTestSuiteResolved(testResults) {
      var testSuite = globalResults.modules[moduleKey];
      testSuite.skipped = testResults.steps;
      testSuite.timestamp = testResults.timestamp;
      testSuite.time = (testResults.time/1000).toPrecision(4);
      testSuite.tests = Object.keys(testSuite.completed).length + (testSuite.skipped && testSuite.skipped.length || 0);

      var failures = 0;
      var errors = testResults.errors || 0;
      Object.keys(testSuite.completed).forEach(function(item) {
        if (testSuite.completed[item].failed > 0) {
          failures++;
        }
        if (testSuite.completed[item].errors > 0) {
          errors++;
        }
      });
      testSuite.failures = failures;
      testSuite.errors = errors;

      return testResults;
    });
  }

  this.readPaths = function(testSource, opts, cb) {
    var modulePaths = [];
    var joinedPaths = 0;
    var modulesCount = 0;

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
      throw new Error('No tests to run.');
    }

    var errorMessage = ['No tests defined! using source folder:', fullPaths];
    if (opts.tag_filter) {
      errorMessage.push('; using tags:', opts.tag_filter);
    }

    Walk.readPaths(fullPaths, function (err, modules) {
      if (err) {
        if (err.code == 'ENOENT') {
          cb({
            message : 'Cannot read source folder: ' + err.path
          }, false);
          return;
        }
        cb(err, false);
        return;
      }

      modulesCount += modules.length;
      if (modules && modules.length > 0) {
        modulePaths = modulePaths.concat(modules);
      }
      joinedPaths++;

      if (joinedPaths === fullPaths.length) {
        opts.modulesNo = modulePaths && modulePaths.length || 0;

        if (modulePaths.length === 0) {
          cb({message: errorMessage.join(' ')});
          return;
        }

        cb(null, modulePaths, fullPaths);
      }
    }, opts);
  };

  /**
   *
   * @param {Array} testSource
   * @param {object} opts
   * @param {object} additionalOpts
   * @param {function} finishCallback
   */
  this.run = function runner(testSource, opts, additionalOpts, finishCallback) {
    opts.parallelMode = process.env.__NIGHTWATCH_PARALLEL_MODE == '1';
    if (opts.parallelMode) {
      opts.currentEnv = process.env.__NIGHTWATCH_ENV_KEY;
    }
    opts.live_output = additionalOpts.live_output;
    opts.start_session = additionalOpts.start_session;
    opts.report_prefix = '';

    globalStartTime = new Date().getTime();
    finishCallback = finishCallback || function () {};

    this.readPaths(testSource, opts, function (err, modulePaths, fullPaths) {
      if (err) {
        finishCallback(err, false);
        return;
      }

      (function runNextModule() {
        var modulePath = modulePaths.shift();
        var promise = runTestModule(modulePath, fullPaths, opts, additionalOpts, finishCallback);
        if (promise === null) {
          return;
        }

        promise.then(function(testResults) {
          if (modulePaths.length) {
            setTimeout(function() {
              runNextModule();
            }, 100);
          } else {
            var reporter = new Reporter(globalResults, testResults, globalStartTime, {
              output_folder : additionalOpts.output_folder,
              filename_prefix : opts.report_prefix,
              globals : opts.globals,
              reporter : additionalOpts.reporter,
              start_session : opts.start_session
            });

            if (opts.output) {
              reporter.printTotalResults(globalResults, testResults);
            }

            reporter.save().then(function() {
              reporter.globalReporter(opts.globals)(globalResults, function() {
                finishCallback(null, globalResults);
              });
            }, function(err) {
              console.log(Logger.colors.yellow('Output folder doesn\'t exist and cannot be created.'));
              console.log(err.stack);
              finishCallback(null);
            });
          }
        }, function(err) {
          finishCallback(err, globalResults);
        });
      })();

    });

    processListener(finishCallback);
  };
})();
