const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('browser commands', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testRefresh', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/refresh');
      },
      commandName: 'refresh',
      args: []
    });
  });

  it('testBack', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/back');
      },
      commandName: 'back',
      args: []
    });
  });

  it('testForward', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/forward');
      },
      commandName: 'forward',
      args: []
    });
  });

});
