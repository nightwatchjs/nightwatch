const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

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
    Object.keys(require.cache).forEach(function(module) {
      delete require.cache[module];
    });
  });

  it('testRunner with custom command which has failures', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withcustomcommands');
    let globals = {
      increment: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(settings.globals.increment, 4);
        cb();
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output: false,
      silent: false,
      custom_commands_path: [path.join(__dirname, '../../extra/commands')],
      persist_globals: true,
      globals: globals,
      output_folder: false
    };

    return NightwatchClient.runTests({
      _source: [testsPath]
    }, settings);
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

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output: false,
      silent: false,
      custom_commands_path: [path.join(__dirname, '../../extra/commands/es6async')],
      persist_globals: true,
      globals,
      output_folder: false
    };

    return NightwatchClient.runTests({
      _source: [testsPath]
    }, settings).then(_ => {
      process.exit = origExit;
      assert.strictEqual(globals.increment, 3);
      assert.deepEqual(globals.logResult, [
        {level: 'info', timestamp: 534547832, message: 'Test log'},
        {level: 'info', timestamp: 534547442, message: 'Test log2'}
      ]);
      assert.strictEqual(testResults.errmessages.length, 1);
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
        testResults = results;

        cb();
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output: false,
      silent: false,
      custom_commands_path: [path.join(__dirname, '../../extra/commands')],
      persist_globals: true,
      globals,
      output_folder: false
    };

    return NightwatchClient.runTests({
      _source: [testsPath]
    }, settings).then(_ => {
      process.exit = origExit;

      assert.strictEqual(testResults.errmessages.length, 0);
      assert.strictEqual(testResults.assertions, 1);
      assert.strictEqual(testResults.passed, 1);
    });
  });
});
