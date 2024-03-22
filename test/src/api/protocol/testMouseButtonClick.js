const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.mouseButtonClick', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('test mouseButtonClick click left', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/click');
        assert.deepStrictEqual(opts.data, {button: 0});
      },
      commandName: 'mouseButtonClick',
      args: ['left']
    });
  });

  it('test mouseButtonClick click right', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.deepStrictEqual(opts.data, {button: 2});
      },
      commandName: 'mouseButtonClick',
      args: ['right']
    });
  });

  it('test mouseButtonClick click middle', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.deepStrictEqual(opts.data, {button: 1});
      },
      commandName: 'mouseButtonClick',
      args: ['middle']
    });
  });

  it('test mouseButtonClick with callback only', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.deepStrictEqual(opts.data, {button: 0});
      },
      commandName: 'mouseButtonClick',
      args: [function() {}]
    });
  });

  it('test mouseButtonClick with no args', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.deepStrictEqual(opts.data, {button: 0});
      },
      commandName: 'mouseButtonClick',
      args: []
    });
  });

  it('test mouseButtonDown click left', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/buttondown');
        assert.deepStrictEqual(opts.data, {button: 0});
      },
      commandName: 'mouseButtonDown',
      args: ['left']
    });
  });

  it('test mouseButtonDown click middle', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.deepStrictEqual(opts.data, {button: 1});
      },
      commandName: 'mouseButtonDown',
      args: ['middle']
    });
  });

  it('test mouseButtonDown with callback only', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.deepStrictEqual(opts.data, {button: 0});
      },
      commandName: 'mouseButtonDown',
      args: [function() {

      }]
    });
  });

  it('test mouseButtonUp click right', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/buttonup');
        assert.deepStrictEqual(opts.data, {button: 2});
      },
      commandName: 'mouseButtonUp',
      args: ['right']
    });
  });
});
