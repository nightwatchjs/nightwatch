const assert = require('assert');
const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');

describe('cookie demos', function() {
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

  it('run cookie api demo tests basic', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/cookies/cookieTests.js');
    Mocks.cookiesFound({times: 6});

    const globals = {
      waitForConditionPollInterval: 50,
      calls: 0,
      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }

        assert.strictEqual(globals.calls, 2);
      }
    };

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        host: 'localhost',
        port: 10195,
        start_process: false
      },
      output: false,
      skip_testcases_on_fail: false,
      silent: false,
      persist_globals: true,
      globals,
      output_folder: false
    });
  });

  it('run cookie api demo tests with socket hang up error', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/cookies/cookieTestsWithError.js');
    Mocks.cookiesSocketDelay({times: 2});

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        assert.ok(results.lastError instanceof Error);
        assert.strictEqual(results.errors, 2);
      }
    };

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        host: 'localhost',
        port: 10195,
        start_process: false
      },
      webdriver: {
        start_process: false,
        timeout_options: {
          timeout: 50,
          retry_attempts: 0
        }
      },
      output: false,
      report_command_errors: true,
      skip_testcases_on_fail: false,
      silent: false,
      persist_globals: true,
      globals,
      output_folder: false
    });
  });
});
