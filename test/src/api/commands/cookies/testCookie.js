const assert = require('assert');
const Mocks  = require('../../../../lib/command-mocks.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('get, set and delete cookie', function() {
  describe('with backwards compat mode', function() {
    before(function(done) {
      CommandGlobals.beforeEach.call(this, done, {
        backwards_compatibility_mode: true
      });
    });

    after(function(done) {
      CommandGlobals.afterEach.call(this, done);
    });

    it('client.getCookie(<name>)', function(done) {
      Mocks.cookiesFound({times: 2});

      const api = this.client.api;
      this.client.api.getCookie('test_cookie', function callback(result) {
        assert.strictEqual(this, api);
        assert.strictEqual(result.name, 'test_cookie');
        assert.strictEqual(result.value, '123456');
      });

      this.client.api.getCookie('other_cookie', function callback(result) {
        assert.strictEqual(result, null);
      });

      this.client.start(done);
    });

    it('client.cookies.get(<name>)', function(done) {
      Mocks.cookieFound();
      Mocks.cookieNotFound();

      const api = this.client.api;
      this.client.api.cookies.get('test_cookie', function callback(result) {
        assert.strictEqual(this, api);
        assert.strictEqual(result.value.name, 'test_cookie');
        assert.strictEqual(result.value.value, '123456');
      });

      this.client.api.cookies.get('other_cookie', function callback(result) {
        assert.strictEqual(result.value, null);
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

    it('client.getCookie(<name>)', function(done) {
      Mocks.cookiesFound({times: 2});

      const api = this.client.api;
      this.client.api.getCookie('test_cookie', function callback(result) {
        assert.strictEqual(this, api);
        assert.strictEqual(result.name, 'test_cookie');
        assert.strictEqual(result.value, '123456');
      });

      this.client.api.getCookie('other_cookie', function callback(result) {
        assert.strictEqual(result, null);
      });

      this.client.start(done);
    });

    it('client.getCookie(<name>) - empty result', function(done) {
      Mocks.cookiesNotFound();

      this.client.api.getCookie('other_cookie', function callback(result) {
        assert.strictEqual(result, null);
      });

      this.client.start(done);
    });

    it('client.deleteCookie(<name>)', function(done){
      Mocks.deleteCookie();

      this.client.api.deleteCookie('other_cookie', function callback(result) {
        assert.strictEqual(result.status, 0);
      });
      this.client.start(done);
    });

    it('client.setCookie(<name>)', function(done) {
      Mocks.addCookie();

      this.client.api.setCookie({name: 'other_cookie', value: '123456'}, function callback(result) {
        assert.strictEqual(result.status, 0);
      });
      this.client.start(done);
    });

    it('client.cookies.get(<name>)', function(done) {
      Mocks.cookieFound();
      Mocks.cookieNotFound();

      const api = this.client.api;
      this.client.api.cookies.get('test_cookie', function callback(result) {
        assert.strictEqual(this, api);
        assert.strictEqual(result.value.name, 'test_cookie');
        assert.strictEqual(result.value.value, '123456');
      });

      this.client.api.cookies.get('other_cookie', function callback(result) {
        assert.strictEqual(result.value, null);
      });

      this.client.start(done);
    });

    it('client.cookies.get() without any argument', function(done) {
      this.client.api.cookies.get();

      this.client.start(function(err) {
        try {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message.includes('First argument passed to .cookies.get() must be a string.'), true);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('client.cookies.delete(<name>)', function(done){
      Mocks.deleteCookie();

      this.client.api.cookies.delete('other_cookie', function callback(result) {
        assert.strictEqual(result.status, 0);
      });
      this.client.start(done);
    });

    it('client.cookies.get() without any argument', function(done) {
      this.client.api.cookies.delete();

      this.client.start(function(err) {
        try {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message.includes('First argument passed to .cookies.delete() must be a string.'), true);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('client.cookies.set(<name>)', function(done) {
      Mocks.addCookie();

      this.client.api.cookies.set({name: 'other_cookie', value: '123456'}, function callback(result) {
        assert.strictEqual(result.status, 0);
      });
      this.client.start(done);
    });

    it('client.cookies.set() without any argument', function(done) {
      this.client.api.cookies.set();

      this.client.start(function(err) {
        try {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message.includes('First argument passed to .cookies.set() must be an object; received: undefined (undefined)'), true);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
