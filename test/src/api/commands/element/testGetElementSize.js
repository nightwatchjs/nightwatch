const assert = require('assert');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getElementSize', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done, {
      output: false
    });
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getElementSize()', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/rect',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: {
          width: 10,
          height: 20,
          x: 1,
          y: 0
        }
      })
    }, null, true);

    this.client.api.getElementSize('#weblogin', function callback(result) {
      assert.deepStrictEqual(result, {
        status: 0,
        value: {
          x: 1,
          y: 0,
          width: 10,
          height: 20
        }
      });
    }).getElementSize('css selector', '#weblogin', function callback(result) {
      assert.deepStrictEqual(result, {
        status: 0,
        value: {
          x: 1,
          y: 0,
          width: 10,
          height: 20
        }
      });
    });

    this.client.start(done);
  });

  it('client.getElementSize() with webdriver protocol', function (done) {
    Nightwatch.initW3CClient({

    }).then(client => {
      MockServer.addMock({
        url: '/session/13521-10219-202/element/5cc459b8-36a8-3042-8b4a-258883ea642b/rect',
        method: 'GET',
        response: {
          value: {
            x: 341.5,
            y: 340.95001220703125,
            width: 683,
            height: 60
          }
        }
      }, true);

      client.api.getElementSize('#webdriver', function (result) {
        assert.deepStrictEqual(result, {
          status: 0,
          value: {
            x: 341.5,
            y: 340.95001220703125,
            width: 683,
            height: 60
          }
        });
      });

      client.start(done);
    });
  });

  it('client.getElementSize() with webdriver protocol - element not found', function (done) {
    Nightwatch.initClient({
      selenium: {
        version2: false,
        start_process: false,
        host: null
      },
      webdriver: {
        host: 'localhost',
        start_process: false
      },
      silent: false,
      output: false,
      globals: {
        waitForConditionPollInterval: 10
      }
    }).then(client => {
      MockServer.addMock({
        statusCode: 404,
        url: '/session/13521-10219-202/elements',
        postdata: {using: 'css selector', value: '#webdriver-notfound'},
        response: {
          value: {
            error: 'no such element',
            message: 'Unable to locate element: #webdriver-notfound',
            stacktrace: 'WebDriverError@chrome://marionette/content/error.js:172:5\nNoSuchElementError@chrome://marionette/content/error.js:400:5'
          }
        },
        times: 2
      });

      client.api.getElementSize({selector: '#webdriver-notfound', timeout: 10}, function (result) {
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.value.error, 'An error occurred while running .getElementSize() command on <#webdriver-notfound>: Timed out while waiting for element "#webdriver-notfound" with "css selector" to be present for 10 milliseconds.');
        assert.strictEqual(result.value.message, 'An error occurred while running .getElementSize() command on <#webdriver-notfound>: Timed out while waiting for element "#webdriver-notfound" with "css selector" to be present for 10 milliseconds.');
      });

      client.start(done);
    });
  });
});
