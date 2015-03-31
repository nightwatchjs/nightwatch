var BASE_PATH = process.env.NIGHTWATCH_COV
  ? 'lib-cov'
  : 'lib';
var util = require('util');
var events = require('events');
var mockery = require('mockery');

module.exports = {
  setUp: function(callback) {
    var self = this;
    this.allArgs = [];
    this.allOpts = [];
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
            this.emit('exit');
            this.emit('close');
          }.bind(this), 11);
        };

        util.inherits(Child, events.EventEmitter);
        return new Child();
      }
    });
    mockery.registerMock('../lib/runner/run.js', {
      run : function(source, settings, opts, callback) {}
    });

    callback();
  },

  tearDown: function(callback) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    callback();
  },

  testParallelExecution : function(test) {
    var self = this;
    var CliRunner = require('../../../' + BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './extra/nightwatch.json',
      env : 'default,mixed'
    });

    runner.init(function(output, code) {
      test.ok(runner.isParallelMode());
      test.equals(code, 0);
      test.deepEqual(output, {});
      test.equals(self.allArgs.length, 2);
      test.equals(self.allArgs[0][2], 'default');
      test.equals(self.allArgs[1][2], 'mixed');

      test.ok('default_1' in runner.runningProcesses);
      test.ok('mixed_2' in runner.runningProcesses);
      test.equals(runner.runningProcesses['default_1'], false);
      test.equals(runner.runningProcesses['mixed_2'], false);
      test.done();
    });

    test.ok(runner.parallelMode);
  },

  testParallelExecutionSameEnv : function(test) {
    var self = this;
    var CliRunner = require('../../../' + BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './extra/nightwatch.json',
      env : 'mixed,mixed'
    });

    runner.init(function() {
      test.ok(runner.isParallelMode());
      test.equals(self.allArgs.length, 2);
      test.equals(self.allArgs[0][2], 'mixed');
      test.equals(self.allArgs[1][2], 'mixed');
      test.ok('mixed_1' in runner.runningProcesses);
      test.ok('mixed_2' in runner.runningProcesses);
      test.equals(runner.runningProcesses['mixed_1'], false);
      test.equals(runner.runningProcesses['mixed_2'], false);
      test.done();
    });

    test.ok(runner.parallelMode);
  }
};
