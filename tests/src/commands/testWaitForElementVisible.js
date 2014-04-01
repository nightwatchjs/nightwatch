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

    this.client.api.waitForElementVisible('#weblogin', 110, 50, function callback(result, instance) {
      test.equal(assertion[0], false);
      test.equal(assertion[1], 'not visible');
      test.equal(assertion[4], true);

      test.done();
    });
  },

  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
