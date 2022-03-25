const assert = require('assert');
const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('expect(element.<command>) - passed', function() {
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

  it('expect(element.command()) - [Pass]', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/expect-global/expect.js');
    Mocks.elementProperty('0', 'className', {value: ['container', 'div', 'input']});
    Mocks.elementSelected();
    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 120,
      retryAssertionTimeout: 1000,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      output: false,
      skip_testcases_on_fail: false,
      globals
    }));
  });


  it('expect(element.command()) - [Fail]', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/expect-global/expect.js');
    
    Mocks.elementNotSelected();
    Mocks.elementProperty('0', 'className', {value: ['div-container']});

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        assert.ok(results.lastError instanceof Error);
        assert.strictEqual(results.failed, 1);
        assert.strictEqual(results.lastError.name, 'NightwatchAssertError');
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
      output: false
    });
  });

  
});
