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

  it('testFramePost', async function () {
    let assertionCalls = 0;
    let commandArgs = {};

    await Globals.protocolTest({
      assertion: function(opts) {
        assertionCalls += 1;
        commandArgs[opts.command] = opts;
      },
      commandName: 'frame',
      args: ['testFrame']
    });

    assert.strictEqual(assertionCalls, 2);
    assert.ok(commandArgs['findElement'].locator instanceof By);
    assert.strictEqual(commandArgs['findElement'].locator.value, '#testFrame, *[name="testFrame"]');
    assert.strictEqual(commandArgs['frame'].command, 'frame');
  });

  it('testFramePostWithZeroIndex', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.frameId, 0);
      },
      commandName: 'frame',
      args: [0]
    });
  });

  it('testFramePostWithNull', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.frameId, null);
      },
      commandName: 'frame',
      args: [null]
    });
  });

  it('testFramePostWithUndefined', function () {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.frameId, null);
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
