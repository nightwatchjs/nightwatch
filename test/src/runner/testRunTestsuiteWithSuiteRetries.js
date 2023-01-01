const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests, CliRunner} = common.require('index.js');

describe('testRunTestsuiteWithSuiteRetries', function() {

  beforeEach(function(done) {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');

    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, function() {
      Object.keys(require.cache).forEach(function(module) {
        delete require.cache[module];
      });

      done();
    });
  });

  it('testRunner with suiteRetries', function() {
    let sessionFinishedCalled = false;
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(sessionFinishedCalled, true, 'sessionFinished was not called');
        assert.strictEqual(globals.calls, 8);
        assert.deepStrictEqual(results.errmessages, []);
        assert.strictEqual(results.passed, 1);
        assert.strictEqual(results.failed, 1);
        assert.strictEqual(results.errors, 0);
        assert.strictEqual(results.skipped, 1);
        cb();
      }
    };


    const Transport = common.require('transport/selenium-webdriver/selenium.js');
    Transport.prototype.sessionFinished = function() {
      sessionFinishedCalled = true;
    };

    const runner = CliRunner({
      suiteRetries: 1,
      _source: [testsPath]
    });

    runner.setup(settings({
      globals
    }));

    return runner.runTests();
  });

  it('testRunner with suiteRetries and describe interface', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withdescribe/suite-retries/sample.js');

    const globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 8);
        assert.deepStrictEqual(results.errmessages, []);
        assert.strictEqual(results.passed, 1);
        assert.strictEqual(results.failed, 1);
        assert.strictEqual(results.errors, 0);
        assert.strictEqual(results.skipped, 1);
        cb();
      }
    };

    return runTests({
      suiteRetries: 1,
      _source: [testsPath]
    }, settings({
      globals
    }));
  });

  it('testRunner with suiteRetries and describe interface with attribute', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withdescribe/suite-retries/sampleWithAttribute.js');

    const globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 8);
        assert.deepStrictEqual(results.errmessages, []);
        assert.strictEqual(results.passed, 1);
        assert.strictEqual(results.failed, 1);
        assert.strictEqual(results.errors, 0);
        assert.strictEqual(results.skipped, 1);
        cb();
      }
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      globals
    }));
  });

  it('testRunner with suiteRetries and describe interface with both attribute and argument', function() {
    const testsPath = path.join(__dirname,
      '../../sampletests/withdescribe/suite-retries/sampleWithAttribute.js');

    const globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 8);
        cb();
      }
    };

    return runTests({
      suiteRetries: 2,
      _source: [testsPath]
    }, settings({
      globals
    }));
  });

  it('testRunner with suiteRetries and skip_testcases_on_fail=false', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 12);
        assert.strictEqual(results.errors, 0);
        cb();
      }
    };

    return runTests({
      suiteRetries: 1,
      _source: [testsPath]
    }, settings({
      globals,
      skip_testcases_on_fail: false
    }));
  });

  it('testRunner with suiteRetries and enable_fail_fast=true', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 12);
        cb();
      }
    };

    return runTests({}, settings({
      suiteRetries: 2,
      _source: [testsPath],
      enable_fail_fast: true,
      globals
    })).catch(err => {
      return err;
    }).then(err => {
      assert.ok(err instanceof Error);
    });
  });

  it('testRunner with suiteRetries and locate strategy change', function() {
    let testsPath = path.join(__dirname, '../../sampletests/suiteretries/locate-strategy');
    let globals = {
      calls: 0,
      reporter(results, cb) {
        assert.strictEqual(runner.currentSuite.client.locateStrategy, 'css selector');
        cb();
      }
    };

    const Runner = common.require('runner/runner.js');
    const Settings = common.require('settings/settings.js');

    const settings = Settings.parse({
      selenium: {
        port: 10195,
        start_process: false
      },
      selenium_host: 'localhost',
      silent: false,
      output: false,
      persist_globals: true,
      globals,
      skip_testcases_on_fail: false,
      output_folder: false
    });

    const argv = {
      reporter: 'junit',
      suiteRetries: 1,
      _source: [testsPath]
    };

    let runner = Runner.create(settings, argv);

    return Runner.readTestSource(settings, argv)
      .then(modules => {
        return runner.run(modules);
      });
  });

  it('test clear command queue when run with suiteRetries', function() {
    let testsPath = path.join(__dirname, '../../sampletests/suiteretries/sample');
    let globals = {
      calls: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 3);
        assert.strictEqual(results.passed, 2);
        cb();
      }
    };

    return runTests({
      suiteRetries: 1,
      _source: [testsPath]
    }, settings({
      globals
    }));
  });

});
