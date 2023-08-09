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
    MockServer.addMock({
      url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/name',
      method: 'GET',
      response: JSON.stringify({
        value: 'div'
      })
    }, true);
    Mocks.w3cVisible(true, {
      times: 2
    });
    Mocks.getElementText({
      elementId: '5cc459b8-36a8-3042-8b4a-258883ea642b',
      responseText: 'sample text'
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
      selenium_host: null,
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
