const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('window commands', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testWindowHandle', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/window_handle');
      },
      commandName: 'windowHandle',
      args: []
    });
  });

  it('testWindowHandlePlural', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/window_handles');
      },
      commandName: 'windowHandles',
      args: []
    });
  });

  it('testCloseWindow', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'DELETE');
        assert.equal(opts.path, '/session/1352110219202/window');
      },
      commandName: 'window',
      args: ['DELETE']
    });
  });

  it('testSwitchWindow', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/window');
        assert.deepEqual(opts.data, {name: 'other-window'});
      },
      commandName: 'window',
      args: ['POST', 'other-window']
    });
  });

  it('testWindowCommand', function() {
    let protocol = this.protocol;

    assert.throws(
      function() {
        protocol.window('POST');
      }, 'POST method without a name param throws an error'
    );

    assert.throws(
      function() {
        protocol.window('GET');
      }, 'GET method throws an error'
    );

  });

});
