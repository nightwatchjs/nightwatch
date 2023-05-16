const path = require('path');
const assert = require('assert');

const commandMocks = require('../../../lib/command-mocks');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('element Assertions', function() {
  beforeEach(function(done) {
    commandMocks.start(done);
  });

  afterEach(function(done) {
    commandMocks.stop(done);
  });

  it('test assert element command ', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/web-elements/assertionTest.js');
    commandMocks.w3cVisible();
    commandMocks.w3cEnabled();
    commandMocks.w3cVisible(true);

    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 120,
      retryAssertionTimeout: 0,

      reporter(results) {
        if (!results.lastError) {
          assert.fail('should have one failure');
        }
        assert.strictEqual(results.passed, 3);
        assert.strictEqual(results.failed, 1);
        assert.ok(results.lastError.name === 'NightwatchAssertError');
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      selenium: {
        port: null,
        start_process: false
      },
      selenium_host: null,
      webdriver: {
        port: 10195,
        start_process: false
      },
      output: false,
      skip_testcases_on_fail: false,
      globals
    }));
  });

});
