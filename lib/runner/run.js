/**
 * Module dependencies
 */
var path = require('path');
var fs = require('fs');
var util = require('util');
var mkpath = require('mkpath');
var minimatch = require('minimatch');
var Nightwatch = require('../../index.js');
var Logger = require('../util/logger.js');

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

  function runModule(module, opts, moduleName, moduleCallback, finishCallback) {
    var client;
    try {
      client = Nightwatch.client(opts);
    } catch (err) {
      console.log(err.stack);
      finishCallback(err, false);
      return;
    }
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
      globalResults.modules[moduleName][currentTest] = {
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
        finishCallback({message: 'Connection refused! Is selenium server started?', data : error}, false);
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
          console.log(Logger.colors.red('\nAn error occured while running the test:'));
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
        skipped += 'Step' + plural + ' ' + modulekeys.join(', ') + ' skipped.';
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

  function processExitListener() {
    process.on('exit', function (code) {
      if (globalResults.errors > 0 || globalResults.failed > 0) {
        process.exit(1);
      } else {
        process.exit(code);
      }
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
    var extensionPattern = /\.js$/;
    if (paths.length == 1 && extensionPattern.test(paths[0])) {
      paths[0] = paths[0].replace(extensionPattern, '');
      return cb(null, paths);
    }

    paths.forEach(function(p) {
      if (opts.exclude) {
        if (!Array.isArray(opts.exclude)) {
          opts.exclude = [opts.exclude];
        }
        opts.exclude = opts.exclude.map(function(item) {
          // remove trailing slash
          if (item.charAt(item.length-1) === path.sep) {
            item = item.substring(0, item.length-1);
          }
          return path.join(p, item);
        });
      }

      if (opts.filter) {
        if (opts.filter.charAt(opts.filter.length-1) === path.sep) {
          opts.filter = opts.filter.substring(0, opts.filter.length-1);
        }
        opts.filter = path.join(p, opts.filter);
      }

      walk(p, function(err, list) {
        if (err) {
          return cb(err);
        }
        list.sort();

        var modules = list.filter(function (filePath) {
          var filename = filePath.split(path.sep).slice(-1)[0];

          if (opts.exclude) {
            for (var i = 0; i < opts.exclude.length; i++) {
              if (minimatch(filePath, opts.exclude[i])) {
                return false;
              }
            }
          }

          if (opts.filter) {
            return minimatch(filePath, opts.filter);
          }

          if (opts.filename_filter) {
            console.log('filter', filename, opts.filename_filter);
            return minimatch(filename, opts.filename_filter);
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
   * @param {Array} src_folders
   * @returns {string}
   */
  function getPathDiff(modulePath, src_folders) {
    var pathParts = modulePath.split(path.sep);
    pathParts.pop();

    var moduleFolder = pathParts.join(path.sep);
    var diffInFolder = '', srcFolder;

    for (var i = 0; i < src_folders.length; i++) {
      srcFolder = path.resolve(src_folders[i]);
      if (moduleFolder.indexOf(srcFolder) === 0) {
        diffInFolder = moduleFolder.substring(srcFolder.length);
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
      return (offset > 0 && (string.charAt(offset-1) != ' ') ? ' ':'') + $1;
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
      opts.modulesNo = fullpaths && fullpaths.length || 0;

      if (!fullpaths || fullpaths.length === 0) {
        finishCallback({message: 'No tests defined! using source folder ' + paths});
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

      var moduleName = modulePath.split(path.sep).pop();
      globalResults.modules[moduleName] = [];

      if (opts.output) {
        var testSuiteName = getTestSuiteName(moduleName) + ' Test Suite';
        console.log('\n' + Logger.colors.cyan(testSuiteName, Logger.colors.background.black));
        console.log(Logger.colors.purple(new Array(testSuiteName.length + 1).join('=')));
      }
      runModule(module, opts, moduleName, function(err, modulekeys) {
        if (fullpaths.length) {
          setTimeout(function() {
            runTestModule(err, fullpaths);
          }, 0);
        } else {
          if (opts.output) {
            printTotalResults(globalResults, modulekeys, globalStartTime);
          }

          if (additional_opts.output_folder === false) {
            finishCallback(null, globalResults, modulekeys);
          } else {
            var diffInFolder = getPathDiff(modulePath, additional_opts.src_folders);
            var output = path.join(additional_opts.output_folder, diffInFolder);
            mkpath(output, function(err) {
              if (err) {
                console.log(Logger.colors.yellow('Output folder doesn\'t exist and cannot be created.'));
                console.log(err.stack);
                finishCallback(null);
                return;
              }

              var Reporter = require('./reporters/junit.js');
              Reporter.save(globalResults, {
                output_folder : output,
                filename_prefix : opts.report_prefix
              }, function(err) {
                if (err) {
                  console.log(Logger.colors.yellow('Warning: Failed to save report file to folder: ' + output));
                  console.log(err.stack);
                }
              });
              finishCallback(null);
            });
          }
        }
      }, finishCallback);
    }, opts);

    processExitListener();
  };
})();
