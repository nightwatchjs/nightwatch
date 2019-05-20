const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('end', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.end();', function (done) {
    this.client.api.end(result => {
      assert.equal(result.state, 'success');
      assert.strictEqual(this.client.api.sessionId, null);
    });

    this.client.start(done);
  });

  it('client.end() - no session id', function (done) {
    this.client.api.end();
    this.client.api.end(function callback(result) {
      assert.strictEqual(result, null);
    });

    this.client.start(done);
  });

  it('client.end() - with screenshot', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/screenshot',
      method: 'GET',
      response: JSON.stringify({
        status: 0,
        state: 'success',
        value: '==content'
      })
    }, true);

    Nightwatch.initClient({
      screenshots: {
        enabled: true,
        on_failure: true,
        path: './screens'
      }
    }).then(client => {
      client.api.currentTest = {
        module: 'test_module',
        name: 'test_name',
        results: {
          failed: 1,
          passed: 0
        }
      };

      client.api.end(function callback(result) {
        assert.strictEqual(result.status, 0);
      });

      client.start(done);
    });
  });

  it('client.end() - failures and screenshots disabled', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/screenshot',
      response: JSON.stringify({
        status: 0,
        state: 'success',
        value: '==content'
      })
    }, true);

    Nightwatch.initClient({
      screenshots: {
        enabled: true,
        on_failure: false,
        path: './screens'
      }
    }).then(client => {
      client.api.currentTest = {
        module: 'test_module',
        name: 'test_name',
        results: {
          failed: 1,
          passed: 0
        }
      };

      client.api.saveScreenshot = function (file, callback) {
        throw new Error('saveScreenshot should not be called');
      };

      client.api.end(function callback(result) {
        assert.strictEqual(result.status, 0);
      });

      client.start(done);
    });
  });
});
