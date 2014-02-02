var CommandQueue = require('../../lib/queue.js');

module.exports = {
  setUp: function (callback) {
    CommandQueue.reset();
    this.client = require('../nightwatch.js').init();
    
    callback();
  },
  
  "Test commands queue" : function(test) {
    var self = this, client = this.client, urlCommand, endCommand;
    this.client.on('queue:finished', function() {
      test.equal(true, urlCommand.done)
      test.equal(true, endCommand.children[0].done);
      test.equal(true, endCommand.done)
      test.done();
    });
    
    client.url('http://localhost').end();
    test.deepEqual(CommandQueue.list(), [ 'url', 'end']);
    
    this.client.on('selenium:session_create', function(sessionId) {
      urlCommand = CommandQueue.instance().rootNode.children[0];
      endCommand = CommandQueue.instance().rootNode.children[1];
      test.equal(false, endCommand.done);      
      test.equal(false, urlCommand.done);
      test.equal(false, endCommand.started);
      test.equal(true, urlCommand.started);
    });
    
  },
  
  tearDown : function(callback) {
    // clean up
    this.client = null;
    CommandQueue.reset();    
    callback();
  }
}
      
