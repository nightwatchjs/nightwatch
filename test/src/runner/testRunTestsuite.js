const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunTestSuite', function () {

  beforeEach(function (done) {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');

    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, function () {
      Object.keys(require.cache).forEach(function (module) {
        delete require.cache[module];
      });

      done();
    });
  });

  it('testRunner with --fail-fast cli argument', function () {
    let src_folders = [
      path.join(__dirname, '../../sampletests/withfailures'),
      path.join(__dirname, '../../sampletests/withsubfolders')
    ];

    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(Object.keys(results.modules).length, 1);
        cb();
      }
    };

    return runTests({
      'fail-fast': true
    }, settings({
      output: false,
      src_folders,
      globals
    })).catch(err => {
      return err;
    }).then(err => {
      assert.ok(err instanceof Error);
    });
  });

  it('testRunner with enable_fail_fast setting', function () {
    let src_folders = [
      path.join(__dirname, '../../sampletests/withfailures'),
      path.join(__dirname, '../../sampletests/withsubfolders')
    ];

    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(Object.keys(results.modules).length, 1);
        cb();
      }
    };

    return runTests({
    }, settings({
      output: false,
      enable_fail_fast: true,
      src_folders,
      globals
    })).catch(err => {
      return err;
    }).then(err => {
      assert.ok(err instanceof Error);
    });
  });

  it('testRunModuleSyncName', function () {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/elements',
      postdata: '{"using":"css selector","value":"#finlandia"}',
      response: JSON.stringify({sessionId: '1352110219202', status: 0, value: [{ELEMENT: '10'}]})
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      statusCode: 200,
      method: 'POST',
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

  it('test run multiple sources and same module name', function () {
    let srcFolders = [
      path.join(__dirname, '../../sampletests/simple'),
      path.join(__dirname, '../../sampletests/mixed')
    ];

    let globals = {
      reporter(results, cb) {
        assert.ok(`test${path.sep}sample` in results.modules);
        assert.ok(`mixed${path.sep}sample` in results.modules);
        assert.ok('demoTest' in results.modules[`test${path.sep}sample`].completed);
        assert.ok('demoTestMixed' in results.modules[`mixed${path.sep}sample`].completed);

        cb();
      }
    };

    return runTests(settings({
      globals,
      start_session: true,
      src_folders: srcFolders
    }));
  });

  it('testRunMultipleSrcFolders', function () {
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
          assert.ok(`test${path.sep}sample` in results.modules);
          assert.ok('demoTest' in results.modules[`test${path.sep}sample`].completed);
          assert.ok(`srcfolders${path.sep}other_sample` in results.modules);

          const stringPath = ['test', 'sampletests', 'simple', 'test', 'sample.js'].join(path.sep);
          assert.strictEqual(results.modules[`test${path.sep}sample`].modulePath.endsWith(stringPath), true);
          cb();
        }
      },
      src_folders: srcFolders
    }));
  });

  it('test runner with multiple test interfaces - exports/describe', function () {
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
          assert.ok(`test${path.sep}sample` in results.modules);
          assert.ok('demoTest' in results.modules[`test${path.sep}sample`].completed);
          let test = results.modules[`test${path.sep}sample`].completed.demoTest;
          assert.strictEqual(test.assertions.length, 2);
          assert.strictEqual(test.passed, 2);

          assert.ok(`basic${path.sep}sample` in results.modules);
          test = results.modules[`basic${path.sep}sample`].completed.demoTest;
          assert.strictEqual(test.assertions.length, 2);
          assert.strictEqual(test.passed, 2);
          cb();
        }
      },
      src_folders: srcFolders
    }));
  });

  it('test runner with describe and .only()', function () {
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

  it('testRunner with describe and skipTestcasesOnFail=true', function () {
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
      output: false,
      skip_testcases_on_fail: true
    }));
  });

  it('testRunner with parallel mode and single test source', function () {
    let testsPath = path.join(__dirname, '../../sampletests/withdescribe/failures/sampleSkipTestcases.js');
    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(this.settings.testWorkersEnabled, false);
        cb();
      }
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      globals,
      output: false,
      test_workers: true
    }));
  });

  it('test worker mode and single test source', function () {
    let testsPath = path.join(__dirname, '../../sampletests/withdescribe/failures/sampleSkipTestcases.js');
    let globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(this.settings.testWorkersEnabled, true);
        cb();
      }
    };

    return runTests({
      _source: [testsPath],
      'test-worker': true
    }, settings({
      globals,
      output: false,
      test_workers: true
    }));
  });

});
