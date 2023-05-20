const path = require('path');
const assert = require('assert');

const commandMocks = require('../../../lib/command-mocks');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('waitUntil element command', function() {
  beforeEach(function(done) {
    commandMocks.start(done);
  });

  afterEach(function(done) {
    commandMocks.stop(done);
  });

  it('test waitUntil element command - passed', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/web-elements/waitUntilTest.js');
    commandMocks.w3cSelected();
    commandMocks.w3cVisible();
    commandMocks.w3cEnabled();
  

    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 120,
      retryAssertionTimeout: 100,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
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

  it('test waitUntil element command - failed', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/web-elements/waitUntilFailureTest.js');
    commandMocks.w3cSelected();
    commandMocks.w3cVisible();
  

    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 120,
      retryAssertionTimeout: 100,

      reporter(results) {
        if (!results.lastError) {
          assert.fail('Should result into failure');
        }
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
