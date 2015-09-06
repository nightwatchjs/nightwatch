var fs = require('fs');
var path = require('path');
var util = require('util');
var mkpath = require('mkpath');
var Logger = require('../util/logger.js');
var Utils = require('../util/utils.js');
var Q = require('q');

var Reporter = module.exports = function(globalResults, testResults, globalStartTime, options) {
  this.globalResults = globalResults;
  this.testResults = testResults;
  this.globalStartTime = globalStartTime;
  this.options = options;
  this.reporter = options.reporter || 'junit';
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
          console.log(Logger.colors.yellow('Warning: Failed to save report file to folder: ' + self.options.output_folder));
          console.log(err.stack);
        }
        deferred.resolve();
      });
    }
  });

  return deferred.promise;
};

Reporter.prototype.printTotalResults = function(modulekeys, results) {
  var elapsedTime = new Date().getTime() - this.globalStartTime;
  process.stdout.write('\n');

  if (this.testsFailed()) {
    var countMessage = this.getTestsFailedMessage();

    console.log('----------------------------------------------------');
    console.log(Logger.colors.light_red('TEST FAILURE:'), countMessage, '(' + Utils.formatElapsedTime(elapsedTime) + ')');

    this.printSummary();
    console.log('');
  } else {
    if (!this.showSummary()) {
      return;
    }

    var message = this.getTestsPassedMessage();
    console.log(message + ' (' + Utils.formatElapsedTime(elapsedTime) + ')');
  }
};

Reporter.prototype.testsFailed = function() {
  return Object.keys(this.globalResults.modules).some(function(moduleKey) {
    return this.globalResults.modules[moduleKey].failures > 0 || this.globalResults.modules[moduleKey].errors > 0;
  }.bind(this));
};

Reporter.prototype.showSummary = function() {
  var modules = Object.keys(this.globalResults.modules);
  return modules.length > 1 || Object.keys(this.globalResults.modules[modules[0]].completed).length > 1;
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
    message = Logger.colors.green('OK. ' + count) + (count > 1 ? ' total assertions' : ' assertion') + ' passed.';
  } else {
    count = this.getTotalTestsCount();
    message = Logger.colors.green('OK. ' + count) + ' tests passed.';
  }

  return message;
};

Reporter.prototype.getTotalTestsCount = function() {
  var count = 0;
  Object.keys(this.globalResults.modules).forEach(function(moduleKey) {
    count += this.globalResults.modules[moduleKey].tests;
  }.bind(this));
  return count;
};

Reporter.prototype.getTestsFailedMessage = function() {
  var hasCount = this.hasAssertionCount();
  if (!hasCount) {
    return '';
  }

  var skipped = '';

  if (this.testResults.skipped) {
    skipped = ' and ' + Logger.colors.cyan(this.testResults.skipped) + ' skipped.';
  }

  var errorsMsg = '';

  if (this.globalResults.errors) {
    var use_plural = this.globalResults.errors > 1 ? 's' : '';
    errorsMsg += Logger.colors.red(this.globalResults.errors) + ' error' + use_plural + ' during execution, ';
  }

  return errorsMsg + Logger.colors.red(this.globalResults.failed) +
      ' assertions failed, ' + Logger.colors.green(this.globalResults.passed) + ' passed' + skipped;
};

Reporter.prototype.printSummary = function() {
  Object.keys(this.globalResults.modules).forEach(function(moduleKey) {
    if (this.globalResults.modules[moduleKey].failures > 0) {
      console.log(Logger.colors.red(' ' + String.fromCharCode(10006) + ' ' + moduleKey));
      Object.keys(this.globalResults.modules[moduleKey].completed).forEach(function(testcase) {
        var test = this.globalResults.modules[moduleKey].completed[testcase];
        if (test.failed > 0) {
          console.log('   - ' + testcase);
          test.assertions.forEach(function(a) {
            if (a.failure !== false) {
              if (this.options.start_session) {
                console.log('     ' + a.message + ' - ' + a.failure);
              } else {
                console.log('     ' +  a.stacktrace.split('\n').join('\n    '));
              }
            }

          }.bind(this));
        }
      }.bind(this));

      if (this.globalResults.modules[moduleKey].skipped.length > 0) {
        console.log(Logger.colors.cyan('   SKIPPED:'));
        this.globalResults.modules[moduleKey].skipped.forEach(function(testcase) {
          console.log('   - ' + testcase);
        });
      }
    }
  }.bind(this));
};