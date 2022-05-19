const assert = require('assert');
const Globals = require('../../../lib/globals.js');
const {By} = require('selenium-webdriver');

describe('client.frame', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testFrameDefault', function () {
    return Globals.protocolTest({
      assertion: function(frameId) {
        assert.strictEqual(frameId, null);
      },
      commandName: 'frame', 
      args: []
    });
  });

  it('testFramePost', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        if(opts.locator instanceof By){
          assert.strictEqual(opts.locator.value, '#testFrame, *[name="testFrame"]');
        }
      },
      commandName: 'frame',
      args: ['testFrame']
    });
  });

  it('testFramePostWithZeroIndex', function () {
    return Globals.protocolTest({
      assertion: function(frameId) {
        assert.strictEqual(frameId, 0);
      },
      commandName: 'frame',
      args: [0]
    });
  });

  it('testFramePostWithNull', function () {
    return Globals.protocolTest({
      assertion: function(frameId) {
        assert.strictEqual(frameId, null);
      },
      commandName: 'frame',
      args: [null]
    });
  });

  it('testFramePostWithUndefined', function () {
    return Globals.protocolTest({
      assertion: function(frameId) {
        assert.strictEqual(frameId, null);
      },
      commandName: 'frame',
      args: []
    });
  });

  it('testFrameParent', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts, null);
      },
      commandName: 'frameParent',
      args: []
    });
  });
});
