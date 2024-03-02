const path = require('path');
const assert = require('assert');
const {Key} = require('selenium-webdriver');
const common = require('../../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('setPassword', function() {

  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.setPassword()', function(done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/value',
      method: 'POST',
      postdata: {
        text: Key.NULL + 'password',
        value: [Key.NULL, 'p', 'a', 's', 's', 'w', 'o', 'r', 'd']
      },
      response: {
        sessionId: '1352110219202',
        status: 0
      }
    });

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/clear',
      method: 'POST',
      response: {
        sessionId: '1352110219202',
        status: 0
      }
    });

    this.client.api
      .setPassword('css selector', '#weblogin', 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .setPassword('css selector', {
        selector: '#weblogin',
        timeout: 100
      }, 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .setPassword({
        selector: '#weblogin',
        timeout: 100
      }, 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      })
      .setPassword('#weblogin', 'password', function callback(result) {
        assert.strictEqual(result.status, 0);
      });

    this.client.start(done);
  });

  it('client.setPassword() value redacted in rawHttpOutput', async function() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/element/0/value',
      method: 'POST',
      postdata: {
        text: Key.NULL + 'password',
        value: [Key.NULL, 'p', 'a', 's', 's', 'w', 'o', 'r', 'd']
      },
      response: {
        sessionId: '1352110219202',
        status: 0
      }
    });

    const testsPath = [
      path.join(__dirname, '../../../../sampletests/checkValueRedacted/passwordValueRedacted.js')
    ];

    const globals = {
      calls: 0,
      waitForConditionTimeout: 10,
      waitForConditionPollInterval: 10,
      reporter(results) {
        assert.strictEqual(globals.calls, 2);
        const rawHttpOutput = results.modules.passwordValueRedacted.rawHttpOutput;
        assert.strictEqual(rawHttpOutput[24][1], '  Request POST /wd/hub/session/1352110219202/element/0/value  ');
        assert.strictEqual(rawHttpOutput[24][2], '{ text: \'****\', value: [ \'*\', \'*\', \'*\', \'*\' ] }');
      }
    };

    await NightwatchClient.runTests(testsPath, settings({
      globals
    }));
  });
});
