const util = require('util');
const events = require('events');
const mockery = require('mockery');
const path = require('path');
const assert = require('assert');
const common = require('../../../common.js');

describe('test Parallel Execution', function() {
  beforeEach(function() {
    this.allArgs = [];
    this.allOpts = [];
    let self = this;

    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock('child_process', {
      spawn: function(path, args, opts) {
        self.allArgs.push(args);
        self.allOpts.push(opts);

        function Stdout() {
        }

        function Stderr() {
        }

        util.inherits(Stdout, events.EventEmitter);
        util.inherits(Stderr, events.EventEmitter);

        let Child = function() {
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

    mockery.registerMock('os', {
      cpus: function() {
        return [0, 1];
      }
    });
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    process.env.__NIGHTWATCH_PARALLEL_MODE = null;
  });

  it('testParallelExecution', function(done) {
    let self = this;
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/nightwatch.json'),
      env: 'default,mixed'
    });

    runner.setup({}, function(output, code) {
      if (output instanceof Error) {
        done(output);
        return;
      }
      assert.ok(!runner.isParallelMode());
      assert.equal(code, 0);
      assert.deepEqual(output, {'default': [], mixed: []});
      assert.equal(self.allArgs.length, 2);
      assert.equal(self.allArgs[0].indexOf('default') > -1, true);
      assert.equal(self.allArgs[1].indexOf('mixed') > -1, true);

      assert.ok('default_1' in runner.runningProcesses);
      assert.ok('mixed_2' in runner.runningProcesses);
      assert.equal(runner.runningProcesses['default_1'].processRunning, false);
      assert.equal(runner.runningProcesses['mixed_2'].processRunning, false);
      done();
    });

    assert.ok(runner.parallelMode);
  });

  it('testParallelExecutionWithWorkersDefaults', function(done) {
    let self = this;
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism.json')
    });

    runner.setup({}, function(err) {
      if (err instanceof Error) {
        done(err);
        return;
      }
      assert.equal(self.allArgs.length, 22);
      assert.ok(path.join('sampletests', 'async', 'sample_1') in runner.runningProcesses);
      assert.ok(path.join('sampletests', 'before-after', 'sampleSingleTest_2') in runner.runningProcesses);

      let child = runner.runningProcesses[path.join('sampletests', 'async', 'sample_1')];
      assert.deepEqual(child.env_output, []);
      assert.ok(child.mainModule.length > 0);
      assert.strictEqual(child.index, 0);
      assert.equal(child.startDelay, 10);
      assert.equal(child.environment, path.join('sampletests', 'async', 'sample'));
      assert.deepEqual(child.settings, runner.settings);
      assert.strictEqual(child.globalExitCode, 0);
      assert.ok(child.args.length > 0);
      assert.ok(child.args.indexOf('--test') > -1);
      assert.ok(child.args.indexOf('--test-worker') > -1);
      done();
    });

    assert.ok(runner.settings.test_workers);
    assert.ok(runner.parallelModeWorkers());
  });

  it('testParallelExecutionSameEnv', function(done) {
    let self = this;
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/nightwatch.json'),
      env: 'mixed,mixed'
    });

    runner.setup({}, function(err) {
      if (err instanceof Error) {
        done(err);
        return;
      }
      assert.ok(!runner.isParallelMode());
      assert.equal(self.allArgs.length, 2);
      assert.equal(self.allArgs[0].indexOf('mixed') > -1, true);
      assert.equal(self.allArgs[1].indexOf('mixed') > -1, true);
      assert.ok('mixed_1' in runner.runningProcesses);
      assert.ok('mixed_2' in runner.runningProcesses);
      assert.equal(runner.runningProcesses['mixed_1'].processRunning, false);
      assert.equal(runner.runningProcesses['mixed_2'].processRunning, false);
      done();
    });

    assert.ok(runner.parallelMode);
  });

  it('testParallelExecutionWithWorkersAuto', function(done) {
    let self = this;
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism-auto.json')
    });

    runner.setup({}, function() {
      assert.ok(!runner.isParallelMode());
      assert.equal(self.allArgs.length, 22);
      done();
    });

    assert.deepEqual(runner.settings.test_workers, {
      enabled: true,
      workers: 'auto'
    });
    assert.deepEqual(runner.envSettings.test_workers, {
      enabled: true,
      workers: 'auto'
    });
    assert.ok(runner.parallelModeWorkers());
  });

  it('testParallelExecutionWithWorkersCount', function(done) {
    let self = this;
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism-count.json')
    });

    runner.setup({}, function(err) {
      if (err instanceof Error) {
        done(err);
        return;
      }
      assert.ok(!runner.isParallelMode());
      assert.equal(self.allArgs.length, 22);
      done();
    });

    assert.deepEqual(runner.settings.test_workers, {
      enabled: true,
      workers: 6
    });
    assert.ok(runner.parallelModeWorkers());
  });

  it('testParallelExecutionWithWorkersDisabledPerEnvironment', function(done) {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism-disabled.json')
    });

    runner.setup();

    assert.equal(runner.settings.test_workers, false);
    assert.equal(runner.parallelModeWorkers(), false);
  });

  it('testParallelExecutionWithWorkersDisabledFromGrunt', function(done) {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism.json')
    });

    runner.setup({test_workers: false});

    assert.equal(runner.settings.test_workers, false);
    assert.equal(runner.parallelModeWorkers(), false);
  });

  it('testParallelExecutionWithWorkersAndSingleSourceFile', function(done) {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism.json'),
      _source: [path.join(__dirname, '../../../sampletests/async/sample.js')]
    });

    runner.setup();

    assert.equal(runner.singleSourceFile(), true);
  });

  it('testWorkerAndGetTestSource', function(done) {
    const CliRunner = common.require('runner/cli/cli.js');
    CliRunner.prototype.isParallelMode = function() {
      return true;
    };

    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism.json')
    });
    runner.setup();

    runner.argv['test-worker'] = true;
    runner.argv['test'] = path.join(__dirname, '../../../sampletests/async/sample');

    let testsource = runner.getTestSource();
    let filePath = '/sampletests/async/sample.js';
    assert.equal(testsource.slice(filePath.length * -1), filePath);
  });
});
