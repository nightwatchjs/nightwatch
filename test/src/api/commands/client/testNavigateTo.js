const assert = require('assert');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('.navigateTo()', function() {
  describe('with backwards compat mode', function() {
    before(function(done) {
      CommandGlobals.beforeEach.call(this, done, {
        backwards_compatibility_mode: true
      });
    });

    after(function(done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('browser.navigateTo(); relative url', function (done) {
      this.client.api.baseUrl = 'http://localhost';
      this.client.api.navigateTo('/homepage', result => {
        assert.deepStrictEqual(result, {value: null, status: 0});
      });

      this.client.start(done);
    });

    it('browser.navigateTo(); relative url without baseUrl', function (done) {
      this.client.api.baseUrl = null;
      this.client.api.navigateTo('/homepage');

      this.client.start(function(err) {
        try {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message, 'Error while running "navigateTo" command: Invalid URL /homepage. When using relative uris, you must define a "baseUrl" or "launchUrl" in your nightwatch config.');
          done();
        } catch (e) {
          done(e);
        }

      });
    });

    it('browser.navigateTo() - with url', function (done) {
      this.client.api.navigateTo('http://localhost/test_url', result => {
        assert.strictEqual(result.status, 0);
      });

      this.client.start(done);
    });

    it('browser.navigateTo() - with onBrowserNavigate global', function (done) {
      let resultFromPerform;
      let resultFromCallback;

      this.client.settings.globals.onBrowserNavigate = async function(browser, result) {
        resultFromPerform = await browser.perform(function() {
          const resultCopy = Object.assign({}, result);
          resultCopy.something = 'test-value';

          return resultCopy;
        });
      };

      this.client.api.navigateTo('http://localhost/test_url', result => {
        resultFromCallback = result;

        return result;
      });

      this.client.start(function(err) {
        if (err) {
          done(err);

          return;
        }

        try {
          assert.deepStrictEqual(resultFromCallback, {value: null, status: 0});
          assert.deepStrictEqual(resultFromPerform, {value: null, status: 0, something: 'test-value'});
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('browser.navigateTo() - with onBrowserNavigate global and default callback', function (done) {
      let resultFromPerform;

      this.client.settings.globals.onBrowserNavigate = async function(browser, result) {
        resultFromPerform = await browser.perform(function() {
          const resultCopy = Object.assign({}, result);
          resultCopy.something = 'test-value';

          return resultCopy;
        });
      };

      this.client.api.navigateTo('http://localhost/test_url');

      this.client.start(function(err) {
        if (err) {
          done(err);

          return;
        }

        try {
          assert.deepStrictEqual(resultFromPerform, {value: null, status: 0, something: 'test-value'});
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe('without compat mode', function() {
    before(function(done) {
      CommandGlobals.beforeEach.call(this, done);
    });

    after(function(done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('browser.navigateTo();', function (done) {
      this.client.api.baseUrl = 'http://localhost';
      this.client.api.navigateTo('/test_url', result => {
        assert.strictEqual(result.status, 0);
      });

      this.client.start(done);
    });

    it('browser.navigateTo(); with error', function (done) {
      this.client.api.navigateTo();

      this.client.start(function(err) {
        try {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message, 'Error while running "navigateTo" command: Missing url parameter.');
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('browser.navigateTo() - with url', function (done) {
      this.client.api.navigateTo('http://localhost/test_url', result => {
        assert.strictEqual(result.status, 0);
      });

      this.client.start(done);
    });
  });
});
