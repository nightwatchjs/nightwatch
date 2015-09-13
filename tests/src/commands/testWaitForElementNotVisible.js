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
    this.client.api.waitForElementNotVisible('#weblogin', 110, 50, function callback(result, instance) {
      test.equal(assertion[0], true);
      test.equal(assertion[4], false);

      test.done();
    });

  },

  testFailure : function(test) {
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
        value : true
      })
    });

    this.client.api.waitForElementNotVisible('#weblogin', 60, 50, function callback(result) {
      test.equal(assertion[0], false);
      test.equal(assertion[1], 'visible');
      test.equal(assertion[2], 'not visible');
      test.equal(assertion[3], 'Timed out while waiting for element <#weblogin> to not be visible for 60 milliseconds.');
      test.equal(assertion[4], true); // abortOnFailure
      test.equal(result.status, 0);
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
