const assert = require('assert');
const Globals = require('../../../lib/globals.js');
const utils = require('../../../lib/utils.js');

describe('client.executeScript', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('testExecuteString', function () {
    let opts;

    return Globals.protocolTest({
      assertion: function (args) {
        opts = args;
      },
      commandName: 'executeScript',
      args: ['<script>function(){return test();}</script>', ['arg1']]
    }).then((result) => {
      assert.deepStrictEqual(opts.command, 'executeScript');
      assert.deepStrictEqual(opts.script, '<script>function(){return test();}</script>');
      assert.strictEqual(opts.args, 'arg1');
      assert.strictEqual(result, 'arg1');
    });
  });

  it('testExecuteFunction', function() {
    let opts;

    return Globals.protocolTest({
      assertion: function(args) {
        opts = args;
      },
      commandName: 'executeScript',
      args: [function () {
        return test();
      }, ['arg1']]
    }).then((result) => {
      assert.deepStrictEqual(opts.command, 'executeScript');
      assert.strictEqual(opts.args, 'arg1');
      assert.deepStrictEqual(opts.script, `var passedArgs = Array.prototype.slice.call(arguments,0); return (function () {${utils.getLineBreak()}        return test();${utils.getLineBreak()}      }).apply(window, passedArgs);`);
      assert.strictEqual(result, 'arg1');
    });
  });

  it('testExecuteFunctionNoArgs', function() {
    let opts;

    return Globals.protocolTest({
      assertion: function(args) {
        opts = args;
      },
      commandName: 'executeScript',
      args: [function () {
        return test();
      }]
    }).then((result) => {
      assert.deepStrictEqual(opts.command, 'executeScript');
      assert.strictEqual(opts.args, undefined);
      assert.deepStrictEqual(opts.script, `var passedArgs = Array.prototype.slice.call(arguments,0); return (function () {${utils.getLineBreak()}        return test();${utils.getLineBreak()}      }).apply(window, passedArgs);`);
      assert.deepStrictEqual(result, {value: undefined, status: 0});
    });
  });

  it('testExecuteAsyncFunction', function() {
    let opts;

    return Globals.protocolTest({
      assertion: function(args) {
        opts = args;
      },
      commandName: 'executeAsyncScript',
      args: [function () {
        return test();
      }, ['arg1']]
    }).then((result) => {
      assert.deepStrictEqual(opts.command, 'executeAsyncScript');
      assert.strictEqual(opts.args, 'arg1');
      assert.deepStrictEqual(opts.script, `var passedArgs = Array.prototype.slice.call(arguments,0); return (function () {${utils.getLineBreak()}        return test();${utils.getLineBreak()}      }).apply(window, passedArgs);`);
      assert.strictEqual(result, 'arg1');
    });
  });

  it('testExecuteAsyncString', function() {
    let opts;

    return Globals.protocolTest({
      assertion: function(args) {
        opts = args;
      },
      commandName: 'executeAsyncScript',
      args: ['<script>function(){return test();}</script>', ['arg1']]
    }).then((result) => {
      assert.deepStrictEqual(opts.command, 'executeAsyncScript');
      assert.deepStrictEqual(opts.script, '<script>function(){return test();}</script>');
      assert.strictEqual(opts.args, 'arg1');
      assert.strictEqual(result, 'arg1');
    });
  });
});
