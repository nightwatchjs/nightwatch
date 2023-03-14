const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');
const mockery  = require('mockery');

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
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  afterEach(function() {
    process.env.__NIGHTWATCH_PARALLEL_MODE = null;
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    Object.keys(require.cache).filter(i => i.includes('/sampletests')).forEach(function(module) {
      delete require.cache[module];
    });
  });

  it('testRunner with globalBefore and after', function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after');
    let beforeEachCount = 0;
    let afterEachCount = 0;

    const globals = {
      calls: 0,

      beforeEach() {
        beforeEachCount++;
      },
      afterEach() {
        afterEachCount++;
      },
      reporter(results, cb) {

        assert.strictEqual(globals.singleTestCalled, true);
        assert.deepStrictEqual(globals.settings.selenium, {
          check_process_delay: 500,
          cli_args: {},
          log_path: './logs',
          max_status_poll_tries: 15,
          port: 10195,
          server_path: null,
          start_process: false,
          status_poll_interval: 200,
          url: 'http://localhost:10195'
        });
        assert.strictEqual(beforeEachCount, 4);
        assert.strictEqual(afterEachCount, 4);
        assert.strictEqual(globals.calls, 19);
        cb();
      }
    };

    return runTests(testsPath, settings({
      globals
    }));
  });

  this.timeout(10000);

  it('testRunner with global async beforeEach and afterEach', function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after');
    const globals = {
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
        assert.strictEqual(beforeEachCount, 4);
        assert.strictEqual(afterEachCount, 4);
        assert.strictEqual(globals.calls, 19);
        cb();
      }
    };
    let beforeEachCount = 0;
    let afterEachCount = 0;

    return runTests(testsPath, settings({
      globals
    }));
  });

  it('testRunner with global async beforeEach and afterEach with api argument', function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after');
    const globals = {
      calls: 0,
      beforeEach(client, done) {
        assert.deepStrictEqual(client.globals, this);
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
        assert.strictEqual(globals.calls, 19);
        assert.strictEqual(beforeEachCount, 4);
        assert.strictEqual(afterEachCount, 4);
        cb();
      }
    };

    let beforeEachCount = 0;
    let afterEachCount = 0;

    return runTests(testsPath, settings({
      globals
    }));
  });

  it('test run with global async beforeEach and assert failure', function() {
    let beforeEachCount = 0;
    const testsPath = path.join(__dirname, '../../sampletests/before-after');

    return runTests(testsPath, settings({
      globals: {
        beforeEach: function(client, done) {
          client.perform(function() {
            beforeEachCount++;
            client.assert.strictEqual(0, 1);
            done();
          });
        },
        reporter(results, cb) {
          assert.ok(results.lastError instanceof Error);
          assert.strictEqual(results.failed, 4);
          assert.strictEqual(beforeEachCount, 4);
          cb();
        }
      }
    }));
  });

  it('test run with global async beforeEach and exception', function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after/');

    return runTests(testsPath, settings({
      output: false,
      globals: {
        asyncHookTimeout: 200,
        beforeEach(client, done) {
          client
            .perform(function() {
              throw new Error('From global beforeEach');
            });
        },
        reporter(results, cb) {
          assert.deepStrictEqual(Object.keys(results.modules), [
            'sampleSingleTest',
            'sampleWithBeforeAndAfter',
            'sampleWithBeforeAndAfterNoCallback',
            'syncBeforeAndAfter'
          ]);
          assert.strictEqual(results.modules.sampleSingleTest.errmessages.length, 2);
          assert.strictEqual(results.modules.sampleWithBeforeAndAfter.errmessages.length, 1);
          assert.strictEqual(results.modules.syncBeforeAndAfter.errmessages.length, 1);
          assert.ok(results.modules.sampleSingleTest.errmessages[0].includes('Error while running "perform" command:'));

          cb();
        }
      }
    }));
  });

  it('test run with global async beforeEach and timeout error', async function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after');

    let expectedErr;

    try {
      await runTests(testsPath, settings({
        globals: {
          asyncHookTimeout: 100,
          before(done) {
          }
        }
      }));
    } catch (err) {
      expectedErr = err;
    }

    assert.ok(expectedErr instanceof Error);
    assert.ok(expectedErr.message.includes('while executing "global before".'));
  });

  it('test run with global async beforeEach and done(err);', function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after');

    return runTests(testsPath, settings({
      globals: {
        beforeEach: function(client, cb) {
          setTimeout(function() {
            cb(new Error('global beforeEach error'));
          }, 10);
        },
        reporter(results, cb) {
          assert.ok(results.lastError instanceof Error);
          assert.strictEqual(results.lastError.message, 'global beforeEach error');
          cb();
        }
      }
    }));
  });

  it('test currentTest in global beforeEach/afterEach', function() {
    const testsPath = path.join(__dirname, '../../sampletests/withfailures');
    const globals = {
      calls: 0,
      waitForConditionPollInterval: 5,
      waitForConditionTimeout: 5,
      retryAssertionTimeout: 10,
      beforeEach: function(client, done) {
        const testTimestamp = new Date(client.currentTest.timestamp);
        const currentTimestamp = new Date();

        assert.ok(testTimestamp);
        assert.strictEqual(testTimestamp.getFullYear(), currentTimestamp.getFullYear());
        assert.strictEqual(testTimestamp.getMonth(), currentTimestamp.getMonth());
        assert.strictEqual(testTimestamp.getDate(), currentTimestamp.getDate());
        assert.deepStrictEqual(client.currentTest.results, {errors: 0, failed: 0, passed: 0, assertions: [], commands: [], tests: 0});
        assert.strictEqual(client.currentTest.module, 'sample');
        assert.strictEqual(client.currentTest.name, '');
        globals.calls++;
        done();
      },

      afterEach: function(client, done) {
        assert.deepStrictEqual(client.currentTest.results.steps, ['demoTest2']);
        assert.strictEqual(client.currentTest.results.passed, 1);
        assert.strictEqual(client.currentTest.results.failed, 1);
        assert.strictEqual(client.currentTest.results.tests, 2);
        assert.ok('demoTest' in client.currentTest.results.testcases);

        assert.deepStrictEqual(client.currentTest.name, 'demoTest');
        assert.deepStrictEqual(client.currentTest.module, 'sample');
        assert.ok(client.currentTest.timestamp);
        globals.calls++;
        done();
      },

      reporter(results, cb) {
        assert.strictEqual(globals.calls, 6);

        cb();
      }
    };

    return runTests(testsPath, settings({
      output: false,
      globals
    }));
  });

  it('test global child process hooks - child process',  function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after');
    process.env.__NIGHTWATCH_PARALLEL_MODE = '1';
    const globals = {
      calls: 0,
      beforeChildProcess() {
        globals.calls++;
      },
      afterChildProcess() {
        globals.calls++;
      },
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 20);
        cb();
      }
    };

    return runTests(testsPath, settings({
      output: false,
      use_child_process: true,
      globals
    })
    );
  });

  it('test global child process hooks - worker threads',  function() {
    mockery.registerMock('./worker-process.js', class WorkerProcess {
      static get isWorkerThread() {
        return true;
      }
    });
    
    const processPort = process.port;
    process.port = {
      postMessage: function(){}
    };

    const  testsPath = path.join(__dirname, '../../sampletests/before-after');
    
    const globals = {
      calls: 0,
      beforeChildProcess() {
        globals.calls++;
      },
      afterChildProcess() {
        globals.calls++;
      },
      reporter(results, cb) {
        assert.strictEqual(globals.calls, 20);
        process.port = processPort;
        cb();
      }
    };

    return runTests(testsPath, settings({
      use_child_process: false,
      output: false,
      globals
    })
    );
  });


  it('test global async child process hooks - child process',  function() {
    const testsPath = path.join(__dirname, '../../sampletests/before-after');
    process.env.__NIGHTWATCH_PARALLEL_MODE = '1';
    const globals = {
      calls: 0,
      beforeChildProcess(_, done) {
        setTimeout(function() {
          globals.calls++;
          done();
        }, 10);
      },
      afterChildProcess(_, done) {
        setTimeout(function() {
          globals.calls++;
          done();
        }, 15);
      },
      reporter(_, cb) {
        assert.strictEqual(globals.calls, 20);
        cb();
      }
    };

    return runTests(testsPath, settings({
      output: false,
      use_child_process: true,
      globals
    }));
  });

  it('test global async child process hooks - worker thread',  function() {
    mockery.registerMock('./worker-process.js', class WorkerProcess {
      static get isWorkerThread() {
        return true;
      }
    });
    const processPort = process.port;
    process.port = {
      postMessage: function(){}
    };

    const testsPath = path.join(__dirname, '../../sampletests/before-after');
    const globals = {
      calls: 0,
      beforeChildProcess(_, done) {
        setTimeout(function() {
          globals.calls++;
          done();
        }, 10);
      },
      afterChildProcess(_, done) {
        setTimeout(function() {
          globals.calls++;
          done();
        }, 15);
      },
      reporter(_, cb) {
        assert.strictEqual(globals.calls, 20);
        process.port = processPort;
        cb();
      }
    };

    return runTests(testsPath, settings({
      output: false,
      use_child_process: false,
      globals
    }));
  });
 
});
