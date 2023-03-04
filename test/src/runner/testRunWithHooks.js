const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

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
      let provideErrorTestPath = path.join(__dirname, '../../asynchookstests/async-provide-error/' + hook + '.js');
      let expectedErrorMessage = 'Provided error ' + hook;

      let globals = {
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
      let source = [
        path.join(__dirname, '../../asynchookstests/async-provide-error/' + hook + '.js'),
        path.join(__dirname, '../../sampletests/async/test/sample.js')
      ];

      let globals = {
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
      let source = [
        path.join(__dirname, '../../asynchookstests/async-provide-error/' + hook + '.js'),
        path.join(__dirname, '../../sampletests/async/test/sample.js')
      ];

      let globals = {
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
    let globals = {
      calls: 0,
      reporter(results) {
        assert.strictEqual(globals.calls, 2);
        assert.ok(`test${path.sep}sample` in results.modules);
        assert.ok('demoTestAsync' in results.modules[`test${path.sep}sample`].completed);
      }
    };

    let testsPath = path.join(__dirname, '../../sampletests/async');

    return runTests(testsPath, settings({
      globals
    }));
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

    return runTests(testsPath, settings({
      seleniumPort: 10195,
      globals
    }));
  });

  it('testRunner async with before and after', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let globals = {
      calls: 0,
      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
        assert.strictEqual(globals.calls, 19);
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

    return runTests(testsPath, settings({
      seleniumPort: 10195,
      globals
    }));
  });

  it('testRunner before and after without callback', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after/sampleWithBeforeAndAfterNoCallback.js');
    let globals = {
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
    let testsPath = path.join(__dirname, '../../asynchookstests/sampleWithAssertionFailedInAfter.js');
    let globals = {
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
    let testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');
    let globals = {
      calls: 0,
      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }

        assert.strictEqual(globals.calls, 4);
        let result = results.modules.syncBeforeAndAfter.completed;
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
    let testsPath = path.join(__dirname, '../../sampletests/beforewithcommand/commandInsideBefore.js');
    let globals = {
      calls: 0,
      reporter(results) {
        assert.ok(results.lastError instanceof Error);

        assert.strictEqual(globals.calls, 6);
        let result = results.modules.commandInsideBefore.completed;
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
    let testsPath = path.join(__dirname, '../../sampletests/beforewithcommand/commandInsideBeforeWithNoParams.js');
    let globals = {
      calls: 0,
      reporter(results) {
        assert.ok(results.lastError instanceof Error);

        assert.strictEqual(globals.calls, 6);
        let result = results.modules.commandInsideBeforeWithNoParams.completed;
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
    let testsPath = path.join(__dirname, '../../sampletests/withasynchooks');
    let globals = {
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
    let testsPath = path.join(__dirname, '../../asynchookstests/afterEach-timeout');
    let globals = {
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
});

