var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';

var Api = require('../../' + BASE_PATH + '/core/api.js');

module.exports = {
  setUp: function (callback) {
    this.client = require('../nightwatch.js').init();
    callback();
  },

  testAddCommand : function(test) {
    var client = this.client;
    var api = client.api;

    client.on('selenium:session_create', function(sessionId) {
      test.equals(api.sessionId, sessionId);
      test.deepEqual(api.capabilities, {
        javascriptEnabled: true,
        browserName: 'firefox',
        version: 'TEST',
        platform: 'TEST'
    });
      test.done();
    });
    var command = function() {
      return 'testCommand action';
    };

    test.deepEqual(api.globals, {
      myGlobal : 'test'
    });

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

    client.options.custom_commands_path = './extra/commands';
    Api.init(client);
    Api.loadCustomCommands();

    test.ok('customCommand' in this.client.api, 'Test if the custom command was added');
    test.ok('customCommandConstructor' in this.client.api, 'Test if the custom command with constructor style was added');

    var queue = client.enqueueCommand('customCommandConstructor', []);
    var command = queue.currentNode;
    test.equal(command.name, 'customCommandConstructor');
    test.equal(command.context, client.api, 'Command should contain a reference to main client instance.');
  },

    testAddCustomCommandByFilter : function(test) {
        var client = this.client;
        client.on('selenium:session_create', function(sessionId) {
            test.done();
        });

        client.options.custom_commands_path = './extra/coffee/commands';
        client.options.custom_commands_filter = '*.coffee';

        Api.init(client);
        Api.loadCustomCommands();

        test.ok('coffeeCommand' in this.client.api, 'Test if the custom command was added');
        test.ok('coffeeCommandConstructor' in this.client.api, 'Test if the custom command with constructor style was added');
        test.ok(!('nonCoffeeCommandConstructor' in this.client.api), 'Test that we successfully avoided the js file with our filter');

        var queue = client.enqueueCommand('coffeeCommandConstructor', []);
        var command = queue.currentNode;
        test.equal(command.name, 'coffeeCommandConstructor');
        test.equal(command.context, client.api, 'Command should contain a reference to main client instance.');
    },

  testAddPageObject : function(test) {
    var client = this.client;
    client.on('selenium:session_create', function(sessionId) {
      test.done();
    });

    client.options.page_objects_path = './extra/pageobjects';
    Api.init(client);
    Api.loadPageObjects();

    test.ok(typeof client.api.page == 'object');
    test.ok('SimplePage' in client.api.page);

    client.api.page.SimplePage(test);
  },

  testAddCustomAssertion : function(test) {
    var client = this.client;
    client.on('selenium:session_create', function(sessionId) {
      test.done();
    });

    client.options.custom_assertions_path = './extra/assertions';
    Api.init(client);
    Api.loadCustomAssertions();

    test.expect(4);
    test.ok('customAssertion' in client.api.assert);
    test.ok('customAssertion' in client.api.verify);

    client.api.assert.customAssertion(test, true);
    client.queue.run();
  },

    testAddCustomAssertionByFilter : function(test) {
        var client = this.client;
        client.on('selenium:session_create', function(sessionId) {
            test.done();
        });

        client.options.custom_assertions_path = './extra/coffee/assertions';
        client.options.custom_assertions_filter = '*.coffee';

        Api.init(client);
        Api.loadCustomAssertions();

        test.expect(4);
        test.ok(!('customAssertion' in client.api.assert));
        test.ok(!('customAssertion' in client.api.verify));
        test.ok('coffeeAssertion' in client.api.assert);
        test.ok('coffeeAssertion' in client.api.verify);

        client.api.assert.coffeeAssertion(test, true);
        client.queue.run();
    },

  tearDown : function(callback) {

    this.client = null;
    // clean up
    callback();
  }
};
