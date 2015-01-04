var path = require('path');
var q = require('q');
var Logger = require('../util/logger.js');

function TestCase(suite, testFn) {
  this.suite = suite;
  this.testFn = testFn;
}

TestCase.prototype.run = function () {
  var self = this;
  var deferred = q.defer();

  this.startTime = new Date().getTime();
  this.results = null;
  this.errors = null;

  this.suite
    .beforeEach()
    .then(function() {
      self.suite.module.call(self.testFn, self.suite.client.api());
      return self.suite.client.start();
    })
    .then(function onSuccess(response) {
      self.results = response.results;
      self.errors = response.errors;
      return self.suite.afterEach(response.results, response.errors);
    }, function onError(error) {
      deferred.reject(error);
    })
    .then(function() {
      return self.suite.client.checkQueue();
    })
    .then(function() {
      var time = new Date().getTime() - self.startTime;
      deferred.resolve({
        results : self.results,
        errors : self.errors,
        time : time
      });
    });

  return deferred.promise;
};

module.exports = TestCase;