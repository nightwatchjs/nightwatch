const common = require('../../common.js');
const path = require('path');
const assert = require('assert');
const Globals = require('../../lib/globals/commands.js');
const MockServer = require('../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('test Runner with async and assertion failure', function() {
  const originalExit = process.exit;
  this.timeout(15000);

  beforeEach(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    process.removeAllListeners('exit');
    process.removeAllListeners('uncaughtException');
    process.exit = originalExit;
    Globals.afterEach.call(this, done);
  });

  it('test run mocha samples with async and assertion failures', function() {
    const globals = {
      test_calls: 0,
      retryAssertionTimeout: 0,
      reporter(results) {
        assert.strictEqual(globals.test_calls, 16);
      }
    };

    return runTests(path.join(__dirname, '../../sampletests/asyncwithfailures/'), settings({
      globals,
      skip_testcases_on_fail: false,
      output: false,
      silent: false
    }));
  });
});
