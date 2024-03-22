const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('window commands', function() {
  before(function(done) {
    Globals.protocolBefore({}, done);
  });

  after(function(done) {
    Globals.protocolAfter(done);
  });

  it('test .windowHandle()', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'windowHandle');
      },
      commandName: 'windowHandle',
      args: []
    }).then((result) => {
      assert.strictEqual(result, 'CDwindow-BE13CA812F066254342F4FEB180D14ED');
    });
  });

  it('test .windowHandles()', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'windowHandles');
      },
      commandName: 'windowHandles',
      args: []
    }).then((result) => {
      assert.deepStrictEqual(result, ['CDwindow-BE13CA812F066254342F4FEB180D14ED']);
    });
  });

  it('test .minimizeWindow()', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'minimizeWindow');
      },
      commandName: 'minimizeWindow'
    }).then((result) => {
      assert.strictEqual(result, null);
    });
  });

  it('test .windowMaximize()', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'windowMaximize');
      },
      commandName: 'windowMaximize',
      args: []
    }).then((result) => {
      assert.strictEqual(result, null);
    });
  });

  it('test .openNewWindow()', function() {
    return Globals.protocolTestWebdriver({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'openNewWindow');
      },
      commandName: 'openNewWindow',
      args: []
    }).then((result) => {
      assert.strictEqual(result, null);
    });
  });


  it('test .openNewWindow() with callback', function() {
    return Globals.protocolTestWebdriver({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'openNewWindow');
        assert.strictEqual(opts.type, 'tab');
      },
      commandName: 'openNewWindow',
      args: [function(result) {
        assert.deepStrictEqual(result, {
          value: null,
          status: 0
        });
      }]
    });
  });

  it('test .openNewWindow() W3C WebDriver with specified type=window', function() {
    return Globals.protocolTestWebdriver({
      assertion: function(opts) {
        assert.strictEqual(opts.command, 'openNewWindow');
        assert.strictEqual(opts.type, 'window');
      },
      commandName: 'openNewWindow',
      args: ['window']
    }).then((result) => {
      assert.strictEqual(result, null);
    });
  });

});
