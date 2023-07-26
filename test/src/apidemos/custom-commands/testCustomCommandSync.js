const path = require('path');
const assert = require('assert');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('sync custom commands', function() {
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

  it('test sync custom command returning NightwatchAPI as result', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/custom-commands-parallel');
    Mocks.createNewW3CSession({
      testName: 'Test Sync Custom Commands returning NightwatchAPI'
    });

    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 120,
      retryAssertionTimeout: 1000,

      reporter(results) {
        assert.strictEqual(Object.keys(results.modules).length, 1);
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests({
      env: 'default',
      config: 'test/extra/parallelism-customCommandsSync.json'
    }, Object.assign({}, {
      globals
    }));
  });
});
