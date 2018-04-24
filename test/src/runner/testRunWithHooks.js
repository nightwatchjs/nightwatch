const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const Runner = common.require('runner/runner.js');
const Settings = common.require('settings/settings.js');
const xmlParser = require('xml2json');
const fs = require('fs');

describe('testRunWithHooks', function() {
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

  it('test run with async setUp and tearDown', function(done) {
    let globals = {
      calls: 0
    };
    let testsPath = path.join(__dirname, '../../sampletests/async');
    let settings = Settings.parse({
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
      output_folder: false,
      start_session: true
    });

    let runner = Runner.create(settings, {
      reporter: 'junit'
    });

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.equal(settings.globals.calls, 2);
        assert.ok('sample' in runner.results.modules);
        assert.ok('demoTestAsync' in runner.results.modules.sample.completed);
      });

  });

  it('test run with async tearDown', function(done) {
    let globals = {
      calls: 0
    };
    let testsPath = path.join(__dirname, '../../sampletests/mixed');
    let settings = Settings.parse({
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
      output_folder: false,
      start_session: true
    });

    let runner = Runner.create(settings, {});

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.ok('sample' in runner.results.modules);
        assert.ok('demoTestMixed' in runner.results.modules.sample.completed);
      });

  });

  it('testRunAsyncWithBeforeAndAfter', function(done) {
    let globals = {
      calls: 0
    };
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let settings = Settings.parse({
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
      output_folder: false,
      start_session: true
    });

    let runner = Runner.create(settings, {});

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.equal(settings.globals.calls, 17);
        assert.ok('sampleWithBeforeAndAfter' in runner.results.modules);

        let result = results.modules.sampleWithBeforeAndAfter.completed;
        assert.ok('demoTestAsyncOne' in result);
        assert.ok('demoTestAsyncTwo' in result);
        assert.ok(!('beforeEach' in result));
        assert.ok(!('before' in result));
        assert.ok(!('afterEach' in result));
        assert.ok(!('after' in result));
        assert.ok('syncBeforeAndAfter' in runner.results.modules);
        assert.ok('demoTestAsyncOne' in result);
        assert.ok('demoTestAsyncTwo' in result);
        assert.ok(!('beforeEach' in result));
        assert.ok(!('before' in result));
        assert.ok(!('afterEach' in result));
        assert.ok(!('after' in result));
      });

  });

  it('testRunTestCaseWithBeforeAndAfter', function(done) {
    let testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');
    let globals = {
      calls: 0
    };

    let settings = Settings.parse({
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
      output_folder: false,
      start_session: true,
      testcase: 'demoTestSyncOne'
    });

    let runner = Runner.create(settings, {});

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.equal(settings.globals.calls, 4);
        let result = results.modules.syncBeforeAndAfter.completed;
        assert.ok('demoTestSyncOne' in result);
        assert.ok(!('beforeEach' in result));
        assert.ok(!('before' in result));
        assert.ok(!('afterEach' in result));
        assert.ok(!('after' in result));
      });

  });

  it('testRunWithAsyncHooks', function(done) {
    let testsPath = path.join(__dirname, '../../sampletests/withasynchooks');
    let globals = {
      calls: 0
    };

    let settings = Settings.parse({
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
      output_folder: false,
      start_session: true
    });

    let runner = Runner.create(settings, {});

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.equal(settings.globals.calls, 7);
      });

  });

  it('test async afterEach hook timeout error', function(done) {
    let testsPath = path.join(__dirname, '../../asynchookstests/afterEach-timeout');
    let globals = {
      calls: 0,
      asyncHookTimeout: 10
    };

    let settings = Settings.parse({
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
      output_folder: false,
      start_session: true
    });

    let runner = Runner.create(settings, {});

    return Runner.readTestSource(testsPath, settings)
      .then(modules => {
        return runner.run(modules);
      })
      .then(_ => {
        assert.equal(err.message, 'done() callback timeout of 10 ms was reached while executing "afterEach". ' +
          'Make sure to call the done() callback when the operation finishes.');
        assert.ok(err instanceof Error);
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
    let provideErrorTest = 'test run with ' + hook + ' hook and explicit callback error';

    it(`testRunWithHooks.${hook}`, function(done) {
      let provideErrorTestPath = path.join(__dirname, '../../asynchookstests/async-provide-error/' + hook + '.js');
      let expectedErrorMessage = 'Provided error ' + hook;

      let globals = {
        calls: 0,
        asyncHookTimeout: 100
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
        output_folder: path.join(__dirname, '../../hooks_output'),
        start_session: true
      });

      let runner = Runner.create(settings, {});

      return Runner.readTestSource(testsPath, settings)
        .then(modules => {
          return runner.run(modules);
        })
        .then(_ => {
          let reportFile = path.join(__dirname, '../../hooks_output',
            (['before', 'beforeAsync'].indexOf(hook) === -1 ? 'FIREFOX_TEST_TEST_' : '') + hook + '.xml');

          let xml = fs.readFileSync(reportFile).toString();
          let testReport = JSON.parse(xmlParser.toJson(xml));

          if (hook.indexOf('beforeEach') === 0) {
            assert.strictEqual(results.assertions, 0);
          }

          assert.strictEqual(testReport.testsuites.errors, '1');
          assert.strictEqual(testReport.testsuites.testsuite.name, hook);
          assert.strictEqual(testReport.testsuites.testsuite.errors, '1');
          assert.equal(typeof testReport.testsuites.testsuite['system-err'], 'string');

          if (hook.indexOf('afterEach') === 0) {
            assert.ok(testReport.testsuites.testsuite['system-err'].indexOf('Error: ' + expectedErrorMessage) > 0);
          } else {
            assert.strictEqual(testReport.testsuites.testsuite['system-err'].indexOf('Error: ' + expectedErrorMessage), 0);
          }

          assert.strictEqual(results.modules[hook].errors, 1);
          assert.equal(results.errmessages.length, 1);
        });

    });
  });
});

