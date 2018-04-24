const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('windowSize', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testWindowSizeErrors', function() {
    var protocol = this.protocol;

    assert.throws(
      function() {
        protocol.windowSize(function() {
        });
      }, 'First argument must be a window handle string.'
    );

    assert.throws(
      function() {
        protocol.windowSize('current', 'a', 10);
      }, 'Width and height arguments must be passed as numbers.'
    );

    assert.throws(
      function() {
        protocol.windowSize('current', 10);
      }, 'Width and height arguments must be passed as numbers.'
    );

    assert.throws(
      function() {
        protocol.windowSize('current', 10, 'a');
      }, 'Width and height arguments must be passed as numbers.'
    );
  });

  it('testWindowSizeGet', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/window/current/size');
      },
      commandName: 'windowSize',
      args: ['current']
    });
  });

  it('testWindowSizePost', function() {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/window/current/size');
        assert.deepEqual(opts.data, {width: 10, height: 10});
      },
      commandName: 'windowSize',
      args: ['current', 10, 10]
    });
  });

});
