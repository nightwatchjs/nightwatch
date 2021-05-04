const assert = require('assert');
const MockServer  = require('../../../lib/mockserver.js');
const Nightwatch = require('../../../lib/nightwatch.js');
const CommandGlobals = require('../../../lib/globals/commands.js');

describe('.end()', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.end();', function (done) {
    this.client.api.end(result => {
      assert.strictEqual(result.state, 'success');
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
        path: 'screens'
      }
    }).then(client => {
      assert.strictEqual(typeof client.settings.screenshots.filename_format, 'function');

      const fileNameFailed = client.settings.screenshots.filename_format({
        testSuite: 'xxTestSuite',
        testCase: 'xxTestCase',
        isError: false
      });

      const fileNameError = client.settings.screenshots.filename_format({
        testSuite: 'xxTestSuite',
        testCase: 'xxTestCase',
        isError: true
      });

      assert.ok(fileNameFailed.startsWith('xxTestSuite/xxTestCase_FAILED_'));
      assert.ok(fileNameFailed.endsWith('.png'));
      assert.ok(fileNameError.startsWith('xxTestSuite/xxTestCase_ERROR_'));
      assert.ok(fileNameError.endsWith('.png'));

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
    }).catch(err => done(err));
  });

  it('client.end() - with screenshot and custom filename format', function (done) {
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
        path: './screens',
        filename_format({testSuite, testCase, isError, dateObject}) {
          return `${testSuite}/${testCase}--failed.png`;
        }
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

      let screenFileName;
      const saveScreenshot = client.api.saveScreenshot;
      client.api.saveScreenshot = function (file, callback) {
        screenFileName = file;
      };
      client.api.end(function callback(result) {
        assert.strictEqual(result.status, 0);
      });

      client.start(function(err) {
        try {
          assert.ok(screenFileName.endsWith('test_module/test_name--failed.png'));
          client.api.saveScreenshot = saveScreenshot;
          done(err);
        } catch (e) {
          done(e);
        }
      });
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

      const saveScreenshot = client.api.saveScreenshot;
      client.api.saveScreenshot = function (file, callback) {
        throw new Error('saveScreenshot should not be called');
      };

      client.api.end(function callback(result) {
        assert.strictEqual(result.status, 0);
      });

      client.start(function(err) {
        client.api.saveScreenshot = saveScreenshot;
        done(err);
      });
    });
  });
});
