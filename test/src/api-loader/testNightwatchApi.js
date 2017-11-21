const assert = require('assert');
const path = require('path');
const mockery = require('mockery');

const common = require('../../common.js');
const MockServer  = require('../../lib/mockserver.js');
const MochaTest = require('../../lib/mochatest.js');


module.exports = MochaTest.add('test Nightwatch Api', {
  beforeEach() {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
  },

  afterEach() {
    mockery.deregisterAll();
    mockery.disable();
  },

  testLoadCommands() {
    mockery.registerMock('../core/queue.js', {
      add(commandName, command, context, args, originalStackTrace) {
        assert.equal(commandName, 'session');
        assert.equal(typeof command, 'function');
        assert.equal(args[0], 'POST');
        assert.equal(typeof args[1], 'function');
      }
    });

    const Api = common.require('api-loader/api.js');
    let mockClient = {
      options: {},
      api: {},
      isApiMethodDefined: function (commandName, namespace) {
        return false;
      },
      setApiMethod: function (commandName, commandFn) {
        mockClient.api[commandName] = commandFn;
      },
      transport: {
        Actions: {}
      }
    };

    Api.loadCommands(mockClient);
    mockClient.api.session('POST', function() {});
  },

  testAddExistingCommand() {
    const Api = common.require('api-loader/api.js');
    const CommandLoader = common.require('api-loader/command.js');

    let mockClient = {
      options: {},
      api: {},
      isApiMethodDefined: function (commandName, namespace) {
        return typeof mockClient.api[commandName] != 'undefined';
      },
      setApiMethod: function (commandName, commandFn) {
        mockClient.api[commandName] = commandFn;
      },
      transport: {
        Actions: {}
      }
    };

    Api.loadCommands(mockClient);

    let loader = new CommandLoader(mockClient);
    loader.commandName = 'session';
    loader.commandFn = function() {};

    assert.throws(function(err) {
      loader.define();
    }, /Error: The command\/assertion \.session\(\) is already defined\./);
  },

    testAddCustomAssertion : function(done) {
      mockery.registerMock('../core/queue.js', {
        add(commandName, command, context, args, originalStackTrace) {
          assert.equal(commandName, 'customAssertion');
          assert.equal(args.length, 1);
          assert.strictEqual(args[0], true);
          done();
        }
      });

      const Api = common.require('api-loader/api.js');
      let mockClient = {
        startSessionEnabled: true,
        options: {
          custom_assertions_path: [path.join(__dirname, '../../extra/assertions')]
        },
        api: {},
        isApiMethodDefined(commandName, namespace) {
          return false;
        },
        setApiMethod(commandName, namespace, commandFn) {
          mockClient.api[namespace] = mockClient.api[namespace] || {};
          mockClient.api[namespace][commandName] = commandFn;
        },
        setApiProperty() {

        },
        transport: {
          Actions: {}
        }
      };

      Api.loadAssertions(mockClient);

      assert.ok('customAssertion' in mockClient.api.assert);
      assert.ok('customAssertion' in mockClient.api.verify);

      mockClient.api.assert.customAssertion(true);
    },

    testLoadCustomAssertionsBadFolder : function() {
      mockery.registerMock('../core/queue.js', {
        add(commandName, command, context, args, originalStackTrace) {
          done();
        }
      });

      const Api = common.require('api-loader/api.js');
      let mockClient = {
        startSessionEnabled: true,
        options: {
          custom_assertions_path: './bad-folder'
        },
        api: {},
        isApiMethodDefined: function (commandName, namespace) {
          return false;
        },
        setApiMethod: function (commandName, namespace, commandFn) {
        },
        setApiProperty() {
        },
        transport: {
          Actions: {}
        }
      };

      assert.throws(function() {
        Api.loadAssertions(mockClient);
      }, /ENOENT: no such file or directory, scandir '\.\/bad-folder'/);
    },

    testAddCustomCommand() {
      mockery.registerMock('../core/queue.js', {
        add(commandName, command, context, args, originalStackTrace) {
          assert.equal(commandName, 'customCommandConstructor');
          assert.equal(typeof command, 'function');
        }
      });

      const Api = common.require('api-loader/api.js');
      let mockClient = {
        options: {
          custom_commands_path: [path.join(__dirname, '../../extra/commands')]
        },
        api: {},
        isApiMethodDefined: function (commandName, namespace) {
          return false;
        },
        setApiMethod: function (commandName, commandFn) {
          mockClient.api[commandName] = commandFn;
        },
        transport: {
          Actions: {}
        }
      };

      Api.loadCommands(mockClient);

      assert.ok('customCommand' in mockClient.api, 'Test if the custom command was added');
      assert.ok('customCommandConstructor' in mockClient.api, 'Test if the custom command with constructor style was added');
      assert.ok('customPerform' in mockClient.api);
      assert.ok(typeof mockClient.api._otherPerform == 'undefined');

      mockClient.api.customCommandConstructor();
    },

    testRunCustomPerformCommand(done) {
      mockery.registerMock('../core/queue.js', {
        add(commandName, command, context, args, originalStackTrace) {
          let instance = command(...args);
          if (commandName == 'customPerform') {
            instance.on('complete', () => {
              assert.strictEqual(paramFnCalled, true);
              done()
            });
          }
        }
      });

      const Api = common.require('api-loader/api.js');
      let mockClient = {
        options: {
          custom_commands_path: [path.join(__dirname, '../../extra/commands')]
        },
        api: {},
        isApiMethodDefined: function (commandName, namespace) {
          return false;
        },
        setApiMethod: function (commandName, commandFn) {
          mockClient.api[commandName] = commandFn;
        },
        transport: {
          Actions: {}
        }
      };

      Api.loadCommands(mockClient);

      let paramFnCalled = false;
      mockClient.api.customPerform(function() {
        paramFnCalled = true;
      });
    },

    testRunCustomCommandDeprecated(done) {
      let commandQueue = [];
      mockery.registerMock('../core/queue.js', {
        add(commandName, command, context, args, originalStackTrace) {
          commandQueue.push(commandName);
          let instance = command(...args);

          if (commandName == 'customCommand') {
            assert.equal(instance.toString(), 'CommandInstance [name=customCommand]');
          }
        }
      });

      const Api = common.require('api-loader/api.js');
      let mockClient = {
        options: {
          custom_commands_path: [path.join(__dirname, '../../extra/commands')]
        },
        api: {},
        isApiMethodDefined: function (commandName, namespace) {
          return false;
        },
        setApiMethod: function (commandName, commandFn) {
          mockClient.api[commandName] = commandFn;
        },
        transport: {
          Actions: {}
        }
      };

      Api.loadCommands(mockClient);

      mockClient.api.customCommand(function() {
        assert.deepEqual(commandQueue, [ 'customCommand', 'perform' ]);
        done();
      });
    },

  testRunElementCommand(done) {
    mockery.registerMock('./core/session.js', class {
      get sessionId() {
        return '1352110219202';
      }
      setTransportProtocol() {}
    });

    mockery.registerMock('../core/queue.js', {
      add(commandName, command, context, args, originalStackTrace) {
        command(...args);
      }
    });

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/element/0/value',
      method:'POST',
      postdata : '{"value":["1"]}',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    const Nightwatch = require('../../lib/nightwatch.js');
    let client = Nightwatch.createClient();

    client.api.setValue('#weblogin', '1', function (result) {
      assert.strictEqual(result.status, 0);
      done();
    });
  },

  testRunClientCommand(done) {
    mockery.registerMock('./core/session.js', class {
      get sessionId() {
        return '1352110219202';
      }
      setTransportProtocol() {}
    });

    mockery.registerMock('../core/queue.js', {
      add(commandName, command, context, args, originalStackTrace) {
        command.apply(context, args);
      }
    });

    MockServer.addMock({
      url : '/wd/hub/session/1352110219202/window/current/position',
      method:'POST',
      postdata : '{"x":0,"y":0}',
      response : JSON.stringify({
        sessionId: '1352110219202',
        status:0
      })
    });

    const Nightwatch = require('../../lib/nightwatch.js');
    let client = Nightwatch.createClient({
      output: true,
      silent: false
    });

    client.api.setWindowPosition(0, 0, function (result) {
      assert.strictEqual(result.status, 0);
      done();
    });
  },

  /*
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
  */
});
