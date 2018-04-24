const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Settings = common.require('settings/settings.js');
const Globals = require('../../lib/globals.js');

describe('testRunWithGlobalHooks', function() {
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

  it('testRunWithGlobalBeforeAndAfter', function(done) {
    const Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let beforeEachCount = 0;
    let afterEachCount = 0;

    let globals = {
      calls: 0,
      beforeEach: function() {
        beforeEachCount++;
      },
      afterEach: function() {
        afterEachCount++;
      }
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

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(session.globals.calls, 17);
        assert.equal(beforeEachCount, 3);
        assert.equal(afterEachCount, 3);
      });

  });

  it('testRunWithGlobalAsyncBeforeEachAndAfterEach', function(done) {
    const Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let globals = {
      calls: 0,
      beforeEach: function(cb) {
        setTimeout(function() {
          beforeEachCount++;
          cb();
        }, 10);
      },
      afterEach: function(cb) {
        setTimeout(function() {
          afterEachCount++;
          cb();
        }, 10);
      }
    };
    let beforeEachCount = 0;
    let afterEachCount = 0;
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

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(beforeEachCount, 3);
        assert.equal(afterEachCount, 3);
        assert.equal(session.globals.calls, 17);
      });

  });

  it('testRunWithGlobalAsyncBeforeEachAndAfterEachWithBrowser', function(done) {
    //test.expect(25);
    const Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let globals = {
      calls: 0,
      beforeEach: function(client, done) {
        assert.deepEqual(client.globals, this);
        setTimeout(function() {
          beforeEachCount++;
          done();
        }, 10);
      },
      afterEach: function(client, cb) {
        setTimeout(function() {
          afterEachCount++;
          cb();
        }, 10);
      }
    };
    let beforeEachCount = 0;
    let afterEachCount = 0;
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

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(session.globals.calls, 17);
        assert.equal(beforeEachCount, 3);
        assert.equal(afterEachCount, 3);
      });

  });

  it('test run with global async beforeEach and assert failure', function(done) {
    const Runner = common.require('runner/runner.js');
    let beforeEachCount = 0;
    let testsPath = path.join(__dirname, '../../sampletests/before-after');

    let settings = Settings.parse({
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
        }
      },
      output_folder: false,
      start_session: true
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {

        assert.equal(results.modules.sampleSingleTest.errmessages.length, 0);
        assert.equal(beforeEachCount, 3);

      });
  });

  it('test run with global async beforeEach and exception', function(done) {
    const Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/before-after');

    let settings = Settings.parse({
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      silent: true,
      output: false,
      persist_globals: true,
      globals: {
        beforeEach: function(client, done) {
          client.perform(function() {
            throw new Error('x');
          });
        }
      },
      output_folder: false,
      start_session: true
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(results.modules.sampleSingleTest.errmessages.length, 1);
        assert.equal(results.modules.sampleWithBeforeAndAfter.errmessages.length, 1);
        assert.equal(results.modules.syncBeforeAndAfter.errmessages.length, 1);
        assert.equal(results.modules.sampleSingleTest.errmessages[0].indexOf('Error while running perform command:'), 0);

      });
  });

  it('test run with global async beforeEach and done(err);', function(done) {
    const Runner = common.require('runner/runner.js');
    let testsPath = path.join(__dirname, '../../sampletests/before-after');

    let settings = Settings.parse({
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
        }
      },
      output_folder: false,
      start_session: true
    });

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.ok(err instanceof Error);
        assert.equal(err.message, 'global beforeEach error');
      });

  });

  it('test currentTest in global beforeEach/afterEach', function(done) {
    const Runner = common.require('runner/runner.js');
    //test.expect(18);
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0,
      beforeEach: function(client, done) {
        assert.deepEqual(client.currentTest.results.steps, ['demoTest', 'demoTest2']);
        assert.equal(client.currentTest.results.passed, 0);
        assert.equal(client.currentTest.results.failed, 0);
        assert.equal(client.currentTest.results.tests, 0);
        assert.deepEqual(client.currentTest.module, 'sample');
        assert.deepEqual(client.currentTest.name, '');
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
        globals.calls++;
        done();
      }
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

    return Globals.startTestRunner(testsPath, settings)
      .then(runner => {
        assert.equal(session.globals.calls, 6);
      });

  });
});