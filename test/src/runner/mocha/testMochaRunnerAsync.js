const common = require('../../../common.js');
const path = require('path');
const assert = require('assert');
const Globals = require('../../../lib/globals/commands.js');
const MockServer = require('../../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('test Mocha Runner async', function() {
  const originalExit = process.exit;
  this.timeout(10000);

  before(function(done) {
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

  it('test run mocha samples with async and failures', function() {
    const globals = {
      test_calls: 0,
      retryAssertionTimeout: 0
    };

    return runTests(path.join(__dirname, '../../../mochatests/async/'), settings({
      globals,
      test_runner: {
        type: 'mocha',
        options: {
          timeout: 5000
        }
      },
      output: false,
      silent: false
    })).catch(err => {
      return err;
    }).then((err) => {
      assert.ok(err instanceof Error);
      assert.strictEqual(globals.test_calls, 12);
      assert.strictEqual(err.failures, 2);
    });
  });
});
