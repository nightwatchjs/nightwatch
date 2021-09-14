const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('actions api tests', function() {
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

  it('run basic test with actions', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/actions-api/actionsApi.js');

    Mocks.createNewW3CSession({
      testName: 'Actions API demo tests'
    });

    MockServer.addMock({
      url: '/session/13521-10219-202/url',
      statusCode: 200,
      response: JSON.stringify({
        value: null
      })
    }, true);

    MockServer.addMock({
      url: '/session/13521-10219-202/actions',
      method: 'POST',
      response: JSON.stringify({
        value: null
      })
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
      selenium_host: null,
      output: false,
      globals
    }));
  });

});
