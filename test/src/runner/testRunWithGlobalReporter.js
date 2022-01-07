const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRunWithGlobalReporter', function() {
  beforeEach(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  beforeEach(function() {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  it('testRunWithGlobalReporter', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    const globals = {
      reporterCount: 0
    };

    return runTests(testsPath, settings({
      globals,
      globals_path: path.join(__dirname, '../../extra/external-globals.js'),
      output_folder: false
    }))
      .catch(err => {
        return err;
      })
      .then(err => {
        assert.strictEqual(globals.reporterCount, 1);
      });
  });

  it('testRunner with global async reporter', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let reporterCount = 0;

    return runTests(testsPath, settings({
      globals: {
        reporter(results, cb) {
          assert.ok('modules' in results);
          reporterCount++;
          cb();
        }
      },
      output_folder: false
    }))
      .catch(err => (err))
      .then(_ => {
        assert.strictEqual(reporterCount, 1);
      });
  });

  it('testRunner with global async reporter and timeout error', function() {
    let testsPath = path.join(__dirname, '../../sampletests/before-after');
    let reporterCount = 0;

    return runTests(testsPath, settings({
      globals: {
        customReporterCallbackTimeout: 10,
        reporter(results, cb) {
          assert.ok('modules' in results);
          reporterCount++;
        }
      },
      output_folder: false
    })).then(_ => {
      assert.strictEqual(reporterCount, 1);
    }).catch(err => {
      assert.strictEqual(err.message, 'Timeout while waiting (20s) for the custom global reporter callback to be called.');
    });
  });
});
