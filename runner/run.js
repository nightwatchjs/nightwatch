/**
 * Module dependencies
 */
var path = require('path');
var fs = require('fs');
var util = require('util');
var child_process = require('child_process');
var mkpath = require('mkpath');
var minimatch = require('minimatch');
var Nightwatch = require('../index.js');
var Logger = require('../lib/logger.js');
var Reporter = require('./reporters/junit.js');

module.exports = new (function() {
  'use strict';
  var seleniumProcess = null;
  var globalresults = {
    passed : 0,
    failed : 0,
    errors : 0,
    skipped : 0,
    tests : 0,
    errmessages : [],
    modules : {}
  };

  function runModule(module, opts, moduleName, callback) {
    var client = Nightwatch.client(opts);
    var keys   = Object.keys(module);
    var tests  = [];
    var setUp;
    var tearDown;
    var testresults = {
      passed : 0,
      failed : 0,
      errors : 0,
      skipped : 0,
      tests : 0,
      steps : keys.slice(0)
    };

    module.client = client;

    if (keys.indexOf('setUp') > -1) {
      setUp = function(clientFn) {
        module.setUp(module.client);
        clientFn();
      };
      keys.splice(keys.indexOf('setUp'), 1);
      testresults.steps.splice(testresults.steps.indexOf('setUp'), 1);
    } else {
      setUp = function(callback) {callback();};
    }

    if (keys.indexOf('tearDown') > -1) {
      tearDown = function(clientFn) {
        module.tearDown();
        clientFn();
      };
      keys.splice(keys.indexOf('tearDown'), 1);
      testresults.steps.splice(testresults.steps.indexOf('tearDown'), 1);

    } else {
      tearDown = function(callback) {callback();};
    }

    function next() {
      if (keys.length) {
        var key = keys.shift();
        if (typeof module[key] != 'function') {
          next();
          return;
        }

        console.log('\nRunning: ', Logger.colors.green(key));
        var test = wrapTest(setUp, tearDown, module[key], module, function onComplete(results, errors) {
          globalresults.modules[moduleName][key] = {
            passed  : results.passed,
            failed  : results.failed,
            errors  : results.errors,
            skipped : results.skipped,
            tests   : [].concat(results.tests)
          };

          if (Array.isArray(errors) && errors.length) {
            globalresults.errmessages = globalresults.errmessages.concat(errors);
          }

          testresults.passed += results.passed;
          testresults.failed += results.failed;
          testresults.errors += results.errors;
          testresults.skipped += results.skipped;
          testresults.tests += results.tests.length;
          if (this.client.terminated) {
            callback(null, testresults);
          } else {
            setTimeout(next, 0);
          }
        });

        var error = false;
        try {
          test(client);
        } catch (err) {
          globalresults.errmessages.push(err.message);
          console.log(Logger.colors.red('\nAn error occured while running the test:'));
          console.log(err.stack);
          testresults.errors++;
          client.terminate();
          error = true;
          callback(err, testresults);
        }

        if (!error) {
          client.start();
        }

      } else {
        callback(null, testresults);
      }
    }

    setTimeout(next, 0);
  }

  function printResults(testresults) {
    if (testresults.passed > 0 && testresults.errors === 0 && testresults.failed === 0) {
      console.log(Logger.colors.green('\nOK. ' + testresults.passed, Logger.colors.background.black), 'total assertions passed.');
    } else {
      var skipped = '';
      if (testresults.skipped) {
        skipped = ' and ' + Logger.colors.blue(testresults.skipped) + ' skipped.';
      }
      console.log(Logger.colors.light_red('\nTEST FAILURE:'), Logger.colors.red(testresults.errors + testresults.failed) +
      ' assertions failed, ' + Logger.colors.green(testresults.passed) + ' passed' + skipped);
    }
  }

  function wrapTest(setUp, tearDown, fn, context, onComplete) {
    return function (client) {
      context.client = client;
      var clientFn = function () {
        client.once('queue:finished', function(results, errors) {
          tearDown.call(context, function() {
            onComplete.call(context, results, errors);
          });
        });

        return fn.call(context, client);
      };

      setUp.call(context, clientFn);
    };
  }

  function runFiles(paths, cb, opts) {
    var extensionPattern = /\.js$/;
    if (paths.length == 1 && extensionPattern.test(paths[0])) {
      paths[0] = paths[0].replace(extensionPattern, '');
      return cb(null, paths);
    }

    paths.forEach(function(p) {
      walk(p, function(err, list) {
        if (err) {
          return cb(err);
        }
        list.sort();

        var modules = list.filter(function (filePath) {
          var filename = filePath.split(path.sep).slice(-1)[0];
          return opts.filter ?
            minimatch(filename, opts.filter) :
            extensionPattern.exec(filePath);
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
            if (opts.skipgroup && opts.skipgroup.indexOf(dirName) > -1) {
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

  this.run = function runner(files, opts, aditional_opts, finishCallback) {
    var start = new Date().getTime();
    var modules = {};
    var curModule;
    var paths;
    finishCallback = finishCallback || function() {};

    if (typeof files == 'string') {
      paths = [files];
    } else {
      paths = files.map(function (p) {
        return path.join(process.cwd(), p);
      });
    }

    if (paths.length === 0) {
      throw new Error('No tests to run.');
    }
    runFiles(paths, function runTestModule(err, fullpaths) {
      if (!fullpaths || fullpaths.length === 0) {
        Logger.warn('No tests defined!');
        console.log('using source folder', paths);
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
      globalresults.modules[moduleName] = [];
      console.log('\n' + Logger.colors.cyan('[ ' + moduleName + ' module ]'));

      runModule(module, opts, moduleName, function(err, testresults) {
        globalresults.passed += testresults.passed;
        globalresults.failed += testresults.failed;
        globalresults.errors += testresults.errors;
        globalresults.skipped += testresults.skipped;
        globalresults.tests += testresults.tests;

        if (fullpaths.length) {
          setTimeout(function() {
            runTestModule(err, fullpaths);
          }, 0);
        } else {
          if (testresults.tests != globalresults.tests || testresults.steps.length > 1) {
            printResults(globalresults);
          }

          var output = aditional_opts.output_folder;
          if (output === false) {
            finishCallback(null);
          } else {
            mkpath(output, function(err) {
              if (err) {
                console.log(Logger.colors.yellow('Output folder doesn\'t exist and cannot be created.'));
                console.log(err.stack);
                finishCallback(null);
                return;
              }

              Reporter.save(globalresults, output, function(err) {
                if (err) {
                  console.log(Logger.colors.yellow('Warning: Failed to save report file to folder: ' + output));
                  console.log(err.stack);
                }
                finishCallback(null);
              });
            });
          }
        }
      });
    }, opts);
  };

})();

