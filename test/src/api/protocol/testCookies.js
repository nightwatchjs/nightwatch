const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('cookie commands', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testCookieGet', function () {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/cookie');
      },
      commandName: 'cookie',
      args: ['GET']
    });
  });

  it('testCookiePost', function () {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/cookie');
        assert.deepEqual(opts.data, {cookie: {name: 'test_cookie'}});
      },
      commandName: 'cookie',
      args: ['POST', {name: 'test_cookie'}]
    });
  });

  it('testCookieDeleteAll', function () {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'DELETE');
        assert.equal(opts.path, '/session/1352110219202/cookie');
      },
      commandName: 'cookie',
      args: ['DELETE']
    });
  });

  it('testCookieDeleteOne', function () {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'DELETE');
        assert.equal(opts.path, '/session/1352110219202/cookie/test_cookie');
      },
      commandName: 'cookie',
      args: ['DELETE', 'test_cookie']
    });
  });

  it('testCookieErrors', function () {
    var protocol = this.protocol;

    assert.throws(
      function () {
        protocol.cookie('POST');
      }); 'POST method without a cookie param throws an error'

    assert.throws(
      function () {
        protocol.window('PUT');
      }); 'PUT method throws an error'
  });

});
