const path = require('path');
const assert =  require('assert');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
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

  it('run ensure api demo tests - element selected', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/ensure/ensureTestSelected.js');
    Mocks.elementSelected();

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      output: false,
      globals
    }));
  });

  it('run ensure api demo tests - element not selected', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/ensure/ensureTestNotSelected.js');
    Mocks.elementNotSelected();
    Mocks.elementNotSelected();

    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 10,
      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      output: false,
      globals
    }));
  });

  it('run ensure api demo tests failure', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/ensure/ensureTestError.js');

    const globals = {
      waitForConditionTimeout: 10,
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          assert.strictEqual(results.lastError.name, 'NightwatchAssertError');
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
