var BASE_PATH = process.env.NIGHTWATCH_COV
  ? 'lib-cov'
  : 'lib';

var CommandQueue = require('../../' + BASE_PATH +'/core/queue.js');

module.exports = {
  setUp: function (callback) {
    CommandQueue.reset();
    this.client = require('../nightwatch.js').init();

    callback();
  },

  'Test commands queue' : function(test) {
    var client = this.client, urlCommand, endCommand;
    this.client.on('nightwatch:finished', function() {
      test.equal(true, urlCommand.done);
      test.equal(true, endCommand.children[0].done);
      test.equal(true, endCommand.done);
      test.done();
    });

    client.api.url('http://localhost').end();

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
};
