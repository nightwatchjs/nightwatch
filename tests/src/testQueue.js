var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';

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
      test.equal(urlCommand.done, true);
      test.equal(endCommand.children.length, 0);
      test.equal(endCommand.done, true);
      test.equal(CommandQueue.list().length, 0);
      test.done();
    });

    client.api.url('http://localhost').end();

    test.equal(CommandQueue.list().length, 2);
    urlCommand = CommandQueue.instance().rootNode.children[0];
    endCommand = CommandQueue.instance().rootNode.children[1];

    this.client.on('selenium:session_create', function(sessionId) {
      test.equal(endCommand.done, false);
      test.equal(urlCommand.done, false);
      test.equal(endCommand.started, false);
      test.equal(urlCommand.started, true);
    });

  },

  tearDown : function(callback) {
    // clean up
    this.client = null;
    CommandQueue.reset();
    callback();
  }
};