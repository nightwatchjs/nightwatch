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
    const testsPath = path.join(__dirname, '../../../apidemos/page-objects/commandsReturnTypeTest.js');

    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/click',
        method: 'POST',
        response: JSON.stringify({
          value: null
        }),
        times: 2
      })
      .addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/clear',
        method: 'POST',
        response: JSON.stringify({
          value: null
        }),
        times: 2
      })
      .addMock({
        url: '/session/13521-10219-202/execute/sync',
        method: 'POST',
        response: JSON.stringify({
          value: true
        }),
        times: 4  
      })
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'css selector',
          value: '#helpBtn'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [
            {'element-6066-11e4-a52e-4f735466cecf': '1'},
            {'element-6066-11e4-a52e-4f735466cecf': '2'}
          ]
        })
      }, true, true)
      .addMock({
        url: '/session/13521-10219-202/element/1/click',
        method: 'POST',
        response: JSON.stringify({
          value: null
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
