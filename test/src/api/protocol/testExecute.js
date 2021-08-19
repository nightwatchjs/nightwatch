const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.execute', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testExecuteString', function () {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.deepStrictEqual(opts.command, 'execute');
        assert.deepStrictEqual(opts.script, '<script>function(){return test();}</script>');
        assert.deepStrictEqual(opts.args, ['arg1']);
      },
      commandName: 'execute',
      args: ['<script>function(){return test();}</script>', ['arg1']]
    }).then((result) => {
      assert.strictEqual(typeof result.error, 'undefined');
      assert.deepStrictEqual(result.value, ['arg1']);
    });
  });

  it('testExecuteFunction', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.deepStrictEqual(opts.command, 'execute');
        assert.deepStrictEqual(opts.args, ['arg1']);
        assert.deepStrictEqual(opts.script, 'var passedArgs = Array.prototype.slice.call(arguments,0); return (function () {\n        return test();\n      }).apply(window, passedArgs);');
      },
      commandName: 'execute',
      args: [function () {
        return test();
      }, ['arg1']]
    }).then((result) => {
      assert.strictEqual(typeof result.error, 'undefined');
      assert.deepStrictEqual(result.value, ['arg1']);
    });
  });

  it('testExecuteFunctionNoArgs', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.deepStrictEqual(opts.command, 'execute');
        assert.deepStrictEqual(opts.args.length, 0);
        assert.deepStrictEqual(opts.script, 'var passedArgs = Array.prototype.slice.call(arguments,0); return (function () {\n        return test();\n      }).apply(window, passedArgs);');
      },
      commandName: 'execute',
      args: [function () {
        return test();
      }]
    }).then((result) => {
      assert.strictEqual(typeof result.error, 'undefined');
      assert.deepStrictEqual(result.value, []);
    });
  });

  it('testExecuteAsyncFunction', function() {
    return Globals.protocolTest({
      assertion: function(opts) {
        assert.deepStrictEqual(opts.command, 'executeAsync');
        assert.deepStrictEqual(opts.args, ['arg1']);
        assert.deepStrictEqual(opts.script, 'var passedArgs = Array.prototype.slice.call(arguments,0); return (function () {\n        return test();\n      }).apply(window, passedArgs);');
      },
      commandName: 'executeAsync',
      args: [function () {
        return test();
      }, ['arg1']]
    }).then((result) => {
      assert.strictEqual(typeof result.error, 'undefined');
      assert.deepStrictEqual(result.value, ['arg1']);
    });
  });

  it('testExecuteAsyncString', function() {
    return Globals.protocolTest({
      assertion: function (opts) {
        assert.deepStrictEqual(opts.command, 'executeAsync');
        assert.deepStrictEqual(opts.script, '<script>function(){return test();}</script>');
        assert.deepStrictEqual(opts.args, ['arg1']);
      },
      commandName: 'executeAsync',
      args: ['<script>function(){return test();}</script>', ['arg1']]
    }).then((result) => {
      assert.strictEqual(typeof result.error, 'undefined');
      assert.deepStrictEqual(result.value, ['arg1']);
    });
  });
});
