var MockServer  = require('mockserver');
    
module.exports = {
  setUp: function (callback) {
    this.server = MockServer.init();
    this.client = require('../../nightwatch.js').init();
    
    callback();
  },
  
  testCommand : function(test) {
    this.client.pause(200, function() {
      test.done();
    });
    
  },
           
  tearDown : function(callback) {
    this.client = null;
    this.server.close();
    this.server = null;
    
    callback();
  }
}
