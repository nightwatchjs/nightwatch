const path = require('path');
const assert = require('assert');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('custom commands with auto invoke', function() {
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

  it('custom find elements es6 async', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/custom-commands/testUsingAutoInvokeCommand.js');
    Mocks.createNewW3CSession({
      testName: 'Test Using ES6 Async Custom Commands'
    });

    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 120,
      retryAssertionTimeout: 1000,
      count: 0,

      reporter(results) {
        
        if (results.lastError) {
          throw results.lastError;
        }
        assert.strictEqual(this.count, 1);
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      output: true,
      silent: false,
      selenium_host: null,
      custom_commands_path: [path.join(__dirname, '../../../extra/commands/autoInvoke')],
      globals
    }));
  });

});