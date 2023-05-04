const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const CommandGlobals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('testRerun', function () {
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

  it('Rerun with --rerun-failed cli argument without setting env variable for json reporter', function () {

    return runTests({
      'rerun-failed': true
    }, settings({
      output: false
    })).catch(err => {
      return err;
    }).then(err => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Unable to find the Json reporter file to rerun failed tests');
      assert.strictEqual(err.detailedErr, 'Configure the environment variable NIGHTWATCH_RERUN_FAILED_TEST with Json reporter file path');
    });
  });

  it('Rerun with env varaible without setting env variable for json reporter', function () {
    process.env.NIGHTWATCH_RERUN_FAILED = 'true';

    return runTests({
      'rerun-failed': true
    }, settings({
      output: false
    })).catch(err => {
      return err;
    }).then(err => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'Unable to find the Json reporter file to rerun failed tests');
      assert.strictEqual(err.detailedErr, 'Configure the environment variable NIGHTWATCH_RERUN_FAILED_TEST with Json reporter file path');

      delete process.env.NIGHTWATCH_RERUN_FAILED;
    });
  });

  it('Rerun with env varaible set and with setting env variable for json reporter', function () {
    process.env.NIGHTWATCH_RERUN_FAILED = 'true';
    process.env.NIGHTWATCH_RERUN_REPORT_FILE = path.join(__dirname, '../../extra/rerunJsonReporter.json');

    return runTests({
    }, settings({
      output: false,
      globals: {
        reporter(results) {
          assert.strictEqual(Object.keys(results.modules).length, 1);
          assert.strictEqual(results.assertions, 2);
        }
      }
    })).then(err => {
      assert.strictEqual(err, false);

      delete process.env.NIGHTWATCH_RERUN_FAILED;
      delete process.env.NIGHTWATCH_RERUN_REPORT_FILE;
    });
  });

  it('Rerun with cli flag and with setting env variable for json reporter', function () {
    process.env.NIGHTWATCH_RERUN_REPORT_FILE = path.join(__dirname, '../../extra/rerunJsonReporter.json');

    return runTests({
      'rerun-failed': true
    }, settings({
      output: false,
      globals: {
        reporter(results) {
          assert.strictEqual(Object.keys(results.modules).length, 1);
          assert.strictEqual(results.assertions, 2);
        }
      }
    })).then(err => {
      assert.strictEqual(err, false);
      delete process.env.NIGHTWATCH_RERUN_REPORT_FILE;
    });
  });


});
