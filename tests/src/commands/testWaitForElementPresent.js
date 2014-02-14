var MockServer  = require('mockserver');
    
module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    
    callback();
  },
  
  testSuccess : function(test) {
    this.client.waitForElementPresent('#weblogin', 100, function callback(result) {
      test.ok(result !== false);
      test.done();
    });
  },
  
  testFailure : function(test) {
    this.client.waitForElementPresent('.weblogin', 600, function callback(result) {
      test.equal(result, false);
      test.done();
    });
  },
  
  testFailureNoAbort : function(test) {
    this.client.waitForElementPresent('.weblogin', 600, false, function callback(result) {
      test.equal(result, false);
      test.done();
    });
  },
                
  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
};
