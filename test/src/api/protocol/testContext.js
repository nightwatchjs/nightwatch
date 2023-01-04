const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('context commands', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testContexts', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.path, '/session/1352110219202/contexts');
      },
      commandName: 'contexts',
      args: []
    });
  });

  it('testCurrentContext', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.path, '/session/1352110219202/context');
      },
      commandName: 'currentContext',
      args: []
    });
  });

  it('testSetContext', function() {
    let text = 'NATIVE';

    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/context');
        assert.deepStrictEqual(opts.data, {name: text});
      },
      commandName: 'setContext',
      args: [text]
    });
  });

  it('testGetContexts - appium', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.path, '/session/1352110219202/contexts');
      },
      commandName: 'appium.getContexts',
      args: []
    });
  });

  it('testGetContext - appium', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.path, '/session/1352110219202/context');
      },
      commandName: 'appium.getContext',
      args: []
    });
  });

  it('testSetContext - appium', function() {
    let text = 'NATIVE';

    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/context');
        assert.deepStrictEqual(opts.data, {name: text});
      },
      commandName: 'appium.setContext',
      args: [text]
    });
  });
});
