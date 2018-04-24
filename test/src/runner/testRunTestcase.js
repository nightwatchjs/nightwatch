const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Settings = common.require('settings/settings.js');
const Globals = require('../../lib/globals.js');

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
  });

  afterEach(function() {
    Object.keys(require.cache).forEach(function(module) {
      delete require.cache[module];
    });
  });

  it('testRunNoSkipTestcasesOnFail', function() {
    let Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0
    };

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      skip_testcases_on_fail: false,
      persist_globals: true,
      globals: globals,
      output_folder: false,
      start_session: true
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(settings.globals.calls, 6);
        assert.equal(runner.results.passed, 2);
        assert.equal(runner.results.failed, 2);
        assert.equal(runner.results.errors, 0);
      });
  });

  it('testRunSkipTestcasesOnFail', function() {
    let Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0
    };

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      persist_globals: true,
      globals: globals,
      output_folder: false,
      start_session: true
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(settings.globals.calls, 4);
        assert.equal(runner.results.passed, 1);
        assert.equal(runner.results.failed, 1);
        assert.equal(runner.results.errors, 0);
      });
  });

  it('testRunTestcase', function() {
    let Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');
    let settings = Settings.parse({
      silent: true,
      output: false,
      globals: {},
      output_folder: false,
      start_session: true,
      testcase: 'demoTestSyncOne'
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.ok('demoTestSyncOne' in runner.results.modules.syncBeforeAndAfter.completed);
      });
  });

  it('testRunTestcaseInvalid', function() {
    let Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');

    let settings = Settings.parse({
      silent: true,
      output: false,
      globals: {},
      output_folder: false,
      start_session: true,
      testcase: 'Unknown'
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.ok('sample' in runner.results.modules);
        assert.ok('demoTest' in runner.results.modules.sample.completed);

        if (runner.results.lastError) {
          throw runner.results.lastError;
        }
      });
  });

  it('testRunCurrentTestName', function() {
    let Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/before-after/sampleSingleTest.js');
    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      globals: {
        beforeEach: function(client, cb) {
          assert.equal(client.currentTest.name, '');
          assert.equal(client.currentTest.group, '');
          assert.equal(client.currentTest.module, 'sampleSingleTest');
          cb();
        },
        afterEach: function(client, cb) {
          assert.equal(client.currentTest.name, null);
          assert.equal(client.currentTest.module, 'sampleSingleTest');
          cb();
        }
      },
      output_folder: false,
      start_session: true
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.ok('sample' in runner.results.modules);
        assert.ok('demoTest' in runner.results.modules.sample.completed);

        if (runner.results.lastError) {
          throw runner.results.lastError;
        }
      });
  });

  it('testRunCurrentTestInAfterEach', function() {
    let Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/withaftereach/sampleSingleTest.js');
    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      globals: {},
      output_folder: false,
      start_session: true
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.ok('sample' in runner.results.modules);
        assert.ok('demoTest' in runner.results.modules.sample.completed);

        if (runner.results.lastError) {
          throw runner.results.lastError;
        }
      });
  });

  it('testRunRetries', function() {
    let Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {calls: 0};

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      globals: globals,
      persist_globals: true,
      output_folder: false,
      start_session: true,
      retries: 1
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(settings.globals.calls, 6);
        assert.equal(runner.results.passed, 1);
        assert.equal(runner.results.failed, 1);
        assert.equal(runner.results.errors, 0);
        assert.equal(runner.results.skipped, 0);
      });
  });

  it('testRunRetriesNoSkipTestcasesOnFail', function() {
    let Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {calls: 0};

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      globals: globals,
      skip_testcases_on_fail: false,
      persist_globals: true,
      output_folder: false,
      start_session: true,
      retries: 1
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(settings.globals.calls, 10);
        assert.equal(runner.results.passed, 2);
        assert.equal(runner.results.failed, 2);
        assert.equal(runner.results.errors, 0);
      });
  });

});
