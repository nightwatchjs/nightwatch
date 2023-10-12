const path = require('path');
const assert =  require('assert');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('waitFor commands tests', function() {
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

  it('run waitFor api demo tests ', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/waitFor-commands/waitForElementTest.js');

    Mocks.visible('0', false);

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        assert.ok(results.lastError, 'should return NightwatchAssertError');
        assert.strictEqual(results.skipped, 0, 'should not skip any tests');
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      output: false,
      globals
    }));
  });

});