var path = require('path');
var Q = require('q');
var Logger = require('../util/logger.js');
var Utils = require('../util/utils.js');
var failSymbol = String.fromCharCode(10006);
var doneSymbol = String.fromCharCode(10004);

function TestCase(suite, testFn, numRetries, maxRetries) {
  this.suite = suite;
  this.testFn = testFn;
  this.numRetries = numRetries;
  this.maxRetries = maxRetries;
}

TestCase.prototype.print = function () {
  var opts = this.suite.options;

  if (opts.output) {
    process.stdout.write('\n');
    if (this.numRetries > 0) {
      console.log('Retrying (' + this.numRetries + '/' + this.maxRetries + '): ',
        Logger.colors.red(this.testFn));
    } else {
      console.log((opts.parallelMode && !opts.live_output ? 'Results for: ' : 'Running: '),
        Logger.colors.green(this.testFn));
    }
  }
  return this;
};

TestCase.prototype.getResults = function () {
  return this.results;
};

TestCase.prototype.getErrors = function () {
  return this.errors;
};

TestCase.prototype.run = function () {
  var self = this;
  var deferred = Q.defer();

  this.startTime = new Date().getTime();
  this.results = null;
  this.errors = null;

  this.suite
    .beforeEach()
    .then(function() {
      var deferredNext = Q.defer();
      var doneCb = function(err) {
        setImmediate(function() {
          deferredNext.resolve({
            results : self.getResults(),
            errors : self.getErrors()
          });
        });

        if (!self.suite.options.output) {
          return;
        }

        if (!self.suite.options.start_session) {
          deferred.promise.then(function(results) {
            if (err instanceof Error) {
              console.log(' ' + Logger.colors.red(failSymbol + ' Failed ('+ results.time +'ms)'));
            } else {
              console.log(' ' + Logger.colors.green(doneSymbol + ' Passed ('+ results.time +'ms)'));
            }
          });
        }

        if (err) {
          var parts = err.stack.split('\n');
          var headline = parts.shift();

          Utils.showStackTrace(failSymbol + ' ' + headline, parts);
        }
      };

      self.suite.client.once('complete', function(results, errors) {
        self.results = results;
        self.errors = errors;
        if (self.suite.client.options.start_session) {
          deferredNext.resolve({
            results: results,
            errors: errors
          });
        }
      }).on('error', function(result) {
        deferredNext.reject(result);
      });

      try {
        if (self.suite.client.options.start_session) {
          self.suite.module.call(self.testFn, self.suite.client.api());
        } else {
          self.suite.module.callAsync(self.testFn, self.suite.client.api(), doneCb);
        }
      } catch (err) {
        var failed = self.suite.client.results('failed');
        self.suite.client.results('failed', failed+1);

        doneCb(err);
      }

      self.suite.client.start();

      return deferredNext.promise;
    })
    .then(function onSuccess(response) {
      self.results = response.results;
      self.errors = response.errors;

      return self.suite.afterEach(response.results, response.errors);
    }, function onError(error) {
      deferred.reject(error);
    })
    .then(function() {
      var time = new Date().getTime() - self.startTime;
      deferred.resolve({
        results : self.results,
        errors : self.errors,
        time : time
      });
    })
    .catch(function(error) {
      deferred.reject(error);
    });


  return deferred.promise;
};

module.exports = TestCase;
