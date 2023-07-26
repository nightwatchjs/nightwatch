const assert = require('assert');
const Globals = require('../../../../lib/globals.js');
const utils = require('../../../../lib/utils.js');

describe('test executeScript and executeAsyncScript', function() {
  before(function() {
    Globals.protocolBefore();
  });

  it('test document.executeScript with string', function () {
    let opts;

    return Globals.protocolTest({
      assertion: function (args) {
        opts = args;
      },
      commandName: 'document.executeScript',
      args: ['<script>function(){return test();}</script>', ['arg1', 'arg2']]
    }).then((result) => {
      // result returned by the api command (fakedriver here).
      assert.strictEqual(result, null);

      assert.deepStrictEqual(opts.command, 'executeScript');
      assert.deepStrictEqual(opts.script, '<script>function(){return test();}</script>');
      assert.deepStrictEqual(opts.args, ['arg1', 'arg2']);
    });
  });

  it('test document.execute with function', function() {
    let opts;

    return Globals.protocolTest({
      assertion: function(args) {
        opts = args;
      },
      commandName: 'document.executeScript',
      args: [function () {
        return test();
      }, ['arg1']]
    }).then((result) => {
      assert.strictEqual(opts.command, 'executeScript');
      assert.strictEqual(opts.script, `var passedArgs = Array.prototype.slice.call(arguments,0); return (function () {${utils.getLineBreak()}        return test();${utils.getLineBreak()}      }).apply(window, passedArgs);`);
      assert.deepStrictEqual(opts.args, ['arg1']);

      assert.strictEqual(result, null);
    });
  });

  it('test document.executeScript with no args', function() {
    let opts;

    return Globals.protocolTest({
      assertion: function(args) {
        opts = args;
      },
      commandName: 'document.executeScript',
      args: [function () {
        return test();
      }]
    }).then((result) => {
      assert.strictEqual(opts.command, 'executeScript');
      assert.strictEqual(opts.script, `var passedArgs = Array.prototype.slice.call(arguments,0); return (function () {${utils.getLineBreak()}        return test();${utils.getLineBreak()}      }).apply(window, passedArgs);`);
      assert.deepStrictEqual(opts.args, []);

      assert.strictEqual(result, null);
    });
  });

  it('test document.executeScript with no script', function() {
    return Globals.protocolTest({
      commandName: 'document.executeScript',
      args: []
    }).catch(err => {
      return err;
    }).then((result) => {
      assert.ok(result instanceof Error);
      assert.strictEqual(result.message.includes('First argument passed to .executeScript() must be defined.'), true);
    });
  });

  it('test document.executeAsyncScript with string', function() {
    let opts;

    return Globals.protocolTest({
      assertion: function(args) {
        opts = args;
      },
      commandName: 'document.executeAsyncScript',
      args: [function () {
        return test();
      }, ['arg1', 'arg2']]
    }).then((result) => {
      assert.strictEqual(opts.command, 'executeAsyncScript');
      assert.strictEqual(opts.script, `var passedArgs = Array.prototype.slice.call(arguments,0); return (function () {${utils.getLineBreak()}        return test();${utils.getLineBreak()}      }).apply(window, passedArgs);`);
      assert.deepStrictEqual(opts.args, ['arg1', 'arg2']);

      assert.strictEqual(result, null);
    });
  });

  it('test document.executeAsync with function', function() {
    let opts;

    return Globals.protocolTest({
      assertion: function(args) {
        opts = args;
      },
      commandName: 'document.executeAsync',
      args: ['<script>function(){return test();}</script>', ['arg1']]
    }).then((result) => {
      assert.strictEqual(opts.command, 'executeAsyncScript');
      assert.strictEqual(opts.script, '<script>function(){return test();}</script>');
      assert.deepStrictEqual(opts.args, ['arg1']);

      assert.strictEqual(result, null);
    });
  });

  it('test document.executeAsyncScript with no script', function() {
    return Globals.protocolTest({
      commandName: 'document.executeAsyncScript',
      args: []
    }).catch(err => {
      return err;
    }).then((result) => {
      assert.ok(result instanceof Error);
      assert.strictEqual(result.message.includes('First argument passed to .executeAsyncScript() must be defined.'), true);
    });
  });

  it('testExecuteString', function () {
    let opts;

    return Globals.protocolTest({
      assertion: function (args) {
        opts = args;
      },
      commandName: 'executeScript',
      args: ['<script>function(){return test();}</script>', ['arg1', 'arg2']]
    }).then((result) => {
      // result returned by the api command (fakedriver here).
      assert.strictEqual(result, null);

      assert.deepStrictEqual(opts.command, 'executeScript');
      assert.deepStrictEqual(opts.script, '<script>function(){return test();}</script>');
      assert.deepStrictEqual(opts.args, ['arg1', 'arg2']);
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
      assert.strictEqual(opts.command, 'executeScript');
      assert.strictEqual(opts.script, `var passedArgs = Array.prototype.slice.call(arguments,0); return (function () {${utils.getLineBreak()}        return test();${utils.getLineBreak()}      }).apply(window, passedArgs);`);
      assert.deepStrictEqual(opts.args, ['arg1']);

      assert.strictEqual(result, null);
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
      assert.strictEqual(opts.command, 'executeScript');
      assert.strictEqual(opts.script, `var passedArgs = Array.prototype.slice.call(arguments,0); return (function () {${utils.getLineBreak()}        return test();${utils.getLineBreak()}      }).apply(window, passedArgs);`);
      assert.deepStrictEqual(opts.args, []);

      assert.strictEqual(result, null);
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
      }, ['arg1', 'arg2']]
    }).then((result) => {
      assert.strictEqual(opts.command, 'executeAsyncScript');
      assert.strictEqual(opts.script, `var passedArgs = Array.prototype.slice.call(arguments,0); return (function () {${utils.getLineBreak()}        return test();${utils.getLineBreak()}      }).apply(window, passedArgs);`);
      assert.deepStrictEqual(opts.args, ['arg1', 'arg2']);

      assert.strictEqual(result, null);
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
      assert.strictEqual(opts.command, 'executeAsyncScript');
      assert.strictEqual(opts.script, '<script>function(){return test();}</script>');
      assert.deepStrictEqual(opts.args, ['arg1']);

      assert.strictEqual(result, null);
    });
  });
});
