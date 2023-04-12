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

  it.skip('run appium api demo tests basic', function () {
    const testsPath = path.join(__dirname, '../../../apidemos/appium/appiumTest.js');

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    MockServer
      .addMock({
        url: '/wd/hub/session',
        method: 'POST',
        response: JSON.stringify({
          value: {
            sessionId: '13521-10219-202',
            version: 'TEST',
            platform: 'TEST'
          }
        })
      }, true)
      .addMock({
        url: '/wd/hub/session/13521-10219-202/elements',
        postdata: {
          using: 'accessibility id',
          value: 'Search Wikipedia'
        },
        method: 'POST',
        response: JSON.stringify({
          status: 0,
          state: 'success',
          value: [{'element-6066-11e4-a52e-4f735466cecf': '0'}]
        })
      }, true, true)
      .addMock({
        url: '/wd/hub/session/13521-10219-202/element',
        postdata: {
          using: 'class name',
          value: 'android.widget.ImageButton'
        },
        method: 'POST',
        response: JSON.stringify({
          status: 0,
          state: 'success',
          value: {'element-6066-11e4-a52e-4f735466cecf': '1'}
        })
      }, true)
      .addMock({
        url: '/wd/hub/session/13521-10219-202/elements',
        postdata: {
          using: 'id',
          value: 'com.app:id/search'
        },
        method: 'POST',
        response: JSON.stringify({
          status: 0,
          state: 'success',
          value: [{'element-6066-11e4-a52e-4f735466cecf': '2'}]
        })
      }, true)
      .addMock({
        url: '/wd/hub/session/13521-10219-202/element/0/click',
        method: 'POST',
        response: JSON.stringify({
          value: null
        })
      }, true)
      .addMock({
        url: '/wd/hub/session/13521-10219-202/element/2/value',
        method: 'POST',
        postdata: JSON.stringify({
          text: 'Nightwatch',
          value: 'Nightwatch'.split('')
        }),
        response: JSON.stringify({
          value: null
        })
      }, true);

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
