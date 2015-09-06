var MockServer  = require('mockserver');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();

    callback();
  },

  testNotVisible : function(test) {
    var assertion = [];
    this.client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/displayed',
      method:'GET',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0,
        value : false
      })
    });
    this.client.api.globals.abortOnAssertionFailure = false;
    this.client.api.waitForElementVisible('#weblogin', 110, 50, function callback(result, instance) {
      test.equal(assertion[0], false);
      test.equal(assertion[1], 'not visible');
      test.equal(assertion[4], false);

      test.done();
    });
  },

  'test not visible with global timeout default': function(test) {
    var assertion = [];
    this.client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };
    this.client.api.globals.waitForConditionTimeout = 55;
    this.client.api.waitForElementVisible('#weblogin', function callback(result, instance) {
      test.equal(assertion[0], false);
      test.equal(assertion[3], 'Timed out while waiting for element <#weblogin> to be visible for 55 milliseconds.');
      test.equal(assertion[1], 'not visible');
      test.equal(assertion[4], true);

      test.done();
    });
  },

  'test not visible with global timeout default and custom message': function(test) {
    var assertion = [];
    this.client.assertion = function(result, actual, expected, msg, abortObFailure) {
      Array.prototype.unshift.apply(assertion, arguments);
    };
    this.client.api.globals.waitForConditionTimeout = 55;
    this.client.api.waitForElementVisible('#weblogin', function callback(result, instance) {
      test.equal(assertion[3], 'Test message <#weblogin> and a global 55 ms.');
      test.done();
    }, 'Test message <%s> and a global %s ms.');
  },

  'test not visible with no args and global timeout not set': function(test) {
    var command = function() {
      this.client.api.waitForElementVisible('foo');
    };

    test.throws(command, Error, 'Timeout should be picked up globally if not provided');
    test.done();
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
