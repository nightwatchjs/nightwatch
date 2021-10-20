const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunWithCustomCommands', function() {

  before(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
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

  it('testRunner with custom command which has failures', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withcustomcommands');
    let globals = {
      increment: 0,
      retryAssertionTimeout: 0,
      waitForConditionPollInterval: 10,
      waitForConditionTimeout: 20,
      reporter(results, cb) {
        assert.strictEqual(globals.increment, 4);
        cb();
      }
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      custom_commands_path: [path.join(__dirname, '../../extra/commands')],
      globals
    }));
  });

  it('testRunner with ES6 Async custom commands', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withes6asynccommands');
    let testResults;
    const origExit = process.exit;
    process.exit = function() {};

    let globals = {
      increment: 0,
      logResult: null,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        testResults = results;

        cb();
      }
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      custom_commands_path: [path.join(__dirname, '../../extra/commands/es6async')],
      output: false,
      globals
    })).then(_ => {
      process.exit = origExit;
      assert.strictEqual(globals.increment, 3);
      assert.deepStrictEqual(globals.logResult, [
        {
          level: {value: 0, name: 'ALL'},
          type: '',
          timestamp: 534547832,
          message: 'Test log'
        },
        {
          level: {value: 0, name: 'ALL'},
          type: '',
          timestamp: 534547442,
          message: 'Test log2'
        }
      ]);
      assert.strictEqual(testResults.errors, 0);
      assert.strictEqual(testResults.lastError, undefined);
      assert.strictEqual(testResults.errmessages.length, 0);
    });
  });

  it('testRunner custom command which extends built-in command', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withcustomcommands/element');
    let testResults;
    const origExit = process.exit;
    process.exit = function() {};

    let globals = {
      increment: 0,
      logResult: null,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        if (results.lastError instanceof Error) {
          throw results.lastError;
        }
        testResults = results;

        cb();
      }
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      custom_commands_path: [path.join(__dirname, '../../extra/commands')],
      globals
    })).then(_ => {
      process.exit = origExit;


      assert.strictEqual(testResults.errmessages.length, 0);
      assert.strictEqual(testResults.assertions, 1);
      assert.strictEqual(testResults.passed, 1);
    });
  });
  
  it('testRunner custom command path as glob pattern', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withcustomcommands/element');
    let testResults;
    const origExit = process.exit;
    process.exit = function() {};

    let globals = {
      increment: 0,
      logResult: null,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        if (results.lastError instanceof Error) {
          throw results.lastError;
        }
        testResults = results;

        cb();
      }
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      custom_commands_path: [path.join(__dirname, '../../extra/commands/*.js')],
      globals
    })).then(_ => {
      process.exit = origExit;

      assert.strictEqual(testResults.errmessages.length, 0);
      assert.strictEqual(testResults.assertions, 1);
      assert.strictEqual(testResults.passed, 1);
    });
  });
});
