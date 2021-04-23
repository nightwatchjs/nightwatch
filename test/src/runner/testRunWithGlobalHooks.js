const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

describe('testRunWithGlobalHooks', function() {
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

  it('testRunner with globalBefore and after', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let beforeEachCount = 0;
    let afterEachCount = 0;

    let globals = {
      calls: 0,
      beforeEach() {
        beforeEachCount++;
      },
      afterEach() {
        afterEachCount++;
      },
      reporter(results, cb) {
        assert.deepStrictEqual(globals.settings.selenium, {
          check_process_delay: 500,
          cli_args: {},
          log_path: '',
          max_status_poll_tries: 15,
          port: 10195,
          server_path: null,
          start_process: true,
          status_poll_interval: 200,
          url: 'http://localhost:10195',
          version2: true
        });
        assert.strictEqual(globals.calls, 19);
        assert.strictEqual(beforeEachCount, 4);
        assert.strictEqual(afterEachCount, 4);
        cb();
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: false,
      output: false,
      persist_globals: true,
      globals,
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  this.timeout(10000);

  it('testRunner with global async beforeEach and afterEach', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let globals = {
      calls: 0,
      beforeEach(cb) {
        setTimeout(function() {
          beforeEachCount++;
          cb();
        }, 10);
      },
      afterEach(cb) {
        setTimeout(function() {
          afterEachCount++;
          cb();
        }, 15);
      },
      reporter(results, cb) {
        assert.equal(beforeEachCount, 4);
        assert.equal(afterEachCount, 4);
        assert.equal(globals.calls, 19);
        cb();
      }
    };
    let beforeEachCount = 0;
    let afterEachCount = 0;
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
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('testRunner with global async beforeEach and afterEach with api argument', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let globals = {
      calls: 0,
      beforeEach(client, done) {
        assert.deepEqual(client.globals, this);
        setTimeout(function() {
          beforeEachCount++;
          done();
        }, 10);
      },
      afterEach(client, cb) {
        setTimeout(function() {
          afterEachCount++;
          cb();
        }, 10);
      },
      reporter(results, cb) {
        assert.equal(globals.calls, 19);
        assert.equal(beforeEachCount, 4);
        assert.equal(afterEachCount, 4);
        cb();
      }
    };

    let beforeEachCount = 0;
    let afterEachCount = 0;
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
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('test run with global async beforeEach and assert failure', function() {
    let beforeEachCount = 0;
    let testsPath = path.join(__dirname, '../../sampletests/before-after');

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {
        beforeEach: function(client, done) {
          client.perform(function() {
            beforeEachCount++;
            client.assert.equal(0, 1);
            done();
          });
        },
        reporter(results, cb) {
          assert.ok(results.lastError instanceof Error);
          assert.equal(results.failed, 4);
          assert.equal(beforeEachCount, 4);
          cb();
        }
      },
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('test run with global async beforeEach and exception', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      persist_globals: true,
      globals: {
        asyncHookTimeout: 100,
        beforeEach(client, done) {
          client.perform(function() {
            throw new Error('From global beforeEach');
          });
        },
        reporter(results, cb) {
          assert.equal(results.modules.sampleSingleTest.errmessages.length, 2);
          assert.equal(results.modules.sampleWithBeforeAndAfter.errmessages.length, 1);
          assert.equal(results.modules.syncBeforeAndAfter.errmessages.length, 1);
          assert.ok(results.modules.sampleSingleTest.errmessages[0].includes('Error while running "perform" command:'));

          cb();
        }
      },
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('test run with global async beforeEach and timeout error', async function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      persist_globals: true,
      globals: {
        asyncHookTimeout: 100,
        before(done) {
        }
      },
      output_folder: false
    };

    let expectedErr;

    try {
      await NightwatchClient.runTests(testsPath, settings);
    } catch (err) {
      expectedErr = err;
    }

    assert.ok(expectedErr instanceof Error);
    assert.ok(expectedErr.message.includes('while executing "global before".'));
  });

  it('test run with global async beforeEach and done(err);', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      persist_globals: true,
      globals: {
        beforeEach: function(client, cb) {
          setTimeout(function() {
            cb(new Error('global beforeEach error'));
          }, 10);
        },
        reporter(results, cb) {
          assert.ok(results.lastError instanceof Error);
          assert.equal(results.lastError.message, 'global beforeEach error');
          cb();
        }
      },
      output_folder: false,
      start_session: true
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('test currentTest in global beforeEach/afterEach', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0,
      waitForConditionPollInterval: 5,
      waitForConditionTimeout: 5,
      retryAssertionTimeout: 10,
      beforeEach: function(client, done) {
        const testTimestamp = new Date(client.currentTest.timestamp);
        const currentTimestamp = new Date();
        assert.ok(testTimestamp);
        assert.ok(testTimestamp.getFullYear() == currentTimestamp.getFullYear());
        assert.ok(testTimestamp.getMonth() == currentTimestamp.getMonth());
        assert.ok(testTimestamp.getDate() == currentTimestamp.getDate());
        assert.deepEqual(client.currentTest.results, {errors: 0, failed: 0, passed: 0, assertions: [], tests: 0});
        assert.strictEqual(client.currentTest.module, 'sample');
        assert.strictEqual(client.currentTest.name, '');
        globals.calls++;
        done();
      },

      afterEach: function(client, done) {
        assert.deepEqual(client.currentTest.results.steps, ['demoTest2']);
        assert.equal(client.currentTest.results.passed, 1);
        assert.equal(client.currentTest.results.failed, 1);
        assert.equal(client.currentTest.results.tests, 2);
        assert.ok('demoTest' in client.currentTest.results.testcases);

        assert.deepEqual(client.currentTest.name, 'demoTest');
        assert.deepEqual(client.currentTest.module, 'sample');
        assert.ok(client.currentTest.timestamp);
        globals.calls++;
        done();
      },

      reporter(results, cb) {
        assert.equal(globals.calls, 6);

        cb();
      }
    };

    const settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: false,
      output: false,
      persist_globals: true,
      globals,
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });
});
