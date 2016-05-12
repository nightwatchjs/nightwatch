var assert = require('assert');
var Globals = require('../../lib/globals/expect.js');
var common = require('../../common.js');
var CommandQueue = common.require('core/queue.js');

module.exports = {
  'test Queue' : {
    beforeEach: function (done) {
      CommandQueue.reset();
      Globals.beforeEach.call(this, done);
    },

    afterEach: function() {
      Globals.afterEach.call(this);
    },

    'Test commands queue' : function(done) {
      var client = this.client, urlCommand, endCommand;
      this.client.once('nightwatch:finished', function() {
        assert.equal(urlCommand.done, true);
        assert.equal(endCommand.children.length, 0);
        assert.equal(endCommand.done, true);
        assert.equal(CommandQueue.list().length, 0);
        done();
      });

      client.api.url('http://localhost').end();

      assert.equal(CommandQueue.list().length, 2);
      urlCommand = CommandQueue.instance().rootNode.children[0];
      endCommand = CommandQueue.instance().rootNode.children[1];

      assert.equal(endCommand.done, false);
      assert.equal(urlCommand.done, false);
      assert.equal(endCommand.started, false);

      this.client.start();
      assert.equal(urlCommand.started, true);
    }
  }
};