var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var util = require('util');
var events = require('events');
var mockery = require('mockery');

module.exports = {
  setUp: function(callback) {
    this.allArgs = [];
    this.allOpts = [];
    var self = this;

    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
    mockery.registerMock('child_process', {
      execFile : function(path, args, opts) {
        self.allArgs.push(args);
        self.allOpts.push(opts);

        function Stdout() {}
        function Stderr() {}

        util.inherits(Stdout, events.EventEmitter);
        util.inherits(Stderr, events.EventEmitter);

        var Child = function() {
          this.stdout = new Stdout();
          this.stderr = new Stderr();
          setTimeout(function() {
            this.emit('close');
            this.emit('exit', 1);
          }.bind(this), 11);
        };

        util.inherits(Child, events.EventEmitter);
        return new Child();
      }
    });

    mockery.registerMock('../lib/runner/run.js', {
      run : function(source, settings, opts, callback) {}
    });
    mockery.registerMock('os', {
      cpus : function() {
        return [0, 1];
      }
    });

    callback();
  },

  tearDown: function(callback) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    process.env.__NIGHTWATCH_PARALLEL_MODE = null;
    callback();
  },

  testParallelExecutionWithCodeNonZero : function(test) {
    var CliRunner = require('../../../' + BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './extra/parallelism-count.json'
    });

    test.expect(2);

    var originalExit = process.exit;
    process.exit = function(code) {
      test.equals(code, 1);
      test.done();
      process.exit = originalExit;
    };

    runner.setup({}, function(output, code) {
      test.equals(code, 1);
    });
  }
};
