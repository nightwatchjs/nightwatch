var path = require('path');
var Q = require('q');
var Logger = require('../util/logger.js');
var Utils = require('../util/utils.js');
var Reporter = require('../runner/reporter.js');
var DEFAULT_UNITTEST_HOOK_TIMEOUT = 2000;

function TestCase(suite, testFn, numRetries, maxRetries) {
  this.suite = suite;
  this.testFn = testFn;
  this.numRetries = numRetries;
  this.maxRetries = maxRetries;
  this.currentDeferred = null;
  this._deferredNext = null;
  this.running = false;
  this.lastTimerId = null;
  this.asyncHookTimeout = this.suite.client.globals('asyncHookTimeout') || DEFAULT_UNITTEST_HOOK_TIMEOUT;
}

TestCase.prototype.print = function () {
  var opts = this.suite.options;

  if (opts.output && opts.start_session && opts.detailed_output) {
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
  return this.suite.client.results();
};

TestCase.prototype.getErrors = function () {
  return this.suite.client.errors();
};

TestCase.prototype.run = function () {
  var self = this;
  this.currentDeferred = Q.defer();

  this.startTime = new Date().getTime();
  this.results = null;
  this.errors = null;
  this.running = true;

  this.suite
    .beforeEach()
    .then(function() {
      self._deferredNext = Q.defer();
      self.suite.client.once('complete', function(results, errors) {
        if (self.suite.client.options.start_session) {
          self._deferredNext.resolve({
            results: self.getResults(),
            errors: self.getErrors()
          });
        }
      }).on('error', function(result) {
        self._deferredNext.reject(result);
      });

      try {
        if (self.suite.client.options.start_session) {
          self.suite.module.call(self.testFn, self.suite.client.api());
        } else {
          var doneFn = self.setDoneCallbackTimer(self.doneCallback.bind(self), self.testFn, function(timeoutId) {
            timeoutId.currentTest = self.testFn;
            self.lastTimerId = timeoutId;
          });

          self.doneFn = self.suite.module.callAsync(self.testFn, self.suite.client.api(), doneFn, self.suite.expectedAsyncArgs);
        }
      } catch (err) {
        self.catchHandler(err);
        return self._deferredNext.promise;
      }

      self.suite.client.start();

      return self._deferredNext.promise;
    })
    .then(function onSuccess(response) {
      return self.suite.afterEach(response.results, response.errors);
    }, function onError(error) {
      self.currentDeferred.reject(error);
    })
    .then(function() {
      var time = new Date().getTime() - self.startTime;
      self.currentDeferred.resolve({
        results: self.getResults(),
        errors: self.getErrors(),
        time : time
      });

      self.running = false;
    })
    .catch(function(error) {
      self.currentDeferred.reject(error);
      self.running = false;
    });

  return self.currentDeferred.promise;
};

TestCase.prototype.setDoneCallbackTimer = function(done, fnName, onTimerStarted) {
  return Utils.setCallbackTimeout(done, fnName, this.asyncHookTimeout, function(err) {
    throw err;
  }, onTimerStarted);
};

TestCase.prototype.doneCallback = function(err) {
  var self = this;

  if (this.lastTimerId) {
    clearTimeout(this.lastTimerId);
    this.lastTimerId = null;
  }

  if (this.suite.currentHookTimeoutId) {
    clearTimeout(this.suite.currentHookTimeoutId);
    this.suite.currentHookTimeoutId = null;
  }

  setImmediate(function() {
    if (self._deferredNext) {
      self._deferredNext.resolve({
        results : self.getResults(),
        errors : self.getErrors()
      });
    }
  });

  if (Utils.isErrorObject(err)) {
    this.setFailed(err);
  }

  if (!this.suite.options.output || !this.currentDeferred) {
    return;
  }

  if (!this.suite.options.start_session) {
    this.currentDeferred.promise.then(function(results) {
      console.log(Reporter.getTestOutput(err, this.testFn, results.time));
    }.bind(this));
  }

  if (err && this.suite.options.start_session) {
    this.suite.client.terminate();
  }
};

TestCase.prototype.setFailed = function(err) {
  this.suite.client.handleException(err);
};

TestCase.prototype.catchHandler = function(err) {
  this.doneCallback(err);
};

module.exports = TestCase;
