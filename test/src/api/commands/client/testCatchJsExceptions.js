const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const CdpConnection = require('../../../../../lib/transport/selenium-webdriver/cdpConnection');

describe('.catchJsExceptions()', function () {
  beforeEach(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.catchJsExceptions(callback)', function (done) {

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

      CdpConnection.resetConnection();
      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve();
      };
      client.transport.driver.onLogException = (cdpConnection, userCallback) => {
        expectedCdpConnection = cdpConnection;
        expectedUserCallback = userCallback;
      };

      //eslint-disable-next-line
      const userCallback = (event) => {console.log(event)};
      client.api.catchJsExceptions(userCallback, function () {
        assert.strictEqual(expectedCdpConnection, undefined);  // cdpConnection is mocked
        assert.strictEqual(expectedUserCallback, userCallback);
      });

      client.start(done);
    });
  });

  it('does not throw error without callback', function (done) {

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

      CdpConnection.resetConnection();
      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve();
      };
      client.transport.driver.onLogException = (cdpConnection, userCallback) => {
        expectedCdpConnection = cdpConnection;
        expectedUserCallback = userCallback;
      };

      client.api.catchJsExceptions(undefined, function () {
        assert.strictEqual(expectedCdpConnection, undefined);  // cdpConnection is mocked
        assert.notStrictEqual(expectedUserCallback, undefined);
      });

      client.start(done);
    });
  });

  it('browser.catchJsExceptions - driver not supported', function(done){
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      }
    }).then(client => {
      //eslint-disable-next-line
      const userCallback = (event) => {console.log(event)};

      client.api.catchJsExceptions(userCallback, function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'CatchJsExceptions is not supported while using this driver');
      });
      client.start(done);
    });
  });

});