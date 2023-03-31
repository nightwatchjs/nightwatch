const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');
const MockServer = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const cdp = require('../../../../../lib/transport/selenium-webdriver/cdp.js');

describe('.registerBasicAuth()', function () {
  beforeEach(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('browser.registerBasicAuth()', function (done) {
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
      let expectedUsername;
      let expectedPassword;

      cdp.resetConnection();
      client.transport.driver.createCDPConnection = function() {
        return Promise.resolve();
      };
      client.transport.driver.register = (username, password) => {
        expectedUsername = username;
        expectedPassword = password;
      };

      client.api.registerBasicAuth('nightwatch', 'BarnOwl', function (){
        assert.strictEqual(expectedUsername, 'nightwatch');
        assert.strictEqual(expectedPassword, 'BarnOwl');
      });

      client.start(done);
    });
  });

  it('browser.registerBasicAuth - driver not supported', function(done){
    Nightwatch.initW3CClient({
      desiredCapabilities: {
        browserName: 'firefox'
      }
    }).then(client => {
      client.api.registerBasicAuth('admin', 'admin', function(result){
        assert.strictEqual(result.status, -1);
        assert.strictEqual(result.error, 'RegisterBasicAuth is not supported while using this driver');
      });

      client.start(done);
    });
  });

});
