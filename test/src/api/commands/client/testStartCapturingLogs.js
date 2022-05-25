const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const cdp = require('../../../../../lib/transport/selenium-webdriver/cdp');

describe('.startCapturingLogs()', function () {
  beforeEach(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.startCapturingLogs()', function (done) {

    MockServer.addMock({
      url: '/session',
      response: {
        value: {
          sessionId: '13521-10219-202',
          capabilities: {
            browserName: 'chrome',
            browserVersion: '92.0'
          }
        }
      },
      method: 'POST',
      statusCode: 201
    }, true);

    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {}
      }
    }).then(client => {

      let expectedCdpConnection;
      let expectedUserCallback;

      cdp.resetConnection();
      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve();
      };
      client.transport.driver.onLogEvent = (cdpConnection, userCallback) => {
        expectedCdpConnection = cdpConnection;
        expectedUserCallback = userCallback;
      };

      //eslint-disable-next-line
      const userCallback = (event) => {console.log(event)};
      client.api.startCapturingLogs(userCallback, function () {
        assert.strictEqual(expectedCdpConnection, undefined);  // cdpConnection is mocked
        assert.strictEqual(expectedUserCallback, userCallback);
      });

      client.start(done);
    });
  });

  it('browser.startCapturingLogs - driver not supported', function(done){
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      }
    }).then(client => {
      //eslint-disable-next-line
      const userCallback = (event) => {console.log(event)};

      client.api.startCapturingLogs(userCallback, function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'StartCapturingLogs is not supported while using this driver');
      });
      client.start(done);
    });
  });

});
