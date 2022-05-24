const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const CdpConnection = require('../../../../../lib/transport/selenium-webdriver/cdpConnection');

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
      const expected = {};

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

      CdpConnection.resetConnection();
      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve({
          _wsConnection: {
            on: (event, callback) => {
              expected['wsEvent'] = event;
              callback(cdpNetworkEvent);
            }
          },
          execute: function(command, params) {
            expected['cdpCommand'] = command;
            expected['cdpParams'] = params;
          }
        });
      };

      const userCallback = (requestParams) => {
        expected['requestParams'] = requestParams;
      };
      client.api.captureNetworkCalls(userCallback, function () {
        assert.deepEqual(expected.cdpCommand, 'Network.enable');
        assert.deepEqual(expected.cdpParams, {});
        assert.strictEqual(expected.wsEvent, 'message');
        assert.deepEqual(expected.requestParams, JSON.parse(cdpNetworkEvent).params);
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
