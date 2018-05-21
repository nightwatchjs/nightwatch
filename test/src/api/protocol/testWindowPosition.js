const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('windowPosition', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testWindowPositionGet without offsets and callback', function() {
    assert.throws(() => {
      Globals.protocolTest.call(this, {
        assertion: function(opts) {
          assert.equal(opts.method, 'GET');
          assert.equal(opts.path, '/session/1352110219202/window/current/position');
        },
        commandName: 'windowPosition',
        args: ['current']
      });
    }, /Second argument passed to \.windowPosition\(\) should be a callback when not passing offsetX and offsetY - undefined given/);
  });

  it('testWindowPositionGet', function(done) {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/window/current/position');
      },
      commandName: 'windowPosition',
      args: ['current', function() {
        done();
      }]
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
    let protocol = this.protocol;

    assert.throws(
      function() {
        protocol.windowPosition(function() {
        });
      }, /First argument must be a window handle string/
    );

    assert.throws(
      function() {
        protocol.windowPosition('current', 'a', 10);
      }, /offsetX argument passed to \.windowPosition\(\) must be a number/
    );

    assert.throws(
      function() {
        protocol.windowPosition('current', 10, 'a');
      }, /offsetY argument passed to \.windowPosition\(\) must be a number/
    );
  });

});
