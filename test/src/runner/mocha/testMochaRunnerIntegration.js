const common = require('../../../common.js');
const path = require('path');
const assert = require('assert');
const Globals = require('../../../lib/globals/commands.js');
const MockServer = require('../../../lib/mockserver.js');
const {settings} = common;
const {runTests} = common.require('index.js');

describe('test Mocha Runner integration', function() {
  this.timeout(10000);

  before(function(done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    Globals.afterEach.call(this, done);
  });

  it('testRunMochaSampleTests', function() {
    const globals = {
      test_calls: 0,
      retryAssertionTimeout: 0
    };

    let testsPath = path.join(__dirname, '../../../mochatests/integration');
    let error;

    return runTests(testsPath, settings({
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
      error = err;
    }).then((err) => {
      assert.strictEqual(globals.waitForConditionTimeout, 1100);
      assert.strictEqual(globals.retryAssertionTimeout, 1100);
      assert.strictEqual(globals.waitForConditionPollInterval, 100);

      assert.strictEqual(globals.test_calls, 17);
    });
  });

});
