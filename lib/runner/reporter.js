var fs = require('fs');
var path = require('path');
var util = require('util');
var mkpath = require('mkpath');
var Logger = require('../util/logger.js');
var colors = Logger.colors;
var format = util.format;
var Utils = require('../util/utils.js');
var Q = require('q');

var Reporter = module.exports = function(globalResults, testResults, globalStartTime, options) {
  this.globalResults = globalResults;
  this.testResults = testResults;
  this.globalStartTime = globalStartTime;
  this.options = options;
  this.reporter = options.reporter || 'junit';
};

var printf = function() {
  console.log(format.apply(null, arguments));
};

/**
 * @static
 * @param err
 * @param testname
 * @param time
 * @return {string}
 */
Reporter.getTestOutput = function (err, testname, time) {
  var symbol;
  if (Utils.isErrorObject(err)) {
    symbol = Logger.colors.red(Utils.symbols.fail);
    testname = Logger.colors.red(testname);
  } else {
    symbol = Logger.colors.green(Utils.symbols.ok);
  }

  var args = [
    '%s %s', symbol, testname
  ];

  if (time > 20) {
    args[0] += ' %s';
    args.push(Logger.colors.yellow(Utils.format('(%s)', Utils.formatElapsedTime(time))));
  }

  return Utils.format.apply(null, args);
};

Reporter.printAssertions = function(test) {
  test.assertions.forEach(function(a) {
    if (a.failure !== false) {
      var message = a.stackTrace.split('\n');
      message.unshift(a.fullMsg);
      Utils.showStackTrace(message.join('\n'));
    }
  });

  if (test.stackTrace) {
    Utils.showStackTrace(test.stackTrace);
  }
};

Reporter.prototype.get = function() {
  var fileName = __dirname + '/reporters/' + this.reporter + '.js';

  if (fs.existsSync(fileName)) {
    return require(fileName);
  }

  fileName = path.resolve(this.reporter);

  if (fs.existsSync(fileName)) {
    var reporter = require(fileName);
    if (typeof reporter.write == 'function') {
      return reporter;
    }
    throw new Error('The reporter module must have a public `write` method defined.');
  }

  throw new Error('The reporter file name cannot be resolved. Using path: ' + fileName);
};

/**
 * @param {object} globals
 * @returns {function}
 */
Reporter.prototype.globalReporter = function(globals) {
  var reporterFn = Utils.checkFunction('reporter', globals) || function() {};
  return Utils.makeFnAsync(2, reporterFn, globals);
};

Reporter.prototype.isDisabled = function() {
  return this.options.output_folder === false;
};

Reporter.prototype.createFolder = function(cb) {
  if (this.isDisabled()) {
    cb(null);
  } else {
    mkpath(this.options.output_folder, cb);
  }
};

Reporter.prototype.save = function() {
  var self = this;
  var deferred = Q.defer();
  this.createFolder(function(err) {
    if (self.isDisabled()) {
      deferred.resolve();
    } else {
      if (err) {
        deferred.reject(err);
        return;
      }

      var reporter = self.get();

      reporter.write(self.globalResults, self.options, function(err) {
        if (err) {
          console.log(colors.yellow(format('Warning: Failed to save report file to folder: %s', self.options.output_folder)));
          console.log(err.stack);
        }
        deferred.resolve(err);
      });
    }
  });

  return deferred.promise;
};

Reporter.prototype.printTotalResults = function() {
  var elapsedTime = new Date().getTime() - this.globalStartTime;
  process.stdout.write('\n');

  if (this.testsFailed()) {
    var countMessage = this.getTestsFailedMessage();

    console.log(colors.light_red(' _________________________________________________'));
    console.log(
      format('\n %s', colors.light_red('TEST FAILURE:')),
      countMessage,
      format('(%s)', Utils.formatElapsedTime(elapsedTime))
    );


    this.printFailureSummary();
    console.log('');
  } else {
    if (!this.shouldShowSummary()) {
      return;
    }

    var message = this.getTestsPassedMessage();
    printf('%s (%s)', message, Utils.formatElapsedTime(elapsedTime));
  }
};

Reporter.prototype.testsFailed = function() {
  return Object.keys(this.globalResults.modules).some(function(moduleKey) {
    return this.globalResults.modules[moduleKey].failures > 0 || this.globalResults.modules[moduleKey].errors > 0;
  }.bind(this));
};

Reporter.prototype.shouldShowSummary = function() {
  var modules = Object.keys(this.globalResults.modules);
  if (modules.length > 1) {
    return true;
  }

  if (modules.length <= 0) {
    return false;
  }

  return  Object.keys(this.globalResults.modules[modules[0]].completed).length > 1;
};

Reporter.prototype.hasAssertionCount = function() {
  return Object.keys(this.globalResults.modules).length > 0 &&
    (this.globalResults.failed > 0 || this.globalResults.passed > 0);
};

Reporter.prototype.getTestsPassedMessage = function() {
  var hasCount = this.hasAssertionCount();
  var message;
  var count;

  if (hasCount) {
    count = this.globalResults.passed;
    message = colors.green(format('OK. %s %s passed.', count, (count > 1 ? ' total assertions' : ' assertion')));
  } else {
    count = this.getTotalTestsCount();
    message = format('%s tests passed.', colors.green('OK. ' + count));
  }

  return message;
};

Reporter.prototype.getTotalTestsCount = function() {

  var module;

  return Object.keys(this.globalResults.modules).reduce(function(count, moduleKey) {
    module = this.globalResults.modules[moduleKey];
    return count + module.tests - module.skipped.length;
  }.bind(this), 0);
};

Reporter.prototype.getTestsFailedMessage = function() {
  var hasCount = this.hasAssertionCount();
  if (!hasCount && this.testResults.errmessages === 0) {
    return '';
  }
  var errorsMsg = '';
  var failedMsg = 'assertions';
  var passedMsg = format('%s passed', colors.green(this.globalResults.passed));

  if (!this.options.start_session) {
    failedMsg = 'tests';
    var passedCount = Math.max(0, this.getTotalTestsCount() - this.globalResults.failed);
    passedMsg = format('%s passed', colors.green(passedCount));
  }

  var skipped = '';
  if (this.testResults.skipped) {
    skipped = format(' and %s skipped', colors.cyan(this.testResults.skipped));
  }

  var globalErrors = this.globalResults.errors || this.testResults.errors;
  if (globalErrors) {
    var suffix = globalErrors > 1 ? 's' : '';
    errorsMsg += format('%s error%s during execution, ', colors.red(globalErrors), suffix);
  }

  return format('%s %s %s failed, %s%s.', errorsMsg, colors.red(this.globalResults.failed), failedMsg, passedMsg, skipped);
};

Reporter.prototype.printFailureSummary = function() {
  Object.keys(this.globalResults.modules).forEach(function(moduleKey) {
    var testSuite = this.globalResults.modules[moduleKey];
    if (testSuite.failures > 0 || testSuite.errors > 0) {

      console.log('\n' + colors.red(format(' %s %s', Utils.symbols.fail, moduleKey)));

      Object.keys(testSuite.completed).forEach(function(testcase) {
        var test = testSuite.completed[testcase];
        if (test.failed > 0 || test.errors > 0) {
          printf('\n   - %s %s', testcase, colors.yellow('(' + Utils.formatElapsedTime(test.timeMs) + ')'));

          if (test.assertions.length > 0 && this.options.start_session) {
            Reporter.printAssertions(test);
          } else if (test.stackTrace) {
            Utils.showStackTrace(test.stackTrace);
          }
        }
      }.bind(this));

      if (Array.isArray(testSuite.errmessages)) {
        testSuite.errmessages.forEach(function(err) {
          console.log('');
          Utils.showStackTrace(err);
          console.log('');
        });
      }


      if (testSuite.skipped.length > 0) {
        console.log(colors.cyan('   SKIPPED:'));
        testSuite.skipped.forEach(function(testcase) {
          printf('   - %s', testcase);
        });
      }
    }
  }.bind(this));

  if (Array.isArray(this.globalResults.errmessages) && Object.keys(this.globalResults.modules).length === 0) {
    this.globalResults.errmessages.forEach(function(err) {
      console.log('');
      Utils.showStackTrace(err);
      console.log('');
    }.bind(this));
  }
};
