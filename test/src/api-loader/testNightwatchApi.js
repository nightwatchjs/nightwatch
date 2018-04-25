const assert = require('assert');
const path = require('path');
const mockery = require('mockery');

const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer  = require('../../lib/mockserver.js');

describe('test Nightwatch Api', function() {

  before(CommandGlobals.beforeEach);
  after(CommandGlobals.afterEach);

  beforeEach(function() {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
  });

  afterEach(function(done) {
    mockery.deregisterAll();
    mockery.disable();
    done();
  });

  it('testAddCustomAssertion', function(done) {
    const ApiLoader = common.require('api-loader/api.js');
    let mockClient = {
      startSessionEnabled: true,
      options: {
        custom_assertions_path: [path.join(__dirname, '../../extra/assertions')]
      },
      session: {
        commandQueue: {
          add(commandName, command, context, args, originalStackTrace) {
            assert.equal(commandName, 'customAssertion');
            assert.equal(args.length, 1);
            assert.strictEqual(args[0], true);
            done();
          }
        }
      },
      api: {},
      isApiMethodDefined(commandName, namespace) {
        return false;
      },
      setApiMethod(commandName, namespace, commandFn) {
        mockClient.api[namespace] = mockClient.api[namespace] || {};
        mockClient.api[namespace][commandName] = commandFn;
      },
      setApiProperty() {},
      transport: {
        Actions: {}
      }
    };

    let api = new ApiLoader(mockClient);
    api.loadCustomAssertions();

    assert.ok('customAssertion' in mockClient.api.assert);
    assert.ok('customAssertion' in mockClient.api.verify);

    mockClient.api.assert.customAssertion(true);
  });

  it('testLoadCustomAssertionsBadFolder', function() {
    mockery.registerMock('../core/queue.js', {
      add(commandName, command, context, args, originalStackTrace) {

      }
    });

    const ApiLoader = common.require('api-loader/api.js');
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
      let api = new ApiLoader(mockClient);
      api.loadCustomAssertions();
    }, /ENOENT: no such file or directory, scandir '/);
  });

  it('testRunCustomPerformCommand', function(done) {
    const ApiLoader = common.require('api-loader/api.js');
    let mockClient = {
      options: {
        custom_commands_path: [path.join(__dirname, '../../extra/commands')]
      },
      session: {
        commandQueue: {
          add(commandName, command, context, args, originalStackTrace) {
            let instance = command(...args);
            if (commandName == 'customPerform') {
              instance.on('complete', () => {
                assert.strictEqual(paramFnCalled, true);
                done();
              });
            }
          }
        }
      },
      api: {
        perform(fn) {
          fn();
        }
      },
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

    let api = new ApiLoader(mockClient);
    api.loadCustomCommands();

    let paramFnCalled = false;
    mockClient.api.customPerform(function() {
      paramFnCalled = true;
    });
  });

  it('testRunCustomCommandDeprecated', function(done) {
    let commandQueue = [];
    const ApiLoader = common.require('api-loader/api.js');
    let mockClient = {
      options: {
        custom_commands_path: [path.join(__dirname, '../../extra/commands')]
      },
      session: {
        commandQueue: {
          add(commandName, command, context, args, originalStackTrace) {
            commandQueue.push(commandName);
            let instance = command(...args);

            if (commandName == 'customCommand') {
              assert.equal(instance.toString(), 'CommandInstance [name=customCommand]');
            }
          }
        }
      },
      api: {
        perform(fn) {
          commandQueue.push('perform');
          fn();
        }
      },
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

    let api = new ApiLoader(mockClient);
    api.loadCustomCommands();

    mockClient.api.customCommand(function() {
      assert.deepEqual(commandQueue, ['customCommand', 'perform']);
      done();
    });
  });

  it('testRunElementCommand', function(done) {
    const MockSession = require('../../lib/mocks/core/session.js');
    mockery.registerMock('./core/session.js', MockSession);

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
  });

  it('testRunClientCommand', function(done) {
    const MockSession = require('../../lib/mocks/core/session.js');
    mockery.registerMock('./core/session.js', MockSession);

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
      output: false,
      silent: true
    });

    client.api.setWindowPosition(0, 0, function (result) {
      assert.strictEqual(result.status, 0);
      done();
    });
  });


  it('testAddPageObjectArrayPath', function() {
    const ApiLoader = common.require('api-loader/api.js');
    let mockClient = {
      options: {
        page_objects_path: [path.join(__dirname, '../../extra/otherPageobjects')]
      },
      session: {},
      api: {
        perform(fn) {
          fn();
        }
      },
      isApiMethodDefined: function (commandName, namespace) {
        return false;
      },
      setApiMethod: function (commandName, namespace, commandFn) {
        mockClient.api[namespace] = mockClient.api[namespace] || {};
        mockClient.api[namespace][commandName] = commandFn;
      },
      transport: {
        Actions: {}
      }
    };

    let api = new ApiLoader(mockClient);
    api.loadPageObjects();

    assert.ok(typeof mockClient.api.page == 'object');
    assert.ok('otherPage' in mockClient.api.page);
  });

});
