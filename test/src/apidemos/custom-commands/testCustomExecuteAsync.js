const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('custom commands with es6 async', function() {
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

  it('custom execute es6 async', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/custom-commands/testUsingCustomExecute.js');
    Mocks.createNewW3CSession({
      testName: 'custom execute'
    });
    //Mocks.customExecute();

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
      selenium_host: null,
      custom_commands_path: [path.join(__dirname, '../../../extra/commands/es6async')],
      globals
    }));
  });

});
