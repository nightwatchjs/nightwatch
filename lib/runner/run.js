/**
 * Module dependencies
 */
var path = require('path');
var fs = require('fs');
var mkpath = require('mkpath');
var minimatch = require('minimatch');
var Nightwatch = require('../../index.js');
var Logger = require('../util/logger.js');
var fileMatcher = require('./filematcher.js');

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

  function runModule(module, opts, moduleName, moduleKey, moduleCallback, finishCallback) {
    var client;
    var keys = Object.keys(module);
    var currentTest;
    var setUp;
    var tearDown;
    var testResults = {
      passed  : 0,
      failed  : 0,
      errors  : 0,
      skipped : 0,
      tests   : 0,
      steps   : keys.slice(0)
    };

    var onTestFinished = function (results, errors, startTime) {
      globalResults.modules[moduleKey][currentTest] = {
        passed  : results.passed,
        failed  : results.failed,
        errors  : results.errors,
        skipped : results.skipped,
        tests   : [].concat(results.tests)
      };

      if (Array.isArray(errors) && errors.length) {
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

      if (opts.output && (opts.modulesNo > 1 || testResults.tests !== globalResults.tests || testResults.steps.length > 1)) {
        client.printResult(startTime);
      }

      if (client.terminated) {
        moduleCallback(null, keys);
      } else {
        setTimeout(next, 0);
      }
    };

    var startClient = function(context, clientFn, client, onComplete) {
      client.once('nightwatch:finished', function(results, errors) {
        onComplete(results, errors);
      });
      client.once('error', function(data, error) {
        finishCallback({message: '\nConnection refused! Is selenium server started?', data : error}, false);
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
      if (keys.length) {
        currentTest = keys.shift();
        client.api.currentTest = {
          name : currentTest,
          module : moduleKey.replace(path.sep , '/')
        };

        if (typeof module[currentTest] != 'function') {
          testResults.steps.splice(testResults.steps.indexOf(currentTest), 1);
          next();
          return;
        }

        if (opts.output) {
          process.stdout.write('\n');
          console.log((opts.parallelMode && !opts.live_output ? 'Results for: ' : 'Running: '),
            Logger.colors.green(currentTest), '\n');
        }
        var localStartTime = new Date().getTime();
        var test = wrapTest(setUp, tearDown, module[currentTest], module, function(results, errors) {
          onTestFinished(results, errors, localStartTime);
        }, client);
        var error = false;
        try {
          test(client.api);
        } catch (err) {
          globalResults.errmessages.push(err.message);
          console.log(Logger.colors.red('\nAn error occurred while running the test:'));
          console.log(err.stack);
          testResults.errors++;
          client.terminate();
          error = true;
          moduleCallback(err, testResults);
        }
      } else {
        moduleCallback(null, testResults);
      }
    };

    try {
      if (typeof module.desiredCapabilities == 'object') {
        opts.desiredCapabilities = opts.desiredCapabilities || {};
        for (var capability in module.desiredCapabilities) {
          if (module.desiredCapabilities.hasOwnProperty(capability)) {
            opts.desiredCapabilities[capability] = module.desiredCapabilities[capability];
          }
        }
      }

      client = Nightwatch.client(opts);
    } catch (err) {
      console.log(err.stack);
      finishCallback(err, false);
      return;
    }
    module.client = client.api;

    if (module.disabled === true) {
      if (opts.output) {
        console.log(Logger.colors.cyan(moduleName), 'module is disabled, skipping...');
      }
      moduleCallback(null, false);
      return;
    }

    // handling asynchronous setUp/tearDown case:
    // 1) if setUp/tearDown is defined with only one arg run it synchronously
    // 2) if setUp/tearDown is defined with two args, assume the second one to be the callback
    //    and pass the callbackFn as the second arg to be called from the async operation
    if (keys.indexOf('setUp') > -1) {
      setUp = function(context, clientFn) {
        if (module.setUp.length <= 1) {
          module.setUp.call(context, context.client);
          clientFn();
        } else if (module.setUp.length >= 1) {
          module.setUp.call(context, context.client, clientFn);
        }
      };
      keys.splice(keys.indexOf('setUp'), 1);
      testResults.steps.splice(testResults.steps.indexOf('setUp'), 1);
    } else {
      setUp = function(context, cb) {
        cb();
      };
    }

    if (typeof module.tearDown == 'function') {
      tearDown = function(context, clientFn, client, onTestComplete) {
        if (module.tearDown.length === 0) {
          startClient(context, clientFn, client, function(results, errors) {
            callTearDown(module, results, errors, onTestComplete, false);
          });
        } else if (module.tearDown.length >= 0) {
          startClient(context, clientFn, client, function(results, errors) {
            callTearDown(module, results, errors, onTestComplete, true);
          });
        }
      };
      keys.splice(keys.indexOf('tearDown'), 1);
      testResults.steps.splice(testResults.steps.indexOf('tearDown'), 1);
    } else {
      tearDown = startClient;
    }

    setTimeout(next, 0);
  }

  function callTearDown(module, results, errors, onTestComplete, hasCallback) {
    module.results = results;
    module.errors = errors;

    var tearDownFn = module.tearDown;
    var args = [];
    var callbackFn = function() {
      onTestComplete(results, errors);
    };
    if (hasCallback) {
      args.push(callbackFn);
    }

    tearDownFn.apply(module, args);

    if (!hasCallback) {
      callbackFn();
    }
  }

  function printTotalResults(testresults, modulekeys) {
    var elapsedTime = new Date().getTime() - globalStartTime;
    process.stdout.write('\n');
    if (testresults.passed > 0 && testresults.errors === 0 && testresults.failed === 0) {
      console.log(Logger.colors.green('OK. ' + testresults.passed),
        'total assertions passed. (' + elapsedTime + ' ms)');
    } else {
      var skipped = '';
      if (testresults.skipped) {
        skipped = ' and ' + Logger.colors.cyan(testresults.skipped) + ' skipped.';
      }
      if (modulekeys && modulekeys.length) {
        modulekeys = modulekeys.map(function(e) {
          return Logger.colors.cyan('"' + e + '"');
        });
        var plural = modulekeys.length > 1 ? 's' : '';
        skipped += '\nStep' + plural + ' ' + modulekeys.join(', ') + ' skipped.';
      }
      var errorsMsg = '';
      if (testresults.errors) {
        var use_plural = testresults.errors > 1 ? 's' : '';
        errorsMsg += Logger.colors.red(testresults.errors) + ' error' + use_plural + ' during execution, ';
      }

      console.log(Logger.colors.light_red('\nTEST FAILURE:'), errorsMsg + Logger.colors.red(testresults.failed) +
        ' assertions failed, ' + Logger.colors.green(testresults.passed) + ' passed' + skipped + '.', '(' + elapsedTime + ' ms)');
    }
  }

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
        message: 'An error occurred while running the tests:\n' + err.stack
      });
    });
  }

  function wrapTest(setUp, tearDown, testFn, context, onComplete, client) {
    return function (api) {
      context.client = api;

      var clientFn = function() {
        return tearDown(context, testFn, client, onComplete);
      };

      setUp(context, clientFn);
    };
  }

  function runFiles(paths, cb, opts) {
    var extensionPattern = /\.[^.]*?$/; // Replace everything after the last . in the file

    if (paths.length === 1 && extensionPattern.test(paths[0])) {
      paths[0] = paths[0].replace(extensionPattern, '');
      return cb(null, paths);
    }

    paths.forEach(function(p) {
      if (opts.exclude) {
        opts.exclude = fileMatcher.exclude.adaptFilePath(p, opts.exclude);
      }

      if (opts.filter) {
        opts.filter = fileMatcher.filter.adaptFilePath(p, opts.filter);
      }

      walk(p, function(err, list) {
        if (err) {
          return cb(err);
        }
        list.sort();

        var modules = list.filter(function (filePath) {
          var filename = filePath.split(path.sep).slice(-1)[0];

          if (opts.exclude && fileMatcher.exclude.match(filePath, opts.exclude)) {
            return false;
          }

          if (opts.filter) {
            return fileMatcher.filter.match(filePath, opts.filter);
          }

          if (opts.filename_filter) {
            return minimatch(filename, opts.filename_filter);
          }

          if (opts.tag_filter) {
            return fileMatcher.tags.match(filePath, opts.tag_filter);
          }

          return extensionPattern.exec(filePath);
        });

        modules = modules.map(function (filename) {
          return filename.replace(extensionPattern, '');
        });

        cb(null, modules);
      }, opts);
    });
  }

  function walk(dir, done, opts) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) {
        return done(err);
      }
      var pending = list.length;

      if (pending === 0) {
        return done(null, results);
      }

      list.forEach(function(file) {
        file = [dir, file].join(path.sep);

        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            var dirName = file.split(path.sep).slice(-1)[0];
            var isExcluded = opts.exclude && opts.exclude.indexOf(file) > -1;
            var isSkipped = opts.skipgroup && opts.skipgroup.indexOf(dirName) > -1;

            if (isExcluded || isSkipped) {
              pending = pending-1;
            } else {
              walk(file, function(err, res) {
                results = results.concat(res);
                pending = pending-1;
                if (!pending) {
                  done(null, results);
                }
              }, opts);
            }
          } else {
            results.push(file);
            pending = pending-1;

            if (!pending) {
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
    if (!opts || !opts.src_folders) {
      return '';
    }
    var diffInFolder = '', srcFolder;

    for (var i = 0; i < opts.src_folders.length; i++) {
      srcFolder = path.resolve(opts.src_folders[i]);
      if (modulePath.indexOf(srcFolder) === 0) {
        diffInFolder = modulePath.substring(srcFolder.length + 1);
        break;
      }
    }

    return diffInFolder;
  }

  function getTestSuiteName(moduleName) {
    var words;

    moduleName = moduleName.replace(/(_|\.)*([A-Z]*)/g, function(match, $0, $1, offset, string) {
      if (!match) {
        return '';
      }
      return (offset > 0 && (string.charAt(offset-1) !== ' ') ? ' ':'') + $1;
    });

    words = moduleName.split(' ').map(function(word) {
      return word.charAt(0).toUpperCase() + word.substr(1);
    });

    return words.join(' ');
  }

  /**
   *
   * @param {Array} test_source
   * @param {object} opts
   * @param {object} additional_opts
   * @param {function} finishCallback
   */
  this.run = function runner(test_source, opts, additional_opts, finishCallback) {
    opts.parallelMode = process.env.__NIGHTWATCH_PARALLEL_MODE == '1';
    opts.live_output = additional_opts.live_output;
    opts.report_prefix = '';

    globalStartTime = new Date().getTime();
    finishCallback = finishCallback || function() {};

    if (typeof test_source == 'string') {
      test_source = [test_source];
    }

    var paths = test_source.map(function (p) {
      if (p.indexOf(process.cwd()) === 0) {
        return p;
      }
      return path.join(process.cwd(), p);
    });

    if (paths.length === 0) {
      throw new Error('No tests to run.');
    }

    runFiles(paths, function runTestModule(err, fullpaths) {
      var errorMessage = ['No tests defined! using source folder:', paths];

      if (opts.tag_filter) {
        errorMessage.push('; using tags:', opts.tag_filter);
      }

      opts.modulesNo = fullpaths && fullpaths.length || 0;

      if (!fullpaths || fullpaths.length === 0) {
        finishCallback({message: errorMessage.join(' ')});
        return;
      }

      var module;
      var modulePath = fullpaths.shift();
      try {
        module = require(modulePath);
      } catch (err) {
        finishCallback(err);
        throw err;
      }

      var moduleParts = modulePath.split(path.sep);
      var moduleName = moduleParts.pop();
      var subFolder = getPathDiff(moduleParts.join(path.sep), additional_opts);
      var moduleKey = path.join(subFolder, moduleName);
      globalResults.modules[moduleKey] = {};

      if (opts.output) {
        var testSuiteName = getTestSuiteName(moduleName) + ' Test Suite';
        console.log('\n' + Logger.colors.cyan(testSuiteName, Logger.colors.background.black));
        console.log(Logger.colors.purple(new Array(testSuiteName.length + 1).join('=')));
      }
      runModule(module, opts, moduleName, moduleKey, function moduleCallback(err, modulekeys) {
        if (fullpaths.length) {
          setTimeout(function() {
            runTestModule(err, fullpaths);
          }, 1000);
        } else {
          if (opts.output) {
            printTotalResults(globalResults, modulekeys, globalStartTime);
          }

          if (additional_opts.output_folder === false) {
            finishCallback(null, globalResults, modulekeys);
          } else {
            mkpath(additional_opts.output_folder, function(err) {
              if (err) {
                console.log(Logger.colors.yellow('Output folder doesn\'t exist and cannot be created.'));
                console.log(err.stack);
                finishCallback(null);
                return;
              }

              var Reporter = require('./reporters/junit.js');
              Reporter.save(globalResults, {
                output_folder : additional_opts.output_folder,
                filename_prefix : opts.report_prefix
              }, function(err) {
                if (err) {
                  console.log(Logger.colors.yellow('Warning: Failed to save report file to folder: ' + additional_opts.output_folder));
                  console.log(err.stack);
                }
                finishCallback(null, globalResults);
              });
            });
          }
        }
      }, finishCallback);
    }, opts);

    processListener(finishCallback);
  };
})();
