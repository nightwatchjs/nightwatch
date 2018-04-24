const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('windowSize', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testWindowSizeErrors', function() {
    const protocol = this.protocol;

    assert.throws(
      function() {
        protocol.windowSize(function() {});
      }, /First argument must be a window handle string/
    );

    assert.throws(
      function() {
        protocol.windowSize('current', 'a', 10);
      }, /Width argument passed to \.windowSize\(\) must be a number/
    );

    assert.throws(
      function() {
        protocol.windowSize('current', 10, 'a');
      }, /Height argument passed to \.windowSize\(\) must be a number/
    );

    assert.throws(
      function() {
        protocol.windowSize('current', 10);
      }, /Second argument passed to \.windowSize\(\) should be a callback when not passing width and height/
    );
  });

  it('testWindowSizeGet', function(done) {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/window/current/size');
      },
      commandName: 'windowSize',
      args: ['current', function() {
        done();
      }]
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
