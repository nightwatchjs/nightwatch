/**
 * Module dependencies
 */
var path = require('path');
var fs = require('fs');
var mkpath = require('mkpath');
var minimatch = require('minimatch');
var Nightwatch = require('../../index.js');
var Logger = require('../util/logger.js');
var Utils = require('../util/utils.js');
var fileMatcher = require('./filematcher.js');

module.exports = new(function() {
  var globalStartTime;
  var globalResults = {
    passed: 0,
    failed: 0,
    errors: 0,
    skipped: 0,
    tests: 0,
    errmessages: [],
    modules: {}
  };
  var globalReporter = null;
  var globalOpts = null;
  var globalAdditionalOpts = null;
  var globalPaths = null;
  var globalFinishCallback = null;
  var runGlobalBeforeEach = null;
  var runGlobalAfterEach = null;


  var runModule = function(module, opts, moduleName, moduleKey, moduleCallback, finishCallback) {

    globalResults.modules[moduleKey] = {};

    var client;
    var keys = Object.keys(module);
    var currentTest;
    var beforeEach;
    var before = module.before || function() {};
    var afterEach;
    var after = module.after || function() {};
    var afterCallback = null;
    var afterIndex = keys.indexOf('after');
    var testResults = {
      passed: 0,
      failed: 0,
      errors: 0,
      skipped: 0,
      tests: 0,
      steps: keys.slice(0)
    };

    var callAfterFn = function(context, afterFn, moduleCallback) {
      if(afterFn.length >= 2) {
        return function(error, results) {
          afterFn.call(context, client && client.api, function() {
            checkQueue(error, results, moduleCallback);
          });
        };
      }

      return function(error, results) {
        afterFn.call(context, client && client.api);
        checkQueue(error, results, moduleCallback);
      };
    };

    var checkQueue = function(error, results, moduleCallback) {
      if(shouldRestartQueue()) {
        restartQueue(function() {
          moduleCallback(error, results);
        });
      } else {
        moduleCallback(error, results);
      }
    };

    var shouldRestartQueue = function() {
      return client && client.queue.list().length;
    };

    var restartQueue = function(onComplete) {
      client.queue.reset();
      client.queue.run(onComplete);
    };

    var onTestFinished = function(results, errors, startTime) {

      globalResults.modules[moduleKey][currentTest] = {
        passed: results.passed,
        failed: results.failed,
        errors: results.errors,
        skipped: results.skipped,
        tests: [].concat(results.tests)
      };

      if(Array.isArray(errors) && errors.length) {
        globalResults.errmessages = globalResults.errmessages.concat(errors);
      }

      testResults.passed += results.passed;
      testResults.failed += results.failed;
      testResults.errors += results.errors;
      testResults.skipped += results.skipped;
      testResults.tests += results.tests.length;

      globalResults.passed += results.passed;
      globalResults.failed += results.failed;
      globalResults.errors += results.errors;
      globalResults.skipped += results.skipped;
      globalResults.tests += results.tests.length;

      if(opts.output && (opts.modulesNo > 1 || testResults.tests !== globalResults.tests || testResults.steps.length > 1)) {
        client.printResult(startTime);
      }

      if(client.terminated) {
        afterCallback(null, keys);
      } else {
        setTimeout(next, 0);
      }
    };

    var startClient = function(context, clientFn, client, onComplete) {
      client.once('nightwatch:finished', function(results, errors) {
        onComplete(results, errors);
      });
      client.once('error', function(data, error) {
        finishCallback({
          message: '\nConnection refused! Is selenium server started?\n',
          data: error
        }, false);
      });
      client.once('selenium:session_create', function() {
        opts.report_prefix = this.api.capabilities.browserName.toUpperCase() +
          '_' + this.api.capabilities.version +
          '_' + this.api.capabilities.platform + '_';
      });

      clientFn.call(context, context.client);

      client.start();
    };

    var next = function() {
      if(keys.length) {
        currentTest = keys.shift();
        client.api.currentTest = {
          name: currentTest,
          module: moduleKey.replace(path.sep, '/')
        };

        if(typeof module[currentTest] != 'function') {
          testResults.steps.splice(testResults.steps.indexOf(currentTest), 1);
          next();
          return;
        }

        if(opts.output) {
          process.stdout.write('\n');
          console.log((opts.parallelMode && !opts.live_output ? 'Results for: ' : 'Running: '),
            Logger.colors.green(currentTest), '\n');
        }
        var localStartTime = new Date().getTime();
        var test = wrapTest(beforeEach, afterEach, module[currentTest], module, function(results, errors) {
          onTestFinished(results, errors, localStartTime);
        }, client);
        var error = false;
        try {
          test(client.api);
        } catch(err) {
          globalResults.errmessages.push(err.message);
          console.log(Logger.colors.red('\nAn error occurred while running the test:'));
          console.log(err.stack);
          testResults.errors++;
          client.terminate();
          error = true;
          afterCallback(err, testResults);
        }
      } else {
        afterCallback(null, testResults);
      }
    };

    if(afterIndex > -1) {
      keys.splice(afterIndex, 1);
      testResults.steps.splice(testResults.steps.indexOf('after'), 1);
      afterCallback = callAfterFn(module, after, moduleCallback);
    } else {
      afterCallback = moduleCallback;
    }

    if(module.disabled === true) {
      if(opts.output) {
        console.log(Logger.colors.cyan(moduleName), 'module is disabled, skipping...');
      }
      afterCallback(null, false);
      return;
    }

    try {
      client = Nightwatch.client(opts);
    } catch(err) {
      console.log(err.stack);
      finishCallback(err, false);
      return;
    }
    module.client = client.api;

    // handling asynchronous setUp/tearDown case:
    // 1) if setUp/tearDown is defined with only one arg run it synchronously
    // 2) if setUp/tearDown is defined with two args, assume the second one to be the callback
    //    and pass the callbackFn as the second arg to be called from the async operation
    if(keys.indexOf('beforeEach') > -1 || keys.indexOf('setUp') > -1) {
      var beforeEachFn = module.beforeEach || module.setUp;
      beforeEach = function(context, clientFn) {
        if(beforeEachFn.length <= 1) {
          beforeEachFn.call(context, context.client);
          clientFn();
        } else if(beforeEachFn.length > 1) {
          beforeEachFn.call(context, context.client, clientFn);
        }
      };
      var index = keys.indexOf('beforeEach');
      if(index == -1) {
        index = keys.indexOf('setUp');
      }
      if(index > -1) {
        keys.splice(index, 1);
      }

      var resultsIndex = testResults.steps.indexOf('beforeEach');
      if(resultsIndex == -1) {
        resultsIndex = testResults.steps.indexOf('setUp');
      }
      if(resultsIndex > -1) {
        testResults.steps.splice(resultsIndex, 1);
      }
    } else {
      beforeEach = function(context, cb) {
        cb();
      };
    }

    if(typeof module.afterEach == 'function' || typeof module.tearDown == 'function') {
      var afterEachFn = module.afterEach || module.tearDown;
      afterEach = function(context, clientFn, client, onTestComplete) {
        var hasCallback = afterEachFn.length > 0;
        startClient(context, clientFn, client, function(results, errors) {
          callTearDown(module, results, errors, onTestComplete, hasCallback);
        });
      };
      var indexAfter = keys.indexOf('afterEach');
      if(indexAfter == -1) {
        indexAfter = keys.indexOf('tearDown');
      }
      if(indexAfter > -1) {
        keys.splice(indexAfter, 1);
      }
      var resultsIndexAfter = testResults.steps.indexOf('afterEach');
      if(resultsIndexAfter == -1) {
        resultsIndexAfter = testResults.steps.indexOf('tearDown');
      }
      if(resultsIndexAfter > -1) {
        testResults.steps.splice(resultsIndexAfter, 1);
      }
    } else {
      afterEach = startClient;
    }

    var beforeIndex = keys.indexOf('before');
    if(beforeIndex > -1) {
      keys.splice(beforeIndex, 1);
      testResults.steps.splice(testResults.steps.indexOf('before'), 1);
      if(before.length >= 2) {
        before.call(module, client.api, function() {
          setTimeout(next, 0);
        });
      } else {
        before.call(module, client.api);
        setTimeout(next, 0);
      }
    } else {
      setTimeout(next, 0);
    }
  };

  function callTearDown(module, results, errors, onTestComplete, hasCallback) {
    module.results = results;
    module.errors = errors;

    var tearDownFn = module.afterEach || module.tearDown;
    var args = [];
    var callbackFn = function() {
      onTestComplete(results, errors);
    };
    if(hasCallback) {
      args.push(callbackFn);
    }

    tearDownFn.apply(module, args);

    if(!hasCallback) {
      callbackFn();
    }
  }

  function printTotalResults(testresults, modulekeys) {
    var elapsedTime = new Date().getTime() - globalStartTime;
    process.stdout.write('\n');
    if(testresults.passed > 0 && testresults.errors === 0 && testresults.failed === 0) {
      console.log(Logger.colors.green('OK. ' + testresults.passed),
        'total assertions passed. (' + Utils.formatElapsedTime(elapsedTime) + ')');
    } else {
      var skipped = '';
      if(testresults.skipped) {
        skipped = ' and ' + Logger.colors.cyan(testresults.skipped) + ' skipped.';
      }
      if(modulekeys && modulekeys.length) {
        modulekeys = modulekeys.map(function(e) {
          return Logger.colors.cyan('"' + e + '"');
        });
        var plural = modulekeys.length > 1 ? 's' : '';
        skipped += '\nStep' + plural + ' ' + modulekeys.join(', ') + ' skipped.';
      }
      var errorsMsg = '';
      if(testresults.errors) {
        var use_plural = testresults.errors > 1 ? 's' : '';
        errorsMsg += Logger.colors.red(testresults.errors) + ' error' + use_plural + ' during execution, ';
      }

      console.log(Logger.colors.light_red('\nTEST FAILURE:'), errorsMsg + Logger.colors.red(testresults.failed) +
        ' assertions failed, ' + Logger.colors.green(testresults.passed) + ' passed' + skipped + '.', '(' + Utils.formatElapsedTime(elapsedTime) + ')');
    }
  }

  function processListener(finishCallback) {
    process.on('exit', function(code) {
      var exitCode = code;
      if(exitCode === 0 && (globalResults.errors > 0 || globalResults.failed > 0)) {
        exitCode = 1;
      }

      process.exit(exitCode);
    });

    process.on('uncaughtException', function(err) {
      finishCallback({
        message: 'An error occurred while running the tests:\n' + err.stack
      });
    });
  }

  function wrapTest(setUp, tearDown, testFn, context, onComplete, client) {

    return function(api) {
      context.client = api;

      var clientFn = function() {
        return tearDown(context, testFn, client, onComplete);
      };

      setUp(context, clientFn);
    };
  }

  function runFiles(paths, cb, opts) {
    var extensionPattern = /\.js$/;
    if(paths.length === 1 && extensionPattern.test(paths[0])) {
      paths[0] = paths[0].replace(extensionPattern, '');
      return cb(null, paths);
    }

    paths.forEach(function(p) {
      if(opts.exclude) {
        opts.exclude = fileMatcher.exclude.adaptFilePath(p, opts.exclude);
      }

      if(opts.filter) {
        opts.filter = fileMatcher.filter.adaptFilePath(p, opts.filter);
      }

      walk(p, function(err, list) {
        if(err) {
          return cb(err);
        }
        list.sort();

        var modules = list.filter(function(filePath) {
          var filename = filePath.split(path.sep).slice(-1)[0];

          if(opts.exclude && fileMatcher.exclude.match(filePath, opts.exclude)) {
            return false;
          }

          if(opts.filter) {
            return fileMatcher.filter.match(filePath, opts.filter);
          }

          if(opts.filename_filter) {
            return minimatch(filename, opts.filename_filter);
          }

          if(opts.tag_filter) {
            return fileMatcher.tags.match(filePath, opts.tag_filter);
          }

          return extensionPattern.exec(filePath);
        });

        modules = modules.map(function(filename) {
          return filename.replace(extensionPattern, '');
        });

        cb(null, modules);
      }, opts);
    });
  }

  function walk(dir, done, opts) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if(err) {
        return done(err);
      }
      var pending = list.length;

      if(pending === 0) {
        return done(null, results);
      }

      list.forEach(function(file) {
        file = [dir, file].join(path.sep);

        fs.stat(file, function(err, stat) {
          if(stat && stat.isDirectory()) {
            var dirName = file.split(path.sep).slice(-1)[0];
            var isExcluded = opts.exclude && opts.exclude.indexOf(file) > -1;
            var isSkipped = opts.skipgroup && opts.skipgroup.indexOf(dirName) > -1;

            if(isExcluded || isSkipped) {
              pending = pending - 1;
            } else {
              walk(file, function(err, res) {
                results = results.concat(res);
                pending = pending - 1;
                if(!pending) {
                  done(null, results);
                }
              }, opts);
            }
          } else {
            results.push(file);
            pending = pending - 1;

            if(!pending) {
              done(null, results);
            }
          }
        });
      });
    });
  }

  /**
   * Get any subfolders relative to the base module path so that we can save the report files into their corresponding subfolders
   *
   * @param {string} modulePath
   * @param {object} opts
   * @returns {string}
   */
  function getPathDiff(modulePath, opts) {
    if(!opts || !opts.src_folders) {
      return '';
    }
    var diffInFolder = '',
      srcFolder;

    for(var i = 0; i < opts.src_folders.length; i++) {
      srcFolder = path.resolve(opts.src_folders[i]);
      if(modulePath.indexOf(srcFolder) === 0) {
        diffInFolder = modulePath.substring(srcFolder.length + 1);
        break;
      }
    }

    return diffInFolder;
  }

  function getTestSuiteName(moduleName) {
    var words;

    moduleName = moduleName.replace(/(_|-|\.)*([A-Z]*)/g, function(match, $0, $1, offset, string) {
      if(!match) {
        return '';
      }
      return(offset > 0 && (string.charAt(offset - 1) !== ' ') ? ' ' : '') + $1;
    });

    words = moduleName.split(' ').map(function(word) {
      return word.charAt(0).toUpperCase() + word.substr(1);
    });

    return words.join(' ');
  }

  /**
   * Wrap a synchronous function, turning it into an async fn with a callback as
   * the last argument if necessary. `asyncArgCount` is the expected argument
   * count if `fn` is already asynchronous.
   *
   * @param {number} asyncArgCount
   * @param {function} fn
   */
  function makeAsync(asyncArgCount, fn) {
    if(fn.length === asyncArgCount) {
      return fn;
    }

    function asyncFn() {
      var args = Array.prototype.slice.call(arguments, 0);
      var done = args.pop();
      fn.apply(null, args);
      done();
    }
    return asyncFn;
  }

  function noopFn() {}

  var postTestModuleCallback = function(err, modulekeys, modules) {
    runGlobalAfterEach.call(globalOpts.globals, function() {

      if(modules.length) {
        setTimeout(function() {
          runTestModule(err, modules);
        }, 1000);
      } else {
        if(globalOpts.output) {
          printTotalResults(globalResults, modulekeys, globalStartTime);
        }

        if(globalAdditionalOpts.output_folder === false) {
          globalReporter.call(globalOpts.globals, globalResults, function() {
            globalFinishCallback(null, globalResults, modulekeys);
          });
        } else {
          mkpath(globalAdditionalOpts.output_folder, function(err) {
            if(err) {
              console.log(Logger.colors.yellow('Output folder doesn\'t exist and cannot be created.'));
              console.log(err.stack);
              globalFinishCallback(null);
              return;
            }

            var Reporter = require('./reporters/junit.js');
            Reporter.save(globalResults, {
              output_folder: globalAdditionalOpts.output_folder,
              filename_prefix: globalOpts.report_prefix
            }, function(err) {
              if(err) {
                console.log(Logger.colors.yellow('Warning: Failed to save report file to folder: ' + globalAdditionalOpts.output_folder));
                console.log(err.stack);
              }

              globalReporter.call(globalOpts.globals, globalResults, function() {
                globalFinishCallback(null, globalResults);
              });
            });
          });
        }
      }
    });
  };

  function loadModules(err, fullpaths) {

    var errorMessage = ['No tests defined! using source folder:', globalPaths];

    if(globalOpts.tag_filter) {
      errorMessage.push('; using tags:', globalOpts.tag_filter);
    }

    globalOpts.modulesNo = fullpaths && fullpaths.length || 0;

    if(!fullpaths || fullpaths.length === 0) {
      globalFinishCallback({
        message: errorMessage.join(' ')
      });
      return;
    }

    var modules = [];

    fullpaths.forEach(function(fullpath) {

      var moduleParts = fullpath.split(path.sep);
      var moduleName = moduleParts.pop();
      var subFolder = getPathDiff(moduleParts.join(path.sep), globalAdditionalOpts);
      var moduleKey = path.join(subFolder, moduleName);

      try {
        var module = require(fullpath);

        if (module) {
            module.moduleKey = moduleKey;
            module.moduleName = moduleName;
            modules.push(module);
        }
      } catch(err) {
        globalFinishCallback(err);
        throw err;
      }
    });

    return modules;
  }


  var runTestModule = function(err, modules) {

    var module = modules.shift();

    if (module.moduleKey === undefined) {
        module.moduleKey = module.moduleName;
    }

    var testSuiteName = getTestSuiteName(module.moduleName);
    if(globalOpts.output) {
      var testSuiteDisplay = '[' + testSuiteName + '] Test Suite';
      console.log('\n' + Logger.colors.cyan(testSuiteDisplay, Logger.colors.background.black));
      console.log(Logger.colors.purple(new Array(testSuiteDisplay.length + 1).join('=')));
    }

    globalOpts.desiredCapabilities = globalOpts.desiredCapabilities || {};
    if(globalOpts.sync_test_names || (typeof globalOpts.sync_test_names == 'undefined')) {
      // optionally send the local test name (derived from filename)
      // to the remote selenium server. useful for test reporting in cloud service providers
      globalOpts.desiredCapabilities.name = testSuiteName;
    }

    if(typeof module.desiredCapabilities == 'object') {
      for(var capability in module.desiredCapabilities) {
        if(module.desiredCapabilities.hasOwnProperty(capability)) {
          globalOpts.desiredCapabilities[capability] = module.desiredCapabilities[capability];
        }
      }
    }

    runGlobalBeforeEach.call(globalOpts.globals, function() {
      runModule(module, globalOpts, module.moduleName, module.moduleKey, function(err, modulekeys) {
        postTestModuleCallback(err, modulekeys, modules);
      }, globalFinishCallback);
    });
  };

  var init = function(opts, additional_opts, finishCallback) {
    globalOpts = opts;
    globalAdditionalOpts = additional_opts;

    globalStartTime = new Date().getTime();

    globalFinishCallback = finishCallback || noopFn;

    runGlobalBeforeEach = !module.disabled && globalOpts.globals && globalOpts.globals.beforeEach || noopFn;
    runGlobalAfterEach = !module.disabled && globalOpts.globals && globalOpts.globals.afterEach || noopFn;
    globalReporter = globalOpts.globals && globalOpts.globals.reporter || noopFn;

    // Convert synchronous functions to async if necessary.
    runGlobalBeforeEach = makeAsync(1, runGlobalBeforeEach);
    runGlobalAfterEach = makeAsync(1, runGlobalAfterEach);
    globalReporter = makeAsync(2, globalReporter);
  };

  /**
   *
   * @param {Array} test_source
   * @param {object} opts
   * @param {object} globalAdditionalOpts
   * @param {function} finishCallback
   */
  var run = function runner(test_source, opts, additional_opts, finishCallback) {

    opts.parallelMode = process.env.__NIGHTWATCH_PARALLEL_MODE == '1';
    opts.live_output = additional_opts.live_output;
    opts.report_prefix = '';

    if(typeof test_source == 'string') {
      test_source = [test_source];
    }

    globalPaths = test_source.map(function(p) {
      if(p.indexOf(process.cwd()) === 0) {
        return p;
      }
      return path.join(process.cwd(), p);
    });

    if(globalPaths.length === 0) {
      throw new Error('No tests to run.');
    }

    init(opts, additional_opts, finishCallback);


    runFiles(globalPaths, function(err, fullpaths) {
        var modules = loadModules(err, fullpaths);

        if (modules !== undefined) {
            runTestModule(err, modules);
        }
    }, opts);

    processListener(finishCallback);
  };

  this.init = init;
  this.run = run;
  this.runTestModule = runTestModule;

})();
