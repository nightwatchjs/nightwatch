const assert = require('assert');
const Globals = require('../../../lib/globals.js');

describe('client.execute', function() {
  before(function() {
    Globals.protocolBefore.call(this);
  });

  it('testExecuteString', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/execute');
        assert.deepEqual(opts.data, {script: '<script>test();</script>', args: ['arg1']});
      },
      commandName: 'execute',
      args: ['<script>test();</script>', ['arg1']]
    });
  });

  it('testExecuteString W3C WebDriver', function() {
    return Globals.protocolTestWebdriver.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/execute/sync');
      },
      commandName: 'execute',
      args: ['<script>test();</script>', ['arg1']]
    });
  });

  it('testExecuteFunction', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.deepEqual(opts.data, {
          args: ['arg1'],
          script: 'var passedArgs = Array.prototype.slice.call(arguments,0); return function () {\n        return test();\n      }.apply(window, passedArgs);'
        });
      },
      commandName: 'execute',
      args: [function () {
        return test();
      }, ['arg1']]
    });
  });

  it('testExecuteFunctionNoArgs', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.deepEqual(opts.data, {
          args: [],
          script: 'var passedArgs = Array.prototype.slice.call(arguments,0); return function () {\n        return test();\n      }.apply(window, passedArgs);'
        });
      },
      commandName: 'execute',
      args: [function () {
        return test();
      }]
    });
  });

  it('testExecuteAsyncFunction', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.deepEqual(opts.data, {
          args: ['arg1'],
          script: 'var passedArgs = Array.prototype.slice.call(arguments,0); return function () {\n        return test();\n      }.apply(window, passedArgs);'
        });
      },
      commandName: 'executeAsync',
      args: [function () {
        return test();
      }, ['arg1']]
    });
  });

  it('testExecuteAsync', function() {
    return Globals.protocolTest.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/execute_async');
        assert.deepEqual(opts.data, {
          args: ['arg1'],
          script: '<script>test();</script>'
        });
      },
      commandName: 'executeAsync',
      args: ['<script>test();</script>', ['arg1']]
    });
  });

  it('testExecuteAsync W3C WebDriver', function() {
    return Globals.protocolTestWebdriver.call(this, {
      assertion: function(opts) {
        assert.equal(opts.method, 'POST');
        assert.equal(opts.path, '/session/1352110219202/execute/async');
      },
      commandName: 'executeAsync',
      args: ['<script>test();</script>', ['arg1']]
    });
  });
});
