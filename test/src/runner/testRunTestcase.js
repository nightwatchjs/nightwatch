const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

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
    Object.keys(require.cache).filter(i => i.includes('/sampletests')).forEach(function(module) {
      delete require.cache[module];
    });
  });

  it('testRunner with skip_testcases_on_fail=false', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withfailures');
    const globals = {
      calls: 0,
      retryAssertionTimeout: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 6);
        assert.strictEqual(results.passed, 2);
        assert.strictEqual(results.failed, 2);
        assert.strictEqual(results.errors, 0);

        cb();
      }
    };

    return runTests(testsPath, settings({
      globals,
      skip_testcases_on_fail: false,
      output: false
    }));
  });

  it('testRunner with skip_testcases_on_fail=true (default)', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withfailures');
    const globals = {
      calls: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 4);
        assert.strictEqual(results.passed, 1);
        assert.strictEqual(results.failed, 1);
        assert.strictEqual(results.errors, 0);

        cb();
      },
      retryAssertionTimeout: 0
    };

    return runTests(testsPath, settings({
      output: false,
      globals
    }));
  });

  it('testRunner with --testcase argument', function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');
    const globals = {
      reporter(results, cb) {
        assert.strictEqual(Object.keys(results.modules).length, 1);
        assert.ok('demoTestSyncOne' in results.modules.syncBeforeAndAfter.completed);

        cb();
      }
    };

    return runTests({
      _source: [testsPath],
      testcase: 'demoTestSyncOne'
    }, settings({
      globals
    }));
  });

  it('testRunner with invalid --testcase argument', function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after/syncBeforeAndAfter.js');
    const globals = {
      reporter(results, cb) {
        assert.strictEqual(Object.keys(results.modules).length, 0);

        cb();
      }
    };

    return runTests({
      _source: [testsPath],
      testcase: 'Unknown'
    }, settings({
      globals
    }))
      .then(_ => {
        assert.ok(false, 'Test runner should have failed with invalid testcase error message');
      })
      .catch(err => {
        assert.strictEqual(err.message, '"Unknown" is not a valid testcase in the current test suite.');
      });
  });

  it('testRunCurrentTestName', function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after/sampleSingleTest.js');

    const globals = {
      beforeEach(client, cb) {
        assert.strictEqual(client.currentTest.name, '');
        assert.strictEqual(client.currentTest.group, '');
        assert.strictEqual(client.currentTest.module, 'sampleSingleTest');
        cb();
      },
      afterEach(client, cb) {
        assert.strictEqual(client.currentTest.name, 'demoTest');
        assert.strictEqual(client.currentTest.module, 'sampleSingleTest');
        cb();
      },
      reporter(results, cb) {
        assert.ok('sampleSingleTest' in results.modules);
        assert.ok('demoTest' in results.modules.sampleSingleTest.completed);

        cb();
      }
    };

    return runTests(testsPath, settings({
      globals
    }));
  });

  it('currentTest in afterEach hook', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withaftereach/sampleSingleTest.js');
    const globals = {
      reporter(results, cb) {
        if (results.lastError instanceof Error) {
          throw results.lastError;
        }
        cb();
      }
    };

    return runTests(testsPath, settings({
      globals
    }));
  });

  it('testRunner with retries', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withfailures');
    const globals = {
      calls: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 6);
        assert.strictEqual(results.passed, 1);
        assert.strictEqual(results.failed, 1);
        assert.strictEqual(results.errors, 0);
        assert.strictEqual(results.skipped, 1);
        cb();
      },
      retryAssertionTimeout: 0
    };

    return runTests({
      retries: 1,
      _source: [testsPath]
    }, settings({
      globals
    }));
  });

  it('testRunner with retries and describe', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withdescribe/failures/sampleTest.js');
    const globals = {
      calls: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 6);
        assert.strictEqual(results.passed, 1);
        assert.strictEqual(results.failed, 1);
        assert.strictEqual(results.errors, 0);
        assert.strictEqual(results.skipped, 1);
        cb();
      },
      retryAssertionTimeout: 0
    };

    return runTests({
      retries: 1,
      _source: [testsPath]
    }, settings({
      globals
    }));
  });

  it('testRunner with retries and describe with attribute', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withdescribe/failures/sampleTestWithAttribute.js');
    const globals = {
      calls: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 6);
        assert.strictEqual(results.passed, 1);
        assert.strictEqual(results.failed, 1);
        assert.strictEqual(results.errors, 0);
        assert.strictEqual(results.skipped, 1);
        cb();
      },
      retryAssertionTimeout: 0
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      globals
    }));
  });

  it('testRunner with retries and describe with attribute and argument', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withdescribe/failures/sampleTestWithAttribute.js');
    const globals = {
      calls: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 6);
        cb();
      },
      retryAssertionTimeout: 0
    };

    return runTests({
      retries: 2,
      _source: [testsPath]
    }, settings({
      globals
    }));
  });

  it('testRunner with skipped testcases', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withdescribe/skipped/skipTestcase.js');
    const globals = {
      calls: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 2);
        cb();
      },
      retryAssertionTimeout: 0
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      globals
    }));
  });

  it('testRunner with skipped beforeEach afterEach hooks', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withdescribe/skipped/skipBeforeAfterEach.js');
    const globals = {
      calls: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 4);
        cb();
      },
      retryAssertionTimeout: 0
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      globals
    }));
  });

  it('testRunner with disabled testsuite - xdescribe', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withdescribe/skipped/skipTestsuite.js');
    const globals = {
      calls: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 0);
        assert.strictEqual(Object.keys(results.modules.skipTestsuite.completed).length, 0);
        cb();
      },
      retryAssertionTimeout: 0
    };

    return runTests({
      _source: [testsPath]
    }, settings({
      globals
    }));
  });

  it('testRunner with retries and skip_testcases_on_fail=false', function() {
    this.timeout(100000);

    const testsPath = path.join(__dirname, '../../sampletests/withfailures');
    const globals = {
      calls: 0,
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 10);
        assert.strictEqual(results.passed, 2);
        assert.strictEqual(results.failed, 2);
        assert.strictEqual(results.errors, 0);
        cb();
      },
      retryAssertionTimeout: 0
    };

    return runTests({
      retries: 1,
      _source: [testsPath]
    }, settings({
      skip_testcases_on_fail: false,
      globals
    }));
  });

  it('testRunner throwing error with unknown require', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withuknownRequire/sample.js');

    return runTests({
      retries: 1,
      _source: [testsPath]
    }, settings({
      skip_testcases_on_fail: false
    })).catch((err) => {
      assert.strictEqual(err.displayed, true);
      assert.match(err.message, /Cannot find module 'utilWhichDoesnotexist.js'/);
    });
  });

});
