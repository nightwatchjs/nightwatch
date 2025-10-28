const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');
const mockery = require('mockery');

describe('testRunWithHooks', function() {
  before(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  afterEach(function() {
    Object.keys(require.cache).filter(i => i.includes('/sampletests')).forEach(function(module) {
      delete require.cache[module];
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  [
    'before',
    'beforeAsync',
    'beforeWithClient',
    'beforeEach',
    'beforeEachAsync',
    'beforeEachWithClient',
    'beforeEachAsyncWithClient',
    'beforeEachAsyncWithClientMultiple',
    'afterEach',
    'afterEachAsync',
    'afterEachWithClient',
    'after',
    'afterAsync',
    'afterWithClient'
  ].forEach(function(hook) {
    it(`testRunner with ${hook} hook and explicit callback error`, function() {
      const provideErrorTestPath = path.join(__dirname, '../../asynchookstests/async-provide-error/' + hook + '.js');
      const expectedErrorMessage = 'Provided error ' + hook;

      const globals = {
        calls: 0,
        asyncHookTimeout: 50,

        reporter(results) {
          assert.ok(results.lastError instanceof Error);
          assert.ok(results.lastError.message.includes(expectedErrorMessage));

          if (hook.indexOf('before') === 0) {
            assert.strictEqual(results.assertions, 0);
          }
          assert.strictEqual(results.errors, 1);
        }
      };

      return runTests(provideErrorTestPath, settings({
        globals
      }));
    });
  });

  [
    'before',
    'beforeAsync',
    'beforeWithClient',
    'beforeEach',
    'beforeEachAsync',
    'beforeEachWithClient',
    'beforeEachAsyncWithClient',
    'beforeEachAsyncWithClientMultiple',
    'afterEach',
    'afterEachAsync',
    'afterEachWithClient',
    'after',
    'afterAsync',
    'afterWithClient'
  ].forEach(function(hook) {
    it(`testRunner with ${hook} hook and explicit callback error with --fail-fast argument`, function() {
      const source = [
        path.join(__dirname, '../../asynchookstests/async-provide-error/' + hook + '.js'),
        path.join(__dirname, '../../sampletests/async/test/sample.js')
      ];

      const globals = {
        calls: 0,
        asyncHookTimeout: 50,

        reporter(results) {
          assert.strictEqual(Object.keys(results.modules).length, 1);
        }
      };

      return runTests({
        source,
        'fail-fast': true
      }, settings({
        globals
      })).catch(err => {
        return err;
      }).then(err => {
        assert.ok(err instanceof Error);
        if (err.name === 'ERR_ASSERTION') {
          throw err;
        }
      });
    });
  });

  [
    'before',
    'beforeAsync',
    'beforeWithClient',
    'beforeEach',
    'beforeEachAsync',
    'beforeEachWithClient',
    'beforeEachAsyncWithClient',
    'beforeEachAsyncWithClientMultiple',
    'afterEach',
    'afterEachAsync',
    'afterEachWithClient',
    'after',
    'afterAsync',
    'afterWithClient'
  ].forEach(function(hook) {
    it(`testRunner with ${hook} hook and explicit callback error without fail-fast argument`, function() {
      const source = [
        path.join(__dirname, '../../asynchookstests/async-provide-error/' + hook + '.js'),
        path.join(__dirname, '../../sampletests/async/test/sample.js')
      ];

      const globals = {
        calls: 0,
        asyncHookTimeout: 50,

        reporter(results) {
          assert.strictEqual(Object.keys(results.modules).length, 2);
        }
      };

      return runTests({
        source
      }, settings({
        globals
      }));
    });
  });

  it('test run with async before and after', function() {
    const globals = {
      calls: 0,
      reporter(results) {
        assert.strictEqual(globals.calls, 2);
        assert.ok(`test${path.sep}sample` in results.modules);
        assert.ok('demoTestAsync' in results.modules[`test${path.sep}sample`].completed);
      }
    };

    const testsPath = path.join(__dirname, '../../sampletests/async');

    return runTests(testsPath, settings({
      globals
    }));
  });

  it('test run with async afterEach', function() {
    const origExit = process.exit;
    process.exit = function() {};

    const globals = {
      calls: 0,
      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
        assert.ok('sample' in results.modules);
        assert.ok('demoTestMixed' in results.modules.sample.completed);
        process.exit = origExit;
      }
    };

    const testsPath = path.join(__dirname, '../../sampletests/mixed');

    return runTests(testsPath, settings({
      seleniumPort: 10195,
      globals
    }));
  });

  it('testRunner async with before and after', function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after');
    const globals = {
      calls: 0,
      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
        assert.strictEqual(globals.calls, 19);
        assert.ok('sampleWithBeforeAndAfter' in results.modules);

        const result = results.modules.sampleWithBeforeAndAfter.completed;
        assert.ok('demoTestAsyncOne' in result);
        assert.ok('demoTestAsyncTwo' in result);
        assert.ok(!('beforeEach' in result));
        assert.ok(!('before' in result));
        assert.ok(!('afterEach' in result));
        assert.ok(!('after' in result));
        assert.ok('syncBeforeAndAfter' in results.modules);
        assert.ok('demoTestAsyncOne' in result);
        assert.ok('demoTestAsyncTwo' in result);
        assert.ok(!('beforeEach' in result));
        assert.ok(!('before' in result));
        assert.ok(!('afterEach' in result));
        assert.ok(!('after' in result));
      }
    };

    return runTests(testsPath, settings({
      seleniumPort: 10195,
      globals
    }));
  });

  it('testRunner before and after without callback', function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after/sampleWithBeforeAndAfterNoCallback.js');
    const globals = {
      calls: 0,
      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
        assert.strictEqual(globals.calls, 2);
        assert.ok('sampleWithBeforeAndAfterNoCallback' in results.modules);
      }
    };

    return runTests(testsPath, settings({
      seleniumPort: 10195,
      globals
    }));
  });

  it('testRunner with assertion failed in after hook', function() {
    const testsPath = path.join(__dirname, '../../asynchookstests/sampleWithAssertionFailedInAfter.js');
    const globals = {
      calls: 0,
      reporter(results) {
        assert.ok(results.lastError instanceof Error);
        assert.strictEqual(results.lastError.name, 'NightwatchAssertError');
      }
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      seleniumPort: 10195,
      globals
    }));
  });

  it('testRunner with --testcase and before and after', function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');
    const globals = {
      calls: 0,
      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }

        assert.strictEqual(globals.calls, 4);
        const result = results.modules.syncBeforeAndAfter.completed;
        assert.ok('demoTestSyncOne' in result);
        assert.ok(!('beforeEach' in result));
        assert.ok(!('before' in result));
        assert.ok(!('afterEach' in result));
        assert.ok(!('after' in result));
      }
    };


    return runTests({
      _source: [testsPath],
      testcase: 'demoTestSyncOne'
    }, settings({
      seleniumPort: 10195,
      globals,
      output_folder: false
    }));
  });

  it('testRunner with command inside before', function() {
    const testsPath = path.join(__dirname, '../../sampletests/beforewithcommand/commandInsideBefore.js');
    const globals = {
      calls: 0,
      reporter(results) {
        assert.ok(results.lastError instanceof Error);

        assert.strictEqual(globals.calls, 6);
        const result = results.modules.commandInsideBefore.completed;
        // assert.ok('demoTestSyncOne' in result);
        assert.ok(!('beforeEach' in result));
        assert.ok(!('before' in result));
        assert.ok(!('afterEach' in result));
        assert.ok(!('after' in result));
      }
    };


    return runTests({
      _source: [testsPath]
    }, settings({
      seleniumPort: 10195,
      globals,
      output_folder: false
    }));
  });

  it('testRunner with command inside before with 0 parameters', function() {
    const testsPath = path.join(__dirname, '../../sampletests/beforewithcommand/commandInsideBeforeWithNoParams.js');
    const globals = {
      calls: 0,
      reporter(results) {
        assert.ok(results.lastError instanceof Error);

        assert.strictEqual(globals.calls, 6);
        const result = results.modules.commandInsideBeforeWithNoParams.completed;
        // assert.ok('demoTestSyncOne' in result);
        assert.ok(!('beforeEach' in result));
        assert.ok(!('before' in result));
        assert.ok(!('afterEach' in result));
        assert.ok(!('after' in result));
      }
    };


    return runTests({
      _source: [testsPath]
    }, settings({
      seleniumPort: 10195,
      globals,
      output_folder: false
    }));
  });

  it('testRunWithAsyncHooks', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withasynchooks');
    const globals = {
      calls: 0,
      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }

        assert.strictEqual(globals.calls, 7);
      }
    };

    return runTests(testsPath, settings({
      custom_commands_path: path.join(__dirname, '../../extra/commands'),
      globals
    }));
  });

  it('test async afterEach hook timeout error', function() {
    const testsPath = path.join(__dirname, '../../asynchookstests/afterEach-timeout');
    const globals = {
      calls: 0,
      asyncHookTimeout: 10,
      reporter(results) {
        assert.ok(results.lastError instanceof Error);
        assert.strictEqual(results.lastError.message, 'done() callback timeout of 10ms was reached while executing "afterEach". ' +
          'Make sure to call the done() callback when the operation finishes.');
      }
    };

    return runTests(testsPath, settings({
      globals
    }));
  });

  it('testRunner passes testEnvSettings to global before hook', function() {
    // Mock analytics to prevent cleanup errors
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock('../../utils/analytics.js', {
      updateSettings: () => {},
      updateLogger: () => {},
      collectEvent: () => {},
      __flush: () => Promise.resolve()
    });

    try {
      const CliRunner = common.require('runner/cli/cli.js');
      
      let beforeHookCalled = false;
      let beforeHookArgs = null;
      
      // Create a minimal CliRunner instance
      const runner = Object.create(CliRunner.prototype);
      
      // Set up required properties
      runner.test_settings = { 
        globals: {},
        test_runner: {type: 'mocha'},
        desiredCapabilities: {real_mobile: false, avd: null},
        usage_analytics: {enabled: false}
      };
      
      // Mock testEnvSettings property 
      const mockTestEnvSettings = { 
        default: {selenium: {port: 4444}, globals: {}}
      };
      
      Object.defineProperty(runner, 'testEnvSettings', {
        get: function() { return mockTestEnvSettings }
      });
      
      // Mock runGlobalHook to capture arguments
      runner.runGlobalHook = function(hookName, args) {
        if (hookName === 'before') {
          beforeHookCalled = true;
          beforeHookArgs = args;
          
          // Verify the enhancement: both test_settings and testEnvSettings are passed
          assert.ok(Array.isArray(args), 'before hook should receive an array of arguments');
          assert.strictEqual(args.length, 2, 'before hook should receive exactly 2 arguments');
          assert.strictEqual(args[0], runner.test_settings, 'first argument should be test_settings');
          assert.strictEqual(args[1], mockTestEnvSettings, 'second argument should be testEnvSettings');
        }

        return Promise.resolve();
      };
      
      // Mock other required methods
      runner.getTestsFiles = () => Promise.resolve({});
      runner.createTestRunner = () => Promise.resolve();
      runner.setExitCode = () => {};
      runner.testRunner = {run: () => Promise.resolve({})};
      
      // Call the runTests method
      return runner.runTests().then(() => {
        assert.ok(beforeHookCalled, 'before hook should have been called');
        assert.ok(beforeHookArgs, 'before hook arguments should have been captured');
        assert.deepEqual(beforeHookArgs[0], runner.test_settings, 'before hook arguments contains test_settings');
        assert.deepEqual(beforeHookArgs[1], mockTestEnvSettings, 'before hook arguments contains testEnvSettings');
      });
    } finally {
      mockery.deregisterAll();
      mockery.resetCache();
      mockery.disable();
    }
  });
});

