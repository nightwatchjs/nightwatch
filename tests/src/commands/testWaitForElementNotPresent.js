var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testSuccess : function(test) {
    var assertion = [];
    this.client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };

    this.client.api.waitForElementNotPresent('.weblogin', 100, 50, function callback(result, instance) {
      test.equal(instance.expectedValue, 'not found');
      test.equal(instance.rescheduleInterval, 50);

      test.equal(assertion[0], true);
      test.equal(assertion[3].indexOf('Element <.weblogin> was not present after'), 0);
      test.equal(assertion[4], true); // abortOnFailure
      test.done();
    });

  },

  testFailure : function(test) {
    var assertion = [];
    this.client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };

    this.client.api.waitForElementNotPresent('#weblogin', 60, 50, function callback(result) {
      test.equal(assertion[0], false);
      test.equal(assertion[1], 'found');
      test.equal(assertion[2], 'not found');
      test.equal(assertion[3], 'Timed out while waiting for element <#weblogin> to be removed for 60 milliseconds.');
      test.equal(assertion[4], true); // abortOnFailure
      test.equal(result.status, 0);
      test.done();
    });
  },

  testFailureNoAbort : function(test) {
    var assertion = [];
    this.client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };
    this.client.api.waitForElementNotPresent('#weblogin', 600, false, function callback(result) {
      test.equal(result.status, 0);
      test.equal(assertion[4], false); // abortOnFailure
      test.done();
    });
  },

  testFailureNoAbortWithCustomInterval : function(test) {
    var assertion = [];
    this.client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };
    this.client.api.waitForElementNotPresent('#weblogin', 60, 50, false, function callback(result) {
      test.equal(result.status, 0);
      test.equal(assertion[4], false); // abortOnFailure
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
