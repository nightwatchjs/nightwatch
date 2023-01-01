const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('relative locators demo', function() {
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

  it('run relative locators', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/relative-locators/sample-with-relative-locators.js');
    Mocks.executeSync({
      value: [
        {
          'element-6066-11e4-a52e-4f735466cecf': 'afe6842f-7d0c-4108-9f68-ac5709855960'
        }
      ]
    }, {times: 1});

    Mocks.executeSync({value: true}, {times: 1});

    Mocks.executeSync({
      value: [
        {
          'element-6066-11e4-a52e-4f735466cecf': 'afe6842f-7d0c-4108-9f68-ac5709855960'
        }
      ]
    }, {times: 2});

    Mocks.tagName('afe6842f-7d0c-4108-9f68-ac5709855960', 'input');
    Mocks.clearElement('afe6842f-7d0c-4108-9f68-ac5709855960');

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/afe6842f-7d0c-4108-9f68-ac5709855960/value',
      method: 'POST',
      postdata: {text: 'password', value: ['p', 'a', 's', 's', 'w', 'o', 'r', 'd']},
      response: {
        sessionId: '1352110219202',
        status: 0
      }
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

  
});
