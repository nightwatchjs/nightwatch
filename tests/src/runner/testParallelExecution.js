var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var util = require('util');
var events = require('events');
var mockery = require('mockery');
var path = require('path');

module.exports = {
  setUp: function(callback) {
    this.allArgs = [];
    this.allOpts = [];
    var self = this;

    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
    mockery.registerMock('child_process', {
      spawn : function(path, args, opts) {
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
            this.emit('exit', 0);
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

  testParallelExecution : function(test) {
    var self = this;
    var CliRunner = require('../../../' + BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './extra/nightwatch.json',
      env : 'default,mixed'
    });

    runner.setup({}, function(output, code) {
      test.ok(!runner.isParallelMode());
      test.equals(code, 0);
      test.deepEqual(output, { 'default': [], mixed: [] });
      test.equals(self.allArgs.length, 2);
      test.equals(self.allArgs[0][2], 'default');
      test.equals(self.allArgs[1][2], 'mixed');

      test.ok('default_1' in runner.runningProcesses);
      test.ok('mixed_2' in runner.runningProcesses);
      test.equals(runner.runningProcesses['default_1'].processRunning, false);
      test.equals(runner.runningProcesses['mixed_2'].processRunning, false);
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

    runner.setup({}, function() {
      test.ok(!runner.isParallelMode());
      test.equals(self.allArgs.length, 2);
      test.equals(self.allArgs[0][2], 'mixed');
      test.equals(self.allArgs[1][2], 'mixed');
      test.ok('mixed_1' in runner.runningProcesses);
      test.ok('mixed_2' in runner.runningProcesses);
      test.equals(runner.runningProcesses['mixed_1'].processRunning, false);
      test.equals(runner.runningProcesses['mixed_2'].processRunning, false);
      test.done();
    });

    test.ok(runner.parallelMode);
  },

  testParallelExecutionWithWorkersDefaults : function(test) {
    var self = this;
    var CliRunner = require('../../../' + BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './extra/parallelism.json'
    });

    runner.setup({}, function() {
      test.equals(self.allArgs.length, 21);
      test.ok(path.join('sampletests', 'async', 'sample_1') in runner.runningProcesses);
      test.ok(path.join('sampletests', 'before-after', 'sampleSingleTest_2') in runner.runningProcesses);

      var child = runner.runningProcesses[path.join('sampletests', 'async', 'sample_1')];
      test.deepEqual(child.env_output, []);
      test.ok(child.mainModule.length > 0);
      test.strictEqual(child.index, 0);
      test.equal(child.startDelay, 10);
      test.equal(child.environment, path.join('sampletests', 'async', 'sample'));
      test.deepEqual(child.settings, runner.settings);
      test.strictEqual(child.globalExitCode, 0);
      test.equal(child.args.length, 3);
      test.equal(child.args[0], '--test');
      test.equal(child.args[2], '--test-worker');
      test.done();
    });

    test.ok(runner.settings.test_workers);
    test.ok(runner.parallelModeWorkers());
  },

  testParallelExecutionWithWorkersAuto : function(test) {
    var self = this;
    var CliRunner = require('../../../' + BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './extra/parallelism-auto.json'
    });

    runner.setup({}, function() {
      test.ok(!runner.isParallelMode());
      test.equals(self.allArgs.length, 21);
      test.done();
    });

    test.deepEqual(runner.settings.test_workers, {
      enabled : true,
      workers : 'auto'
    });
    test.deepEqual(runner.test_settings.test_workers, {
      enabled : true,
      workers : 'auto'
    });
    test.ok(runner.parallelModeWorkers());

  },

  testParallelExecutionWithWorkersCount : function(test) {
    var self = this;
    var CliRunner = require('../../../' + BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './extra/parallelism-count.json'
    });

    runner.setup({}, function() {
      test.ok(!runner.isParallelMode());
      test.equals(self.allArgs.length, 21);
      test.done();
    });

    test.deepEqual(runner.settings.test_workers, {
      enabled : true,
      workers : 6
    });
    test.ok(runner.parallelModeWorkers());
  },

  testParallelExecutionWithWorkersDisabledPerEnvironment : function(test) {
    var CliRunner = require('../../../' + BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './extra/parallelism-disabled.json'
    });

    runner.setup();

    test.equals(runner.settings.test_workers, false);
    test.equals(runner.parallelModeWorkers(), false);
    test.done();
  },

  testParallelExecutionWithWorkersDisabledFromGrunt : function(test) {
    var CliRunner = require('../../../' + BASE_PATH + '/../lib/runner/cli/clirunner.js');
    var runner = new CliRunner({
      config : './extra/parallelism.json'
    });

    runner.setup({test_workers : false});

    test.equals(runner.settings.test_workers, false);
    test.equals(runner.parallelModeWorkers(), false);
    test.done();
  }
};
