var path = require('path'),
    fs = require('fs'),
    child_process = require('child_process'),
    nightwatch = require('../index.js'),
    Logger = require("../lib/logger.js"),
    Reporter = require('./reporters/junit.js'),
    seleniumProcess = null,
    util = require('util'),
    globalresults = {
      passed:0,
      failed:0,
      errors:0,
      skipped:0,
      tests:0,
      errmessages:[],
      modules:{}
    };
    
exports.run = function runner(files, opts, aditional_opts, finishCallback) {
  var start = new Date().getTime();
  var modules = {}
  var curModule;
    
  if (typeof files == 'string') {
    var paths = [files];
  } else {
    paths = files.map(function (p) {
      return path.join(process.cwd(), p);
    });
  }
  
  if (paths.length == 0) {
    throw new Error('No tests to run.');
  }
  
  runFiles(paths, function runTestModule(err, fullpaths) {
    if (!fullpaths || fullpaths.length == 0) {
      Logger.warn('No tests defined!');
      console.log('using source folder', paths)
      return;
    }
    
    var modulePath = fullpaths.shift();
    var module     = require(modulePath);
    var moduleName = modulePath.split('/').pop();
    globalresults.modules[moduleName] = [];
    console.log("\n" + Logger.colors.cyan('[ ' + moduleName + ' module ]'));
          
    runModule(module, opts, moduleName, function(testresults) {
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
          finishCallback();  
        } else {
          ensureDir(output, function() {
            Reporter.save(globalresults, output);
            finishCallback();  
          });
        }
      }
    })
  }, opts);  
};

exports.startSelenium = function (settings, test_settings, callback) {
  if (!settings.selenium || !settings.selenium.start_process) {
    callback();
    return;
  }
  
  util.print(Logger.colors.light_purple('Starting selenium server... '));
  var selenium_port = settings.selenium.port || 4444;
  var selenium_host = settings.selenium.host || "127.0.0.1";
  var output = '', error_out = '';
  var spawn = require('child_process').spawn;
  var cliOpts = [
    '-jar', settings.selenium.server_path,
    '-port', selenium_port,
    '-host', selenium_host
  ];
  
  if (test_settings.firefox_profile) {
    cliOpts.push('-Dwebdriver.firefox.profile=' + test_settings.firefox_profile);    
  }
  
  seleniumProcess = spawn('java', cliOpts);
  seleniumProcess.host = selenium_host;
  seleniumProcess.port = selenium_port;
  seleniumProcess.stdout.on('data', function(data) {
    var sentinal = 'Started org.openqa.jetty.jetty.Server';
    output += data.toString();
    if (data.toString().indexOf(sentinal) != -1) {
      seleniumProcess.removeListener('exit', exitHandler);
      util.print(Logger.colors.light_purple('started - PID: ' ) + ' ' + seleniumProcess.pid + "\n" + Logger.colors.light_green("Running tests") + "\n");
      callback(null, seleniumProcess);
    }
  });
  
  seleniumProcess.stderr.on('data', function(data) {
    output += data.toString();
    error_out += data.toString();
  });
  var exitHandler = function(code) {
    callback('Could not start Selenium.', null, error_out, code);
  };
  
  var closeHandler = function() {
    fs.writeFile(path.join(settings.selenium.log_path, 'selenium_out.log'), output, "utf8", function(err) {
      if (err) { 
        Logger.error(err);
      }
    });
    
    Logger.info("Selenium process finished.");
  };
    
  seleniumProcess.on('exit', exitHandler);
  seleniumProcess.on('close', closeHandler);
}

function killSeleniumProcess() {
  var command = "ps -ax | grep [s]elenium | awk {'print $1 '} | xargs kill";
}

exports.stopSelenium = function(callback) {
  callback = callback || function() {};
  if (!seleniumProcess || seleniumProcess.killed) {
    Logger.warn("Selenium process is not started.");
    callback(false);
    return;
  }
  try {
    seleniumProcess.kill();
    callback(true);    
  } catch (e) {
    Logger.warn("Selenium process could not be stopped.");
    console.log(e);
    callback(false);  
  }
}

function printResults(testresults) {
  if (testresults.passed > 0 && testresults.errors == 0 && testresults.failed == 0) {
    console.log(Logger.colors.green("\nOK. " + testresults.passed, Logger.colors.background.black), 'total assertions passed.');
  } else {
    var skipped = '';
    if (testresults.skipped) {
      skipped = ' and ' + Logger.colors.blue(testresults.skipped) + ' skipped.';
    }
    console.log(Logger.colors.light_red("\nTEST FAILURE:"), Logger.colors.red(testresults.errors + testresults.failed) + 
    ' assertions failed, ' + Logger.colors.green(testresults.passed) + ' passed' + skipped);
  }
}

function runModule(module, opts, moduleName, callback) {
  var client = nightwatch.client(opts);
  var keys   = Object.keys(module);
  var tests  = [];
  var testresults = {
    passed:0,
    failed:0,
    errors:0,
    skipped:0,
    tests:0,
    steps:keys.slice(0)
  };
  
  var setUp, tearDown;
  module.client = client;
  
  if (keys.indexOf('setUp') > -1) {
    setUp = function(clientFn) {
      module.setUp(module.client);
      clientFn();
    };
    keys.splice(keys.indexOf('setUp'), 1);
    testresults.steps.splice(testresults.steps.indexOf('setUp'), 1);
  } else {
    setUp = function(callback) {callback();}
  }
  
  if (keys.indexOf('tearDown') > -1) {
    tearDown = function(clientFn) {
      module.tearDown();
      clientFn();
    };
    keys.splice(keys.indexOf('tearDown'), 1);
    testresults.steps.splice(testresults.steps.indexOf('tearDown'), 1);
    
  } else {
    tearDown = function(callback) {callback();}
  }
  
  function next() {
    if (keys.length) {
      var key = keys.shift();
      if (typeof module[key] != "function") {
        next();
        return;
      }
      
      console.log("\nRunning: ", Logger.colors.green(key));
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
          callback(testresults);
        } else {
          setTimeout(next, 0);  
        }
      });
      
      var error = false;
      try {
        test(client);  
      } catch (err) {
        globalresults.errmessages.push(err.message);
        console.log(Logger.colors.red("\nAn error occured while running the test:"));
        console.log(err.stack);
        testresults.errors++;
        client.terminate();
        error = true;
      }
      
      if (!error) {
        client.start();  
      }
        
    } else {
      callback(testresults);
    } 
  }
  setTimeout(next, 0);
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
    return;
  };
};

function ensureDir(path, callback) {
    var mkdir = child_process.spawn('mkdir', ['-p', path]);
    mkdir.on('error', function (err) {
      callback(err);
      callback = function(){};
    });
    mkdir.on('exit', function (code) {
      if (code === 0) callback();
      else callback(new Error('mkdir exited with code: ' + code));
    });
};

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
      
      var modules = list.filter(function (filename) {
        return extensionPattern.exec(filename);
      });
      
      modules = modules.map(function (filename) {
        return filename.replace(extensionPattern, '');
      });

      cb(null, modules);
    }, opts);
  });
  
}

var walk = function(dir, done, opts) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) {
      return done(err);
    }
    var pending = list.length;
    
    if (pending == 0) {
      return done(null, results);
    }
    
    list.forEach(function(file) {
      file = [dir, file].join('/');
      
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          var dirname = file.split('/').slice(-1)[0];
          if (opts.skipgroup && opts.skipgroup.indexOf(dirname) > -1) {
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
};


