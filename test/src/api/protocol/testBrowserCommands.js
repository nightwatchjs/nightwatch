const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('browser commands', function () {
  before(function () {
    Globals.protocolBefore();
  });

  it('testRefresh', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/refresh');
      },
      commandName: 'refresh',
      args: []
    });
  });

  it('testBack', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/back');
      },
      commandName: 'back',
      args: []
    });
  });

  it('testForward', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/forward');
      },
      commandName: 'forward',
      args: []
    });
  });
});
