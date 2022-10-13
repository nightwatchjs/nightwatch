const path = require('path');
const assert =  require('assert');
const MockServer = require('../../../lib/mockserver.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('ensure api demos', function() {
  beforeEach(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    this.server.close(function() {
      done();
    });
  });


  it('run ensure api demo tests failure', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/async-await/abortOnFailure.js');

    const globals = {
      waitForConditionTimeout: 10,
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          assert.strictEqual(results.passed, 1);
          assert.strictEqual(results.failed, 2);
          assert.strictEqual(results.lastError.name, 'NightwatchAssertError');
          assert.ok(results.lastError.message.includes('#weblogin'));
        } else {
          assert.fail('Should throw an error');
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      skip_testcases_on_fail: false,
      output: false,
      globals
    }));
  });

});
