const assert = require('assert');
const Mocks  = require('../../../../lib/command-mocks.js');
const CommandGlobals = require('../../../../lib/globals/commands.js');

describe('getCookie', function() {
  before(function(done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function(done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('client.getCookie(<name>)', function(done) {
    Mocks.cookiesFound();

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

    this.client.api.setCookie({name: 'other_cookie', value: '123456'}, function callback(result){
      assert.strictEqual(result.status, 0);
    });
    this.client.start(done);
    
  });

});
