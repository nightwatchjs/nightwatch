const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Runner = common.require('runner/runner.js');
const Settings = common.require('settings/settings.js');
const Globals = require('../../lib/globals.js');

describe('testRunTestsuite', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
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

  it('testRunSuiteRetries', function() {
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
      silent: true,
      output: false,
      persist_globals: true,
      globals: globals,
      output_folder: false,
      start_session: true
    });

    let runner = Runner.create(settings, {
      reporter: 'junit',
      suiteRetries: 1
    });

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.equal(settings.globals.calls, 8);
        assert.deepEqual(runner.results.errmessages, []);
        assert.equal(runner.results.passed, 1);
        assert.equal(runner.results.failed, 1);
        assert.equal(runner.results.errors, 0);
        assert.equal(runner.results.skipped, 0);
      });
  });

  it('testRunSuiteRetriesNoSkipTestcasesOnFail', function() {
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
      silent: true,
      output: false,
      persist_globals: true,
      globals: globals,
      skip_testcases_on_fail: false,
      output_folder: false,
      start_session: true,
      suite_retries: 1
    });

        return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(settings.globals.calls, 10);
        assert.equal(runner.results.errors, 0);
      });
  });

  it('testRunSuiteRetriesWithLocateStrategy', function() {
    let testsPath = path.join(__dirname, '../../sampletests/suiteretries/locate-strategy');
    let globals = {
      calls: 0
    };

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      persist_globals: true,
      globals: globals,
      skip_testcases_on_fail: false,
      output_folder: false,
      start_session: true,
      suite_retries: 1
    });

        return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(runner.currentTestSuite.client['@client'].locateStrategy, 'css selector');
      });

  })
  ;

  it('test clear command queue when run with suiteRetries', function() {
    let testsPath = path.join(__dirname, '../../sampletests/suiteretries/sample');
    let globals = {
      calls: 0
    };

    let settings = Settings.parse({
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
      start_session: true,
      suite_retries: 1
    });

        return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(settings.globals.calls, 3);
        assert.equal(runner.results.passed, 3);
      });
  });

  it('testRunModuleSyncName', function() {
    let globals = {
      calls: 0
    };
    let testsPath = path.join(__dirname, '../../sampletests/syncnames');
    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      sync_test_names: true,
      persist_globals: true,
      globals: globals,
      output_folder: false,
      start_session: true
    });

        return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.ok('sampleTest' in runner.results.modules);
      });

  });

  it('test run multiple sources and same module name', function() {
    let srcFolders = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/mixed')
    ];

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      globals: {},
      output_folder: false,
      start_session: true,
      src_folders: srcFolders
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(srcFolders, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.ok('simple/sample' in runner.results.modules);
        assert.ok('mixed/sample' in runner.results.modules);
        assert.ok('demoTest' in runner.results.modules['simple/sample'].completed);
        assert.ok('demoTestMixed' in runner.results.modules['mixed/sample'].completed);
      });
  });

  it('testRunMultipleSrcFolders', function() {
    let srcFolders = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/srcfolders')
    ];
    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      output_folder: false,
      start_session: true,
      src_folders: srcFolders
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(srcFolders, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.ok('simple/sample' in runner.results.modules);
        assert.ok('demoTest' in runner.results.modules['simple/sample'].completed);
        assert.ok('srcfolders/other_sample' in runner.results.modules);
      });

  });
});
