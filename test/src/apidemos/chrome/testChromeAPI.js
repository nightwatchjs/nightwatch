const path = require('path');
const common = require('../../../common.js');
const nock = require('nock');
const Nocks = require('../../../lib/nocks.js');
const NightwatchClient = common.require('index.js');

describe('chrome api demos', function () {
  beforeEach(function () {
    Nocks.cleanAll();
    try {
      Nocks.enable();
    } catch (e) {}
  });

  afterEach(function () {
    Nocks.deleteSession();
  });

  after(function () {
    Nocks.disable();
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

    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'chrome',
          version: 'TEST',
          platform: 'TEST'
        }
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
