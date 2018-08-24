const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('windowPosition', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testWindowPositionGet without offsets and callback', function(done) {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/window/current/position');
      },
      commandName: 'windowPosition',
      args: ['current']
    }).catch(err => {
      assert.equal(err.message, 'Second argument passed to .windowPosition() should be a callback when not passing offsetX and offsetY - undefined given.');
      done();
    }).catch(err => done(err));
  });

  it('testWindowPositionErrors', function() {
    assert.throws(function() {
      Globals.runApiCommand.call(this, null, 'windowPosition', [function() {}]);
    }.bind(this), /First argument must be a window handle string/);

    assert.throws(
      function() {
        Globals.runApiCommand.call(this, null, 'windowPosition', ['current', 'a', 10]);
      }.bind(this), /offsetX argument passed to \.windowPosition\(\) must be a number/
    );

    assert.throws(
      function() {
        Globals.runApiCommand.call(this, null, 'windowPosition', ['current', 10, 'a']);
      }.bind(this), /offsetY argument passed to \.windowPosition\(\) must be a number/
    );
  });

  it('testWindowPositionGet', function(done) {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/window/current/position');
      },
      commandName: 'windowPosition',
      args: ['current', function() {}]
    }).then(_ => done()).catch(err => done(err));
  });

  it('testWindowPositionPost', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/window/current/position');
      },
      commandName: 'windowPosition',
      args: ['current', 10, 10]
    });
  });

});
