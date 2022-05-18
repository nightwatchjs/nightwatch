const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');

describe('.captureNetworkCalls()', function () {
  beforeEach(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.captureNetworkCalls()', function (done) {

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

      let expectedCdpCommand;
      let expectedCdpParams;
      let expectedWsEvent;
      let expectedRequestParams;

      const cdpNetworkEvent = JSON.stringify({
        method: 'Network.requestWillBeSent',
        params: {
          request: {
            url: 'https://www.google.com',
            method: 'GET',
            headers: []
          }
        }
      });

      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          _wsConnection: {
            on: (event, callback) => {
              expectedWsEvent = event;
              callback(cdpNetworkEvent);
            }
          },
          execute: function(command, params) {
            expectedCdpCommand = command;
            expectedCdpParams = params;
          }
        });
      };

      const userCallback = (requestParams) => {
        expectedRequestParams = requestParams;
      };
      client.api.captureNetworkCalls(userCallback, function () {
        assert.deepEqual(expectedCdpCommand, 'Network.enable');
        assert.deepEqual(expectedCdpParams, {});
        assert.strictEqual(expectedWsEvent, 'message');
        assert.deepEqual(expectedRequestParams, JSON.parse(cdpNetworkEvent).params);
      });
      client.start(done);
    });
  });

  it('browser.captureNetworkCalls - driver not supported', function(done) {
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      }
    }).then(client => {
      // eslint-disable-next-line
      const userCallback = (requestParams) => {console.log(requestParams)}
      client.api.captureNetworkCalls(userCallback, function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'CaptureNetworkCalls is not supported while using this driver');
      });
      client.start(done);
    });
  });

});
