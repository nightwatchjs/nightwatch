const {strictEqual} = require('assert');
const path = require('path');
const common = require('../../../common.js');
const MockServer = require('../../../lib/mockserver.js');
const NightwatchClient = common.require('index.js');

describe('appium api demos', function () {
  beforeEach(function (done) {
    this.server = MockServer.init(undefined, {port: 4723});
    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function (done) {
    this.server.close(function () {
      done();
    });
  });

  it('run appium api demo tests basic', function () {
    const testsPath = path.join(__dirname, '../../../apidemos/appium/appiumTest.js');

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
          version: 'TEST',
          platform: 'TEST'
        }
      })
    });

    return NightwatchClient.runTests(testsPath, {
      selenium: {
        host: 'localhost',
        port: 4723,
        start_process: false,
        use_appium: true
      },
      desiredCapabilities: {
        browserName: ''
      },
      output: false,
      skip_testcases_on_fail: false,
      silent: true,
      persist_globals: true,
      globals,
      output_folder: false
    }).then(_ => {
      strictEqual(NightwatchClient.app !== undefined, true);
    });
  });
});
