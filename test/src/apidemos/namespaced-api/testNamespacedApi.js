const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('namespaced api tests', function() {
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

  it('run basic test with namespaced api', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/namespaced-api/namespacedApiTest.js');

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/orientation',
      statusCode: 200,
      response: JSON.stringify({
        value: null
      }),
      times: 4
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/title',
      method: 'GET',
      response: JSON.stringify({
        value: 'Localhost'
      }),
      times: 7
    });

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      skip_testcases_on_fail: false,
      output: true,
      globals
    }));
  });
});
