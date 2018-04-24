const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('orientation commands', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testGetOrientation', function () {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'GET');
        assert.equal(opts.path, '/session/1352110219202/orientation');
      },
      commandName: 'getOrientation',
      args: []
    });
  });

  it('testSetOrientation', function () {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/orientation');
        assert.deepEqual(opts.data, '/session/1352110219202/orientation');
      },
      commandName: 'setOrientation',
      args: ['LANDSCAPE']
    });
  });

  it('testSetOrientationInvalid', function () {
    var protocol = this.protocol;

    assert.throws(function() {
      protocol.setOrientation('TEST');
    });
  });
});
