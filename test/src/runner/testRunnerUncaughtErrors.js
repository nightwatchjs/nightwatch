const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

describe('testRunWithUncaughtErrors', function() {

  before(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  after(function(done) {
    this.server.close(function() {
      done();
    });
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  it('test runner with uncaught exception', function(done) {
    let testsPath = path.join(__dirname, '../../sampletests/withuncaughterrors');
    let errorReported = false;
    let testErr;

    let globals = {
      reporter(results) {
        if (results.errmessages.length) {
          errorReported = true;
          try {
            assert.strictEqual(typeof results.modules.demoTestFine, 'object');
            assert.strictEqual(typeof results.modules.demoTestWithError, 'object');
            assert.strictEqual(results.passed, 4);
            assert.strictEqual(results.errors, 1);
            assert.strictEqual(results.assertions, 4);
            assert.strictEqual(results.modules.demoTestFine.assertionsCount, 2);
            assert.strictEqual(results.modules.demoTestFine.passedCount, 2);
            assert.strictEqual(results.modules.demoTestWithError.assertionsCount, 2);
            assert.strictEqual(results.modules.demoTestWithError.passedCount, 2);
            assert.ok(results.errmessages[0].includes('Error: Test Error Uncaught'));
          } catch (e) {
            testErr = e;
          }
        }
      }
    };


    const orig = process.exit;
    process.exit = function(code) {};

    NightwatchClient.runTests(testsPath, {
      selenium: {
        port: 10195,
        version2: true,
        start_process: true
      },
      output: true,
      silent: false,
      persist_globals: true,
      globals: globals,
      output_folder: false
    });

    setTimeout(function () {
      process.exit = orig;
      try {
        if (testErr) {
          done(testErr);
          return;
        }

        assert.strictEqual(errorReported, true);
        done();
      } catch (e) {
        done(e);
      }
    }, 500);
  });
});
