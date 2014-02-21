module.exports = {
  setUp: function (callback) {
    this.client = require('../nightwatch.js').init();
    callback();
  },

  "Test initialization" : function(test) {
    var self = this;

    this.client.on('selenium:session_create', function(sessionId) {
      test.equal(self.client.sessionId, 1352110219202, "Testing if session ID was set correctly");
      test.done();
    });
  },

  testAddCommand : function(test) {
    this.client.on('selenium:session_create', function(sessionId) {
      test.done();
    });

    var command = function() {
      return "testCommand action";
    };

    this.client.addCommand('testCommand', command, this.client);
    test.ok('testCommand' in this.client, 'Test if the command was added');

    try {
      this.client.addCommand('testCommand', command, this.client);
    } catch (ex) {
      var err = ex;
    }

    test.ok(err instanceof Error);
  },

  testAddCustomCommand : function(test) {
    var client = this.client;
    client.on('selenium:session_create', function(sessionId) {
      test.done();
    });

    var commandsTemp = {};
    var addCommandFn = client.addCommand;
    client.addCommand = function(name, commandFn, context, parent) {
      commandsTemp[name] = {
        fn : commandFn,
        context : context,
        parent : parent
      };
    };

    client.options.custom_commands_path = './extra';
    client.loadCustomCommands();

    test.ok('customCommand' in commandsTemp, 'Test if the custom command was added');
    test.ok('customCommandConstructor' in commandsTemp, 'Test if the custom command was added');
    var command = commandsTemp.customCommandConstructor;

    test.equal(command.context.client, client, 'Command should contain a reference to main client instance.');
  },

  'Test runProtocolCommand without error' : function(test) {
    var client = this.client;
    this.client.on('selenium:session_create', function(sessionId) {
      var request = client.runProtocolCommand({
        host : "127.0.0.1",
        path : "/test",
        port : 10195
      });

      test.ok("send" in request);

      request.on('result', function(result, response) {
        test.equal(result.status, 0);
        test.done();
      }).on('complete', function() {
      }).on('error', function() {
      }).send();
    });
  },

  'Test runProtocolCommand with error' : function(test) {
    var client = this.client;

    this.client.saveScreenshotToFile = function() {};
    this.client.options.screenshots.enabled = true;

    this.client.on('selenium:session_create', function(sessionId) {
      var request = client.runProtocolCommand({
        host : "127.0.0.1",
        path : "/test_error",
        port : 10195
      });

      request.on('result', function(result) {
        test.equal(result.status, -1);
        test.equal(result.errorStatus, 7);
        test.equal(result.value.screen, undefined);
        test.equal(result.error, "An element could not be located on the page using the given search parameters.");
        test.done();
      })
      .send();
    });
  },

  testRunCommand : function(test) {
    var client = this.client;
    client.runCommand('url', ['http://localhost'], function(result) {
      test.ok(true, "Callback 1 was called");
      test.done();
    });
  },

  tearDown : function(callback) {
    this.client.queue.reset();
    this.client = null;
    // clean up
    callback();
  }
}

