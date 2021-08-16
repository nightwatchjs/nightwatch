const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunTestSuite', function() {

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

  it('testRunner with suiteRetries', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withfailures');
    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 8);
        assert.deepStrictEqual(results.errmessages, []);
        assert.strictEqual(results.passed, 1);
        assert.strictEqual(results.failed, 1);
        assert.strictEqual(results.errors, 0);
        assert.strictEqual(results.skipped, 0);
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
        assert.strictEqual(results.skipped, 0);
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
        assert.strictEqual(results.skipped, 0);
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
        version2: true,
        start_process: true
      },
      silent: true,
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

  it('testRunModuleSyncName', function() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata: '{"using":"css selector","value":"#finlandia"}',
      response: JSON.stringify({sessionId: '1352110219202', status: 0, value: [{ELEMENT: '10'}]})
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/10/displayed',
      statusCode: 200,
      method: 'GET',
      response: JSON.stringify({sessionId: '1352110219202', status: 0, value: true})
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element',
      statusCode: 200,
      response: JSON.stringify({sessionId: '1352110219202', status: 0, value: {ELEMENT: '10'}})
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/10/text',
      statusCode: 200,
      method: 'GET',
      response: JSON.stringify({sessionId: '1352110219202', status: 0, value: 'jean sibelius'})
    }, true);

    let globals = {
      calls: 0,
      reporter(results, cb) {
        assert.ok('sampleTest' in results.modules);
        assert.strictEqual(results.errors, 0);
        if (results.lastError) {
          throw results.lastError;
        }
        cb();
      },
      afterEach(client, cb) {
        assert.strictEqual(client.options.desiredCapabilities.name, 'Sample Test');
        cb();
      }
    };

    let testsPath = path.join(__dirname, '../../sampletests/syncnames');

    return runTests({
      _source: [testsPath]
    }, settings({
      sync_test_names: true,
      globals
    }));

  });

  it('test run multiple sources and same module name', function() {
    let srcFolders = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/mixed')
    ];

    let globals = {
      reporter(results, cb) {
        assert.ok('test/sample' in results.modules);
        assert.ok('mixed/sample' in results.modules);
        assert.ok('demoTest' in results.modules['test/sample'].completed);
        assert.ok('demoTestMixed' in results.modules['mixed/sample'].completed);

        cb();
      }
    };

    return runTests(settings({
      globals,
      start_session: true,
      src_folders: srcFolders
    }));
  });

  it('testRunMultipleSrcFolders', function() {
    let srcFolders = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/srcfolders')
    ];

    return runTests(settings({
      globals: {
        reporter(results, cb) {
          if (results.lastError) {
            throw results.lastError;
          }
          assert.ok('test/sample' in results.modules);
          assert.ok('demoTest' in results.modules['test/sample'].completed);
          assert.ok('srcfolders/other_sample' in results.modules);

          const stringPath = ['test', 'sampletests', 'simple', 'test', 'sample.js'].join(path.sep);
          assert.strictEqual(results.modules['test/sample'].modulePath.endsWith(stringPath), true);
          cb();
        }
      },
      src_folders: srcFolders
    }));
  });

  it('test runner with multiple test interfaces - exports/describe', function() {
    let srcFolders = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/withdescribe/basic')
    ];

    return runTests(settings({
      globals: {
        reporter(results, cb) {
          if (results.lastError) {
            throw results.lastError;
          }
          assert.ok('test/sample' in results.modules);
          assert.ok('demoTest' in results.modules['test/sample'].completed);
          let test = results.modules['test/sample'].completed.demoTest;
          assert.strictEqual(test.assertions.length, 2);
          assert.strictEqual(test.passed, 2);

          assert.ok('basic/sample' in results.modules);
          test = results.modules['basic/sample'].completed.demoTest;
          assert.strictEqual(test.assertions.length, 2);
          assert.strictEqual(test.passed, 2);
          cb();
        }
      },
      src_folders: srcFolders
    }));
  });

  it('test runner with describe and .only()', function() {
    let srcFolders = [
      path.join(__dirname, '../../sampletests/withdescribe/basic/sampleWithOnly.js')
    ];

    return runTests(settings({
      globals: {
        reporter(results, cb) {
          if (results.lastError) {
            throw results.lastError;
          }

          const testcases = results.modules.sampleWithOnly.completed;
          assert.deepStrictEqual(Object.keys(testcases), ['demoTest two']);
          cb();
        }
      },
      src_folders: srcFolders
    }));
  });

  it('testRunner with describe and skipTestcasesOnFail=true', function() {
    let testsPath = path.join(__dirname, '../../sampletests/withdescribe/failures/sampleSkipTestcases.js');
    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 2);
        assert.strictEqual(results.errors, 0);
        assert.strictEqual(results.failed, 2);
        cb();
      }
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      globals,
      skip_testcases_on_fail: true
    }));
  });
});
