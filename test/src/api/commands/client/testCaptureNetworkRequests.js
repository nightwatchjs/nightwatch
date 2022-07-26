const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const cdp = require('../../../../../lib/transport/selenium-webdriver/cdp.js');

describe('.captureNetworkRequests()', function () {
  beforeEach(function (done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.captureNetworkRequests()', function (done) {

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
      },
      output: process.env.VERBOSE === '1',
      silent: false
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

      cdp.resetConnection();
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
      client.api.captureNetworkRequests(userCallback, function () {
        assert.deepEqual(expected.cdpCommand, 'Network.enable');
        assert.deepEqual(expected.cdpParams, {});
        assert.strictEqual(expected.wsEvent, 'message');
        assert.deepEqual(expected.requestParams, JSON.parse(cdpNetworkEvent).params);
      });
      client.start(done);
    });
  });

  it('throws error without callback', function (done) {

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
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then(client => {
      client.api.captureNetworkRequests(undefined, function (result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'Callback is missing from .captureNetworkRequests() command.');
      });

      client.start(done);
    });
  });

  it('browser.captureNetworkRequests - driver not supported', function(done) {
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then(client => {
      // eslint-disable-next-line
      const userCallback = (requestParams) => {console.log(requestParams)}
      client.api.captureNetworkRequests(userCallback, function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'The command .captureNetworkRequests() is only supported in Chrome and Edge drivers');
      });
      client.start(done);
    });
  });

});
