var Nightwatch = require('../../lib/nightwatch.js');
var MochaTest = require('../../lib/mochatest.js');
var assert = require('assert');
var common = require('../../common.js');

var path = require('path');
var Api = common.require('core/api.js');

module.exports = MochaTest.add('test Nightwatch Api', {
  testAddCommand : function() {
    var client = Nightwatch.client();
    var api = client.api;
    var command = function() {
      return 'testCommand action';
    };

    assert.equal(api.sessionId, '1352110219202');
    assert.deepEqual(api.capabilities, {
      javascriptEnabled: true,
      browserName: 'firefox',
      version: 'TEST',
      platform: 'TEST'
    });

    assert.deepEqual(api.globals, {
      myGlobal : 'test'
    });

    Api.addCommand('testCommand', command, client);
    assert.ok('testCommand' in client.api, 'Test if the command was added');

    assert.throws(function() {
      Api.addCommand('testCommand', command, client);
    });
  },

  testAddCustomCommand : function() {
    var client = Nightwatch.client();
    client.options.custom_commands_path = [path.join(__dirname, '../../extra/commands')];

    Api.init(client);
    Api.loadCustomCommands();

    assert.ok('customCommand' in client.api, 'Test if the custom command was added');
    assert.ok('customCommandConstructor' in client.api, 'Test if the custom command with constructor style was added');
    assert.ok('other' in client.api, 'Commands under the subfolder were not loaded properly');
    assert.ok('otherCommand' in client.api.other);

    client.api.customCommandConstructor();
    var queue = client.queue.run();
    var command = queue.currentNode;
    assert.equal(command.name, 'customCommandConstructor');
    assert.equal(command.context, client.api, 'Command should contain a reference to main client instance.');
  },


  testAddPageObject : function() {
    var client = Nightwatch.client();
    client.options.page_objects_path = path.join(__dirname, '../../extra/pageobjects');
    Api.init(client);
    Api.loadPageObjects();

    assert.ok(typeof client.api.page == 'object');

    assert.ok('SimplePageFn' in client.api.page);
    assert.ok('simplePageObj' in client.api.page);

    client.api.page.SimplePageFn();

    var simplePage = client.api.page.simplePageObj();
    assert.equal(typeof simplePage, 'object');
  },

  testAddPageObjectArrayPath : function() {
    var client = Nightwatch.client();
    client.options.page_objects_path = [path.join(__dirname, '../../extra/otherPageobjects')];
    Api.init(client);
    Api.loadPageObjects();

    assert.ok(typeof client.api.page == 'object');
    assert.ok('simplePageObj' in client.api.page);
    assert.ok('otherPage' in client.api.page);
  },

  testAddCustomAssertion : function() {
    var client = Nightwatch.client();

    client.options.custom_assertions_path = [path.join(__dirname, '../../extra/assertions')];
    Api.init(client);
    Api.loadCustomAssertions();

    assert.ok('customAssertion' in client.api.assert);
    assert.ok('customAssertion' in client.api.verify);

    client.api.assert.customAssertion(true);
    client.queue.run();
  }
});
