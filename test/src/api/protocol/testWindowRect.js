const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('windowRect', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('test .windowRect() validation errors', async function() {
    try {
      await Globals.protocolTest({
        commandName: 'windowRect',
        args: [{width: 'a', height: 10}]
      });

      throw new Error('Unexpected error');
    } catch (err) {
      assert.strictEqual(err.message, 'Error while running "windowRect" command: Width argument passed to .windowRect() must be a number; received: string (a).');
    }

    try {
      await Globals.protocolTest({
        commandName: 'windowRect',
        args: [{width: 10, height: 'a'}]
      });

      throw new Error('Unexpected error');
    } catch (err) {
      assert.strictEqual(err.message, 'Error while running "windowRect" command: Height argument passed to .windowRect() must be a number; received: string (a).');
    }

    try {
      await Globals.protocolTest({
        commandName: 'windowRect',
        args: [{width: 10}]
      });

      throw new Error('Unexpected error');
    } catch (err) {
      assert.strictEqual(err.message, 'Error while running "windowRect" command: Attributes "width" and "height" must be specified together.');
    }

    try {
      await Globals.protocolTest({
        commandName: 'windowRect',
        args: [{x: 'a', y: 10}]
      });

      throw new Error('Unexpected error');
    } catch (err) {
      assert.strictEqual(err.message, 'Error while running "windowRect" command: X position argument passed to .windowRect() must be a number; received: string (a).');
    }

    try {
      await Globals.protocolTest({
        commandName: 'windowRect',
        args: [{x: 10, y: 'a'}]
      });

      throw new Error('Unexpected error');
    } catch (err) {
      assert.strictEqual(err.message, 'Error while running "windowRect" command: Y position argument passed to .windowRect() must be a number; received: string (a).');
    }

    try {
      await Globals.protocolTest({
        commandName: 'windowRect',
        args: [{x: 10}]
      });

      throw new Error('Unexpected error');
    } catch (err) {
      assert.strictEqual(err.message, 'Error while running "windowRect" command: Attributes "x" and "y" must be specified together.');
    }
  });

  it('test .windowRect() GET', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'GET');
        assert.strictEqual(opts.path, '/session/1352110219202/window/rect');
      },
      commandName: 'windowRect',
      args: [null, function() {}]
    });
  });

  it('test .windowRect() POST', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/window/rect');
        assert.deepStrictEqual(opts.data, {width: 10, height: 10, x: 10, y: 10});
      },
      commandName: 'windowRect',
      args: [{width: 10, height: 10, x: 10, y: 10}]
    });
  });

});
