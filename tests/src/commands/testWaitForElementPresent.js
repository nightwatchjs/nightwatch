var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testSuccess : function(test) {
    this.client.api.waitForElementPresent('#weblogin', 100, function callback(result, instance) {
      test.equal(instance.expectedValue, 'found');
      test.equal(result.status, 0);
      test.equal(result.value[0].ELEMENT, '0');
      test.done();
    });
  },

  testFailureWithCustomMessage : function(test) {
    this.client.api.waitForElementPresent('.weblogin', 100, function callback(result, instance) {
      test.equal(instance.message, 'Element .weblogin found in 100 milliseconds');
      test.equal(result.value, false);
      test.done();
    }, 'Element %s found in %d milliseconds');
  },

  testFailure : function(test) {
    this.client.api.waitForElementPresent('.weblogin', 600, function callback(result) {
      test.equal(result.value, false);
      test.done();
    });
  },

  testFailureNoAbort : function(test) {
    this.client.api.waitForElementPresent('.weblogin', 600, false, function callback(result) {
      test.equal(result.value, false);
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
