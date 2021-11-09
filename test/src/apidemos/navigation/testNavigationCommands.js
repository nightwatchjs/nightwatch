const path = require('path');
const assert = require('assert');
const MockServer = require('../../../lib/mockserver.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('navigation commands tests', function() {
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

  it('navigate tests', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/navigation/navigateTest.js');

    const globals = {
      calls: 0,
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 120,
      retryAssertionTimeout: 1000,

      onBrowserNavigate(browser) {
        browser.globals.calls += 1;
      },

      onBrowserQuit(browser) {
        browser.globals.calls += 1;
      },

      reporter(results) {
        assert.strictEqual(browser.globals.calls, 8);

        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      output: false,
      skip_testcases_on_fail: false,
      custom_commands_path: [path.join(__dirname, '../../../extra/commands')],
      globals
    }));
  });

  
});
