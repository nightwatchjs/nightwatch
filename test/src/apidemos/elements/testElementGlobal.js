const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('element global demos', function() {
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

  it('getText on element global instance', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/elements/elementGlobalTest.js');
    Mocks.elementText();
    Mocks.tagName('0', 'div');
    Mocks.visible('0', true, {
      times: 2
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
      skip_testcases_on_fail: false,
      globals
    }));
  });

  it('set use_xpath locate-strategy in element global', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/elements/testGlobalLocateStrategy.js');

    return NightwatchClient.runTests(testsPath, settings({
      output: false,
      use_xpath: true
    }));
  });
  
});
