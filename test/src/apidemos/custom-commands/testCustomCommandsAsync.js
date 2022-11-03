const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('custom commands with findElements es6 async', function() {
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
    const testsPath = path.join(__dirname, '../../../apidemos/custom-commands/testUsingES6AsyncCustomCommands.js');
    Mocks.createNewW3CSession({
      testName: 'Test Using ES6 Async Custom Commands'
    });

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
      silent: true,
      selenium_host: null,
      custom_commands_path: [path.join(__dirname, '../../../extra/commands/es6async')],
      globals
    }));
  });

  it('custom assert visible es6 async', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/custom-commands/testUsingAsyncCustomAssert.js');
    
    Mocks.createNewW3CSession({
      testName: 'custom command using assert'
    });

    Mocks.w3cVisible(true);

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
      silent: true,
      selenium_host: null,
      custom_commands_path: [path.join(__dirname, '../../../extra/commands/es6async')],
      globals
    }));
  });

  it('custom assert getEmail', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/custom-commands/testUsingCustomGetEmail.js');
    
    Mocks.createNewW3CSession({
      testName: 'custom execute getEmail'
    });

    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 120,
      retryAssertionTimeout: 1000
    };

    return NightwatchClient.runTests(testsPath, settings({
      output: false,
      silent: true,
      selenium_host: null,
      custom_commands_path: [path.join(__dirname, '../../../extra/commands/es6async')],
      globals
    }));
  });
});