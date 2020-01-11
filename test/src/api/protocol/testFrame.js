const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.frame', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testFrameDefault', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/frame');
      },
      commandName: 'frame',
      args: []
    });
  });

  it('testFramePost', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/frame');
        assert.deepEqual(opts.data, { id: 'testFrame' });
      },
      commandName: 'frame',
      args: ['testFrame']
    });
  });

  it('testFramePostWithZeroIndex', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/frame');
        assert.deepEqual(opts.data, { id: 0 });
      },
      commandName: 'frame',
      args: [0]
    });
  });

  it('testFramePostWithNull', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/frame');
        assert.deepEqual(opts.data, { id: null });
      },
      commandName: 'frame',
      args: [null]
    });
  });

  it('testFramePostWithUndefined', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/frame');
        assert.deepEqual(opts.data, { id: null });
      },
      commandName: 'frame',
      args: []
    });
  });

  it('testFrameParent', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/frame/parent');
      },
      commandName: 'frameParent',
      args: []
    });
  });
});
