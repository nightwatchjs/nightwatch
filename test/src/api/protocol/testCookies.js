const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('cookie commands', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testCookieGet', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/cookie');
      },
      commandName: 'cookie',
      args: ['GET']
    });
  });

  it('testCookiePost', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/cookie');
        assert.deepEqual(opts.data, {cookie: {name: 'test_cookie'}});
      },
      commandName: 'cookie',
      args: ['POST', {name: 'test_cookie'}]
    });
  });

  it('testCookieDeleteAll', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'DELETE');
        assert.strictEqual(opts.path, '/session/1352110219202/cookie');
      },
      commandName: 'cookie',
      args: ['DELETE']
    });
  });

  it('testCookieDeleteOne', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'DELETE');
        assert.strictEqual(opts.path, '/session/1352110219202/cookie/test_cookie');
      },
      commandName: 'cookie',
      args: ['DELETE', 'test_cookie']
    });
  });

  it('testCookieErrors', function () {
    return Globals.protocolTest({
      assertion: function(opts) {},
      commandName: 'cookie',
      args: ['POST']
    }).catch(err => {
      return err;
    }).then(result => {
      assert.ok(result instanceof Error);
      assert.strictEqual(result.message, 'Error while running "cookie" command: POST requests to /cookie must include a cookie object parameter also.');
    });
  });

});
