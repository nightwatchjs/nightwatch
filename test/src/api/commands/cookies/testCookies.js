const assert = require('assert');
const Mocks = require('../../../../lib/command-mocks.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('get and delete cookies', function() {
  describe('with backwards compat mode', function() {
    before(function(done) {
      CommandGlobals.beforeEach.call(this, done, {
        backwards_compatibility_mode: true
      });
    });

    after(function(done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('client.getCookies()', function(done) {
      Mocks.cookiesFound();

      const api = this.client.api;
      this.client.api.getCookies(function callback(result) {
        assert.strictEqual(this, api);
        assert.strictEqual(result.value.length, 1);
        assert.strictEqual(result.value[0].name, 'test_cookie');
      });

      this.client.start(done);
    });
  });

  describe('without compat mode', function() {
    before(function(done) {
      CommandGlobals.beforeEach.call(this, done);
    });

    after(function(done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('client.getCookies()', function(done) {
      Mocks.cookiesFound();

      const api = this.client.api;
      this.client.api.getCookies(function callback(result) {
        assert.strictEqual(this, api);
        assert.strictEqual(result.value.length, 1);
        assert.strictEqual(result.value[0].name, 'test_cookie');
      });

      this.client.start(done);
    });

    it('client.getCookies() - empty result', function(done) {
      Mocks.cookiesNotFound();

      this.client.api.getCookies(function callback(result) {
        assert.ok(Array.isArray(result.value));
        assert.strictEqual(result.value.length, 0);
      });

      this.client.start(done);
    });

    it('client.deleteCookies(<name>)', function(done){
      Mocks.deleteCookies();

      this.client.api.deleteCookies(function callback(result) {
        assert.strictEqual(result.value, null);
        assert.strictEqual(result.status, 0);
      });
      this.client.start(done);
    });

    it('client.cookies.getAll()', function(done) {
      Mocks.cookiesFound();

      const api = this.client.api;
      this.client.api.cookies.getAll(function callback(result) {
        assert.strictEqual(this, api);
        assert.strictEqual(result.value.length, 1);
        assert.strictEqual(result.value[0].name, 'test_cookie');
      });

      this.client.start(done);
    });

    it('client.cookies.getAll() - empty result', function(done) {
      Mocks.cookiesNotFound();

      this.client.api.cookies.getAll(function callback(result) {
        assert.ok(Array.isArray(result.value));
        assert.strictEqual(result.value.length, 0);
      });

      this.client.start(done);
    });

    it('client.cookies.deleteAll(<name>)', function(done){
      Mocks.deleteCookies();

      this.client.api.cookies.deleteAll(function callback(result) {
        assert.strictEqual(result.value, null);
        assert.strictEqual(result.status, 0);
      });
      this.client.start(done);
    });
  });
});
