const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const cdp = require('../../../../../lib/transport/selenium-webdriver/cdp.js');

describe('.captureBrowserConsoleLogs()', function () {
  beforeEach(function (done) {
    this.server = MockServer.init();

    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.captureBrowserConsoleLogs()', function (done) {

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
      client.api.captureBrowserConsoleLogs(userCallback, function () {
        assert.strictEqual(expectedCdpConnection, undefined);  // cdpConnection is mocked
        assert.strictEqual(expectedUserCallback, userCallback);
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
      client.api.captureBrowserConsoleLogs(undefined, function (result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'Callback is missing from .captureBrowserConsoleLogs() command.');
      });

      client.start(done);
    });
  });

  it('browser.captureBrowserConsoleLogs - driver not supported', function(done){
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      },
      output: process.env.VERBOSE === '1',
      silent: false
    }).then(client => {
      //eslint-disable-next-line
      const userCallback = (event) => {console.log(event)};

      client.api.captureBrowserConsoleLogs(userCallback, function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'The command .captureBrowserConsoleLogs() is only supported in Chrome and Edge drivers');
      });
      client.start(done);
    });
  });

});
