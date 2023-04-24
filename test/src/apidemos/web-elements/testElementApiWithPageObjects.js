const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('new element api with page objects', function() {
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

  it('test custom command', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/web-elements/elementApiWithPageObjects.js');

    MockServer
      .addMock({
        url: '/session/13521-10219-202/elements',
        postdata: {
          using: 'xpath',
          value: './/*[text()="Web Login"]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [
            {'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'},
            {'element-6066-11e4-a52e-4f735466cecf': '3783b042-7001-0740-a2c0-afdaac732e9f'}
          ]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'xpath',
          value: './/*[text()="Help"]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '2'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'css selector',
          value: '#getStarted'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [
            {'element-6066-11e4-a52e-4f735466cecf': '2'},
            {'element-6066-11e4-a52e-4f735466cecf': '3'}
          ]
        })
      }, true, true)
      .addMock({
        url: '/session/13521-10219-202/element/2/elements',
        postdata: {
          using: 'css selector',
          value: '#getStartedStart'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [
            {'element-6066-11e4-a52e-4f735466cecf': '4'},
            {'element-6066-11e4-a52e-4f735466cecf': '5'},
            {'element-6066-11e4-a52e-4f735466cecf': '6'}
          ]
        })
      }, true, true);

    const globals = {
      calls: 0,
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 120,
      retryAssertionTimeout: 100,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      selenium: {
        port: null,
        start_process: false
      },
      selenium_host: null,
      webdriver: {
        port: 10195,
        start_process: false
      },
      output: false,
      skip_testcases_on_fail: false,
      page_objects_path: [path.join(__dirname, '../../../extra/pageobjects/pages')],
      globals
    }));
  });
});
