const util = require('util');
const events = require('events');
const mockery = require('mockery');
const path = require('path');
const assert = require('assert');
const common = require('../../../common.js');

describe('test Parallel Execution', function() {
  const allArgs = [];
  const allOpts = [];

  this.timeout(8000);

  beforeEach(function() {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock('child_process', {
      spawn: function(path, args, opts) {
        allArgs.push(args);
        allOpts.push(opts);

        function Stdout() {}
        function Stderr() {}

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
    allArgs.length = 0;
    allOpts.length = 0;
    process.env.__NIGHTWATCH_PARALLEL_MODE = null;
  });

  it('testParallelExecution', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../../extra/'));

    let runner = new CliRunner({
      config: './nightwatch.json',
      env: 'default,mixed'
    });

    runner.setup();

    assert.ok(runner.parallelMode());
    assert.equal(runner.testEnv, 'default,mixed');
    assert.deepEqual(runner.availableTestEnvs, ['default', 'mixed']);

    return runner.runTests().then(_ => {
      assert.ok(runner.parallelMode());
      assert.strictEqual(runner.concurrency.globalExitCode, 0);
      assert.equal(allArgs.length, 2);
      assert.ok(allArgs[0].join(' ').includes('--env default --parallel-mode'));
      assert.ok(allArgs[1].join(' ').includes('--env mixed --parallel-mode'));

      process.chdir(originalCwd);
    });
  });

  it('test parallel execution with workers defaults', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism.json')
    });

    runner.setup();
    runner.test_settings.globals.retryAssertionTimeout = 10;
    runner.test_settings.globals.waitForConditionTimeout = 10;
    runner.test_settings.globals.waitForConditionPollInterval = 9;
    assert.ok(runner.test_settings.test_workers);

    return runner.runTests().then(_ => {
      assert.strictEqual(allArgs.length, 48);
      assert.strictEqual(runner.concurrency.globalExitCode, 0);
    });
  });

  it('testParallelExecutionSameEnv', function() {
    let originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../../extra/'));

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './nightwatch.json',
      env: 'mixed,mixed'
    });

    runner.setup();

    assert.ok(runner.parallelMode());
    assert.equal(runner.testEnv, 'mixed,mixed');
    assert.deepEqual(runner.availableTestEnvs, ['default', 'mixed']);

    return runner.runTests().then(_ => {
      assert.equal(allArgs.length, 2);
      assert.ok(allArgs[0].join(' ').includes('--env mixed --parallel-mode'));
      assert.ok(allArgs[1].join(' ').includes('--env mixed --parallel-mode'));
      process.chdir(originalCwd);
    });
  });

  it('testParallelExecutionWithWorkersAuto', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism-auto.json')
    });

    runner.setup();
    assert.deepEqual(runner.test_settings.test_workers, {
      enabled: true,
      workers: 'auto'
    });

    return runner.runTests().then(_ => {
      assert.strictEqual(allArgs.length, 48);
    });
  });

  it('testParallelExecutionWithWorkers and multiple environments', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism-auto.json'),
      env: 'default,default'
    });

    runner.setup();
    assert.strictEqual(runner.settings.test_workers.enabled, false);
    assert.ok(!runner.settings.testWorkersEnabled);
  });

  it('test parallel execution with workers count', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism-count.json')
    });

    runner.setup();
    assert.deepEqual(runner.test_settings.test_workers, {
      enabled: true,
      workers: 6
    });

    return runner.runTests().then(_ => {
      assert.strictEqual(allArgs.length, 48);
    });
  });

  it('test parallel execution with workers disabled per environment', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism-disabled.json')
    });

    runner.setup();

    assert.equal(runner.test_settings.test_workers, false);
  });

  it('test parallel execution with workers and single source file', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism.json'),
      _source: [path.join(__dirname, '../../../sampletests/async/test/sample.js')]
    });

    runner.setup();

    assert.strictEqual(runner.isConcurrencyEnabled([runner.argv._source]), false);

  });

  it('test parallel execution to ensure preservation of all process.execArgv', function() {
    const argv = process.execArgv;
    process.execArgv = ['--inspect'];

    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism-execArgv.json'),
    });

    runner.setup();
    const worker = runner.concurrency.createChildProcess('test-worker');
    const args = worker.getArgs();

    process.execArgv = argv;
    assert.ok(args.includes('--inspect'));
    assert.ok(args.includes('--parallel-mode'));
  });

  it('test parallel execution with specified node options to be passed to child processes', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      config: path.join(__dirname, '../../../extra/parallelism-execArgv-selected.json'),
    });

    runner.setup();
    const worker = runner.concurrency.createChildProcess('test-worker');
    const args = worker.getArgs();

    assert.strictEqual(args.includes('--inspect'), false);
    assert.ok(args.includes('--parallel-mode'));
    assert.ok(args.includes('--harmony'));
  });
});
