const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('windowPosition', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testWindowPositionGet', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/window/current/position');
      },
      commandName: 'windowPosition',
      args: ['current']
    });
  });

  it('testWindowPositionPost', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/window/current/position');
      },
      commandName: 'windowPosition',
      args: ['current', 10, 10]
    });
  });

  it('testWindowPositionErrors', function() {
    var protocol = this.protocol;

    assert.throws(
      function() {
        protocol.windowPosition(function() {
        });
      }, 'First argument must be a window handle string.'
    );

    assert.throws(
      function() {
        protocol.windowPosition('current', 'a', 10);
      }, 'Offset arguments must be passed as numbers.'
    );

    assert.throws(
      function() {
        protocol.windowPosition('current', 10);
      }, 'Offset arguments must be passed as numbers.'
    );

    assert.throws(
      function() {
        protocol.windowPosition('current', 10, 'a');
      }, 'Offset arguments must be passed as numbers.'
    );
  });

});
