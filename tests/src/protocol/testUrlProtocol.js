var protocol = require('../../../lib/selenium/protocol.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../../nightwatch.js').init();
    
    callback();
  },
  
  testPostCommand : function(test) {
    var client = this.client;
    
    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.url.call(client, 'http://localhost');
      
      test.equal(command.request.method, "POST");
      test.equal(command.data, '{"url":"http://localhost"}');
      test.equal(command.request.path, '/wd/hub/session/1352110219202/url');
      command.on('result', function() {
    	test.done();
      })
    });
  },
  
  testGetCommand : function(test) {
    var client = this.client;
    
    this.client.on('selenium:session_create', function(sessionId) {
      var command = protocol.actions.url.call(client, function() {});
      
      test.equal(command.request.method, "GET");
      test.equal(command.request.path, '/wd/hub/session/1352110219202/url');
      command.on('result', function() {
    	test.done();
      })
    });
  },
  
  testCommandCallback : function(test) {
    var client = this.client;
	    
    this.client.on('selenium:session_create', function(sessionId) {
      protocol.actions.url.call(client, function() {
    	   test.ok(true, 'Get callback called');
      });
      
      protocol.actions.url.call(client, 'http://localhost', function() {
      	test.ok(true, 'Post callback called');
      	test.done();
      });
    });  
  },
  
  tearDown : function(callback) {
    this.client = null;
    // clean up
    callback();
  }
}
