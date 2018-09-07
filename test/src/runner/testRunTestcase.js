const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

describe('testRunTestcase', function() {

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

  it('testRunner with skip_testcases_on_fail=false', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.equal(globals.calls, 6);
        assert.equal(results.passed, 2);
        assert.equal(results.failed, 2);
        assert.equal(results.errors, 0);

        cb();
      }
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      skip_testcases_on_fail: false,
      persist_globals: true,
      globals: globals,
      output_folder: false,
      output: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('testRunner with skip_testcases_on_fail=true (default)', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0,
      reporter(results, cb) {
        assert.equal(globals.calls, 4);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 1);
        assert.equal(results.errors, 0);

        cb();
      },
      retryAssertionTimeout: 0
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      persist_globals: true,
      globals: globals,
      output: true,
      silent: false,
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('testRunner with --testcase argument', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: false,
      output: false,
      globals: {
        reporter(results, cb) {
          assert.equal(Object.keys(results.modules).length, 1);
          assert.ok('demoTestSyncOne' in results.modules.syncBeforeAndAfter.completed);

          cb();
        }
      },
      output_folder: false
    };

    return NightwatchClient.runTests({
      _source: [testsPath],
      testcase: 'demoTestSyncOne'
    }, settings);
  });

  it('testRunner with invalid --testcase argument', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: false,
      output: false,
      globals: {
        reporter(results, cb) {
          assert.strictEqual(Object.keys(results.modules).length, 0);

          cb();
        }
      },
      output_folder: false
    };

    return NightwatchClient.runTests({
      _source: [testsPath],
      testcase: 'Unknown'
    }, settings)
      .then(_ => {
        assert.ok(false, 'Test runner should have failed with invalid testcase error message');
      })
      .catch(err => {
        assert.equal(err, 'Error: "Unknown" is not a valid testcase in the current test suite.');
      });
  });

  it('testRunCurrentTestName', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after/sampleSingleTest.js');
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      globals: {
        beforeEach(client, cb) {
          assert.equal(client.currentTest.name, '');
          assert.equal(client.currentTest.group, '');
          assert.equal(client.currentTest.module, 'sampleSingleTest');
          cb();
        },
        afterEach(client, cb) {
          assert.equal(client.currentTest.name, 'demoTest');
          assert.equal(client.currentTest.module, 'sampleSingleTest');
          cb();
        },
        reporter(results, cb) {
          assert.ok('sampleSingleTest' in results.modules);
          assert.ok('demoTest' in results.modules.sampleSingleTest.completed);

          cb();
        }
      },
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('currentTest in afterEach hook', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withaftereach/sampleSingleTest.js');
    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      globals: {
        reporter(results, cb) {
          if (results.lastError instanceof Error) {
            throw results.lastError;
          }
          cb();
        }
      },
      output_folder: false
    };

    return NightwatchClient.runTests(testsPath, settings);
  });

  it('testRunner with retries', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0,
      reporter(results, cb) {
        assert.equal(settings.globals.calls, 6);
        assert.equal(results.passed, 1);
        assert.equal(results.failed, 1);
        assert.equal(results.errors, 0);
        assert.equal(results.skipped, 0);
        cb();
      },
      retryAssertionTimeout: 0
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: false,
      globals: globals,
      output: false,
      persist_globals: true,
      output_folder: false
    };

    return NightwatchClient.runTests({
      retries: 1,
      _source: [testsPath]
    }, settings);
  });

  it('testRunner with retries and skip_testcases_on_fail=false', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0,
      reporter(results, cb) {
        assert.equal(settings.globals.calls, 10);
        assert.equal(results.passed, 2);
        assert.equal(results.failed, 2);
        assert.equal(results.errors, 0);
        cb();
      },
      retryAssertionTimeout: 0
    };

    let settings = {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      globals: globals,
      skip_testcases_on_fail: false,
      persist_globals: true,
      output_folder: false,
      output: false
    };

    return NightwatchClient.runTests({
      retries: 1,
      _source: [testsPath]
    }, settings);
  });

});
