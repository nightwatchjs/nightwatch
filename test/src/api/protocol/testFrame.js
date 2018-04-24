const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.frame', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testFrameDefault', function () {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/frame');
      },
      commandName: 'frame',
      args: []
    });
  });

  it('testFramePost', function () {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/frame');
        assert.deepEqual(opts.data, { id: 'testFrame' });
      },
      commandName: 'frame',
      args: ['testFrame']
    });
  });

  it('testFrameParent', function () {
    Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/frame/parent');
      },
      commandName: 'frameParent',
      args: []
    });
  });
});
