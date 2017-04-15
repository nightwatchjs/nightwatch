var MockServer  = require('mockserver');
    
module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    callback();
  },
  
  testCommand : function(test) {
    var client = this.client;
    
    MockServer.addMock({
      url : "/wd/hub/session/26799769-f840-47ac-8eb1-871bd5420392/url",
      method:'POST',
      response : JSON.stringify({
        sessionId: "26799769-f840-47ac-8eb1-871bd5420392",
        status:0,
        value : 'http://sampleurl.com/'
      })
    });
    
    client.getUrl(function callback(result) {
      test.equals(result, 'http://sampleurl.com/');
      test.done();
    });
  },
           
  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
}
