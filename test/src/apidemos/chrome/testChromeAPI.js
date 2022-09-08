const path = require('path');
const common = require('../../../common.js');
const MockServer = require('../../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

describe('chrome api demos', function () {
  beforeEach(function (done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function (done) {
    this.server.close(function () {
      done();
    });
  });

  it('run chrome api demo tests basic', function () {
    const testsPath = path.join(__dirname, '../../../apidemos/chrome/chromeTest.js');

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    MockServer.addMock({
      url: '/wd/hub/session',
      method: 'POST',
      response: JSON.stringify({
        value: {
          sessionId: '1352110219202',
          browserName: 'chrome',
          version: 'TEST',
          platform: 'TEST'
        }
      })
    });

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        host: 'localhost',
        port: 10195,
        start_process: false
      },
      desiredCapabilities: {
        browserName: 'chrome'
      },
      output: false,
      skip_testcases_on_fail: false,
      silent: true,
      persist_globals: true,
      globals,
      output_folder: false
    });
  });
});
