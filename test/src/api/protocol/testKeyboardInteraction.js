const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('Keyboard interaction commands', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('test hideKeyboard', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/appium/device/hide_keyboard');
        assert.deepStrictEqual(opts.data, {});
      },
      commandName: 'appium.hideKeyboard',
      args: []
    });
  });

  it('test isKeyboardShown', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.path, '/session/1352110219202/appium/device/is_keyboard_shown');
      },
      commandName: 'appium.isKeyboardShown',
      args: []
    });
  });

  it('test pressKeyCode - with just keycode', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/appium/device/press_keycode');
        assert.deepStrictEqual(opts.data, {
          keycode: 15
        });
      },
      commandName: 'appium.pressKeyCode',
      args: [15]
    });
  });

  it('test pressKeyCode - with all options', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/appium/device/press_keycode');
        assert.deepStrictEqual(opts.data, {
          keycode: 15,
          metastate: 14,
          flags: 13
        });
      },
      commandName: 'appium.pressKeyCode',
      args: [15, 14, 13]
    });
  });

  it('test pressKeyCode - with callback as second arg and then random args', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/appium/device/press_keycode');
        assert.deepStrictEqual(opts.data, {
          keycode: 15
        });
      },
      commandName: 'appium.pressKeyCode',
      args: [15, () => {}, 14]
    });
  });

  it('test pressKeyCode - with no options', function() {
    return Globals.protocolTest({
      commandName: 'appium.pressKeyCode',
      args: []
    }).catch(err => {
      return err;
    }).then((result) => {
      assert.ok(result instanceof Error);
      assert.strictEqual(result.message.includes('The first argument to pressKeyCode is mandatory and must be a number.'), true);
    });
  });

  it('test longPressKeyCode - with just keycode', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/appium/device/long_press_keycode');
        assert.deepStrictEqual(opts.data, {
          keycode: 15
        });
      },
      commandName: 'appium.longPressKeyCode',
      args: [15]
    });
  });

  it('test longPressKeyCode - with 2 options', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/appium/device/long_press_keycode');
        assert.deepStrictEqual(opts.data, {
          keycode: 15,
          metastate: 14
        });
      },
      commandName: 'appium.longPressKeyCode',
      args: [15, 14]
    });
  });

  it('test longPressKeyCode - with callback as second arg and then random args', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.method, 'POST');
        assert.strictEqual(opts.path, '/session/1352110219202/appium/device/long_press_keycode');
        assert.deepStrictEqual(opts.data, {
          keycode: 15
        });
      },
      commandName: 'appium.longPressKeyCode',
      args: [15, () => {}, 14]
    });
  });

  it('test longPressKeyCode - with no options', function() {
    return Globals.protocolTest({
      commandName: 'appium.longPressKeyCode',
      args: []
    }).catch(err => {
      return err;
    }).then((result) => {
      assert.ok(result instanceof Error);
      assert.strictEqual(result.message.includes('The first argument to longPressKeyCode is mandatory and must be a number.'), true);
    });
  });
});
