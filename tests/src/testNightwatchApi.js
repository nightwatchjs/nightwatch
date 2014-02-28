var Api = require('../../lib/api.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../nightwatch.js').init();
    callback();
  },

  testAddCommand : function(test) {
    var client = this.client;
    client.on('selenium:session_create', function(sessionId) {
      test.done();
    });
    var command = function() {
      return 'testCommand action';
    };

    Api.addCommand('testCommand', command, this.client);
    test.ok('testCommand' in this.client.api, 'Test if the command was added');

    test.throws(function() {
      Api.addCommand('testCommand', command, client);
    });
  },

  testAddCustomCommand : function(test) {
    var client = this.client;
    client.on('selenium:session_create', function(sessionId) {
      test.done();
    });

    client.options.custom_commands_path = './extra';
    Api.init(client);
    Api.loadCustomCommands();

    test.ok('customCommand' in this.client.api, 'Test if the custom command was added');
    test.ok('customCommandConstructor' in this.client.api, 'Test if the custom command with constructor style was added');

    var queue = client.enqueueCommand('customCommandConstructor', []);
    var command = queue.currentNode;
    test.equal(command.name, 'customCommandConstructor');
    test.equal(command.context.client, client, 'Command should contain a reference to main client instance.');
  },

  tearDown : function(callback) {

    this.client = null;
    // clean up
    callback();
  }
};
