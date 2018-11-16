const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

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
    Object.keys(require.cache).forEach(function(module) {
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
      let provideErrorTestPath = path.join(__dirname, '../../asynchookstests/async-provide-error/' + hook + '.js');
      let expectedErrorMessage = 'Provided error ' + hook;

      let globals = {
        calls: 0,
        asyncHookTimeout: 100,
        reporter(results) {
          assert.ok(results.lastError instanceof Error);
          assert.ok(results.lastError.message.includes(expectedErrorMessage));

          if (hook.indexOf('before') === 0) {
            assert.strictEqual(results.assertions, 0);
          }
          assert.equal(results.errors, 1);
        }
      };

      let settings = {
        selenium: {
          port: 10195,
          version2: true,
          start_process: true
        },
        silent: true,
        output: false,
        persist_globals: true,
        globals: globals,
        output_folder: false,
        start_session: true
      };

      return NightwatchClient.runTests(provideErrorTestPath, settings);
    });
  });

  it('test run with async before and after', function() {
    let globals = {
      calls: 0,
      reporter(results) {
        assert.equal(globals.calls, 2);
        assert.ok('test/sample' in results.modules);
        assert.ok('demoTestAsync' in results.modules['test/sample'].completed);
      }
    };

    let testsPath = path.join(__dirname, '../../sampletests/async');
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      seleniumPort: 10195,
      silent: false,
      output: false,
      persist_globals: true,
      globals: globals,
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('test run with async afterEach', function() {
    let origExit = process.exit;
    process.exit = function() {};

    let globals = {
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

    let testsPath = path.join(__dirname, '../../sampletests/mixed');
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      seleniumPort: 10195,
      silent: false,
      output: false,
      persist_globals: true,
      globals: globals,
      output_folder: false,
      start_session: true
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('testRunner async with before and after', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let globals = {
      calls: 0,
      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
        assert.equal(settings.globals.calls, 17);
        assert.ok('sampleWithBeforeAndAfter' in results.modules);

        let result = results.modules.sampleWithBeforeAndAfter.completed;
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

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      seleniumPort: 10195,
      silent: false,
      output: false,
      persist_globals: true,
      globals: globals,
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('testRunner with --testcase and before and after', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');
    let globals = {
      calls: 0,
      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }

        assert.equal(globals.calls, 4);
        let result = results.modules.syncBeforeAndAfter.completed;
        assert.ok('demoTestSyncOne' in result);
        assert.ok(!('beforeEach' in result));
        assert.ok(!('before' in result));
        assert.ok(!('afterEach' in result));
        assert.ok(!('after' in result));
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      seleniumPort: 10195,
      silent: true,
      output: false,
      persist_globals: true,
      globals: globals,
      output_folder: false
    };

    return NightwatchClient.runTests({
      _source: [testsPath],
      testcase: 'demoTestSyncOne'
    }, settings);
  });

  it('testRunWithAsyncHooks', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withasynchooks');
    let globals = {
      calls: 0,
      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }

        assert.equal(globals.calls, 7);
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      seleniumPort: 10195,
      custom_commands_path: path.join(__dirname, '../../extra/commands'),
      silent: true,
      output: false,
      persist_globals: true,
      globals: globals,
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('test async afterEach hook timeout error', function() {
    let testsPath = path.join(__dirname, '../../asynchookstests/afterEach-timeout');
    let globals = {
      calls: 0,
      asyncHookTimeout: 10,
      reporter(results) {
        assert.ok(results.lastError instanceof Error);
        assert.equal(results.lastError.message, 'done() callback timeout of 10ms was reached while executing "afterEach". ' +
          'Make sure to call the done() callback when the operation finishes.');
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      seleniumPort: 10195,
      silent: false,
      output: false,
      persist_globals: true,
      globals: globals,
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });
});

