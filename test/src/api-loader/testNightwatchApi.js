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
          add({commandName, commandFn, context, args, stackTrace}) {
            assert.equal(commandName, 'customAssertion');
            assert.equal(args.length, 1);
            assert.strictEqual(args[0], true);
            done();
          }
        }
      },
      api: {
        globals: {
          abortOnAssertionFailure: true,
          retryAssertionTimeout: 10,
          rescheduleInterval: 100
        }
      },
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
      api: {
        globals: {
          abortOnAssertionFailure: true,
          retryAssertionTimeout: 10,
          rescheduleInterval: 100
        }
      },
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

  it('test run customPerform command', function(done) {
    const ApiLoader = common.require('api-loader/api.js');
    let mockClient = {
      options: {
        custom_commands_path: [path.join(__dirname, '../../extra/commands')]
      },
      session: {
        commandQueue: {
          add({commandName, commandFn, context, args, stackTrace}) {
            let instance = commandFn.apply(context, args);
            if (commandName === 'customPerform') {
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
        },
        globals: {
          abortOnAssertionFailure: true,
          retryAssertionTimeout: 10,
          rescheduleInterval: 100
        }
      },
      isApiMethodDefined: function (commandName, namespace) {
        return false;
      },
      setApiMethod: function (commandName, ...args) {
        if (args.length === 1) {
          mockClient.api[commandName] = args[0];
        } else {
          let context = mockClient.api;
          let namespace = typeof args[0] == 'string' ? context[args[0]] : args[0];
          if (namespace) {
            context = namespace;
          }

          context[commandName] = args[1];
        }
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

    assert.ok('other' in mockClient.api);
    assert.strictEqual(typeof mockClient.api.other.otherCommand, 'function');
  });

  it('test run custom command deprecated', function(done) {
    let commandQueue = [];
    const ApiLoader = common.require('api-loader/api.js');
    let mockClient = {
      options: {
        custom_commands_path: [path.join(__dirname, '../../extra/commands')]
      },
      session: {
        commandQueue: {
          add({commandName, commandFn, context, args, stackTrace}) {
            commandQueue.push(commandName);
            let instance = commandFn.apply(context, args);

            if (commandName === 'customCommand') {
              assert.equal(instance.toString(), 'CommandInstance [name=customCommand]');
            }
          }
        }
      },
      api: {
        perform(fn) {
          commandQueue.push('perform');
          fn();
        },
        globals: {
          abortOnAssertionFailure: true,
          retryAssertionTimeout: 10,
          rescheduleInterval: 100
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
      settings: {},
      session: {},
      api: {
        perform(fn) {
          fn();
        },
        globals: {
          abortOnAssertionFailure: true,
          retryAssertionTimeout: 10,
          rescheduleInterval: 100
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

    assert.throws(function() {
      mockClient.api.page.otherPage().navigate();
    }, /Error: Invalid URL in "otherPage" page object. When using relative uris, you must define a "launch_url" setting in your config which serves as the base url./);

  });

});
