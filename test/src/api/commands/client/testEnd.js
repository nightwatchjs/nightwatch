const path = require('path');
const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const Nightwatch = require('../../../../lib/nightwatch.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.end()', function() {
  describe('with backwards compat mode', function() {
    beforeEach(function(done) {
      CommandGlobals.beforeEach.call(this, done, {
        backwards_compatibility_mode: true
      });
    });

    afterEach(function(done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('browser.end();', function (done) {
      this.client.api.end(result => {
        assert.strictEqual(result.status, 0);
        assert.strictEqual(this.client.api.sessionId, null);
      });

      this.client.start(done);
    });

    it('browser.end(true) - forceEnd by default true', function (done) { 
      this.client.api.end(true, result => {
        assert.strictEqual(result.status, 0);
        assert.strictEqual(this.client.sessionId, null);
      });
      this.client.start(done);
    });

    it('browser.end(false) - do not end sesion', function(done) {
      this.client.api.end(false, result=> {
        assert.strictEqual(result, null);
        assert.strictEqual(this.client.sessionId, '1352110219202');
      });
      this.client.start(done);
    });

    it('browser.end() - no session id', function (done) {
      this.client.api.end();
      this.client.api.end(function callback(result) {
        assert.strictEqual(result, null);
      });

      this.client.start(done);
    });

    it('browser.end() - with screenshot', function (done) {
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

        assert.ok(fileNameFailed.startsWith(`xxTestSuite${path.sep}xxTestCase_FAILED_`));
        assert.ok(fileNameFailed.endsWith('.png'));
        assert.ok(fileNameError.startsWith(`xxTestSuite${path.sep}xxTestCase_ERROR_`));
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


    it('browser.end() - reuse browser session', function (done) {

      Nightwatch.initClient({globals: {reuseBrowserSession: true}})
        .then(client => {
          client.api.end(function callback(result) {
            assert.strictEqual(result, null);
            assert.strictEqual(client.sessionId, '1352110219202');
          });

          client.start(done);
        }).catch(err => done(err));
    });


    it('browser.end() - failures and screenshots disabled', function (done) {
      MockServer.addMock({
        url: '/wd/hub/session/1352110219202/screenshot',
        response: JSON.stringify({
          status: 0,
          state: 'success',
          value: '==content'
        })
      }, true);

      Nightwatch.initClient({
        backwards_compatibility_mode: true,
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

  describe('without compat mode', function() {
    beforeEach(function(done) {
      CommandGlobals.beforeEach.call(this, done);
    });

    afterEach(function(done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('browser.end();', function (done) {
      this.client.api.end(result => {
        assert.strictEqual(result.status, 0);
        assert.strictEqual(this.client.api.sessionId, null);
      });

      this.client.start(done);
    });

    it('browser.end() - no session id', function (done) {
      this.client.api.end();
      this.client.api.end(function callback(result) {
        assert.strictEqual(result, null);
      });

      this.client.start(done);
    });

    it('browser.end() - with screenshot', function (done) {
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

        assert.ok(fileNameFailed.startsWith(`xxTestSuite${path.sep}xxTestCase_FAILED_`));
        assert.ok(fileNameFailed.endsWith('.png'));
        assert.ok(fileNameError.startsWith(`xxTestSuite${path.sep}xxTestCase_ERROR_`));
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

    it('browser.end() - failures and screenshots disabled', function (done) {
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
});
