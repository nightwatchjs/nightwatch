const EventEmitter = require('events');
const mockery = require('mockery');
const path = require('path');
const assert = require('assert');
const common = require('../../common.js');
const Nightwatch = require('../../lib/nightwatch.js');

describe('test Parallel Execution', function() {
  const workerPoolArgv = [];
  const taskArgv= [];
  const allArgs = [];
  const allOpts = [];

  this.timeout(10000);

  beforeEach(function() {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});

    mockery.registerMock('package.json', {});
    mockery.registerMock('child_process', {
      spawn: function(path, args, opts) {
        allArgs.push(args);
        allOpts.push(opts);

        class Stdout extends EventEmitter {}
        class Stderr extends EventEmitter {}

        class ChildProcess extends EventEmitter {
          constructor() {
            super();

            this.stdout = new Stdout();
            this.stderr = new Stderr();

            setTimeout(function() {
              this.emit('close');
              this.emit('exit', 0);
            }.bind(this), 11);
          }
        }

        return new ChildProcess();
      }
    });
    mockery.registerMock('./worker-process.js', class WorkerProcess extends EventEmitter {
      constructor(args, settings, maxWorkerCount) {
        super();

        this.tasks = [];
        this.index = 0;

        workerPoolArgv.push(args);
      }

      addTask({argv}) {
        
        taskArgv.push(argv);
        this.tasks.push(Promise.resolve());
        Promise.resolve();
      }
    });

    const {platform, constants, homedir, release, type, tmpdir} = require('os');
    mockery.registerMock('os', {
      cpus: function() {
        return [0, 1];
      },
      platform,
      constants,
      homedir,
      release,
      type,
      tmpdir
    });
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
    allArgs.length = 0;
    workerPoolArgv.length = 0;
    taskArgv.length = 0;
    allOpts.length = 0;
    process.env.__NIGHTWATCH_PARALLEL_MODE = null;
  });


  it('testParallelExecution - child-process', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../extra/'));
    let runner = new CliRunner({
      config: './nightwatch.json',
      env: 'default,mixed',
      reporter: 'junit'
    });
    runner.setup({
      use_child_process: true
    });
    assert.ok(runner.parallelMode());
    assert.strictEqual(runner.testEnv, 'default,mixed');
    assert.deepStrictEqual(runner.availableTestEnvs, ['default', 'mixed']);

    return runner.runTests().then(_ => {
      assert.ok(runner.parallelMode());
      assert.strictEqual(runner.concurrency.globalExitCode, 0);
      assert.strictEqual(allArgs.length, 2);
      assert.ok(allArgs[0].join(' ').includes('--env default --parallel-mode'));
      assert.ok(allArgs[1].join(' ').includes('--env mixed --parallel-mode'));

      process.chdir(originalCwd);
    });
  });

  it('testParallelExecution -- worker', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../extra/'));

    const runner = new CliRunner({
      config: './nightwatch.json',
      env: 'default,mixed',
      reporter: 'junit'
    });

    runner.setup({
      use_child_process: false
    });

    assert.ok(runner.parallelMode());
    assert.strictEqual(runner.testEnv, 'default,mixed');
    assert.deepStrictEqual(runner.availableTestEnvs, ['default', 'mixed']);

    return runner.runTests().then(_ => {
      assert.ok(runner.parallelMode());
      assert.strictEqual(runner.concurrency.globalExitCode, 0);
      assert.strictEqual(workerPoolArgv.length, 1);
      assert.ok(workerPoolArgv[0].join(' ').includes('--parallel-mode'));
      assert.strictEqual(taskArgv.length, 2);
      assert.strictEqual(taskArgv[0].env, 'default');
      assert.strictEqual(taskArgv[1].env, 'mixed');
      process.chdir(originalCwd);
    });
  });


  it('test parallel execution with workers defaults -- child process', function(){
    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism.json')
    });
    runner.setup({
      use_child_process: true
    });
    runner.test_settings.globals.retryAssertionTimeout = 10;
    runner.test_settings.globals.waitForConditionTimeout = 10;
    runner.test_settings.globals.waitForConditionPollInterval = 9;
    assert.ok(runner.test_settings.test_workers);

    return runner.runTests().then(_ => {
      assert.strictEqual(allArgs.length, 4);
      assert.strictEqual(runner.concurrency.globalExitCode, 0);
    });
  });

  it('test parallel execution with workers defaults -- worker thread', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism.json')
    });

    runner.setup({
      use_child_process: false
    });
    runner.test_settings.globals.retryAssertionTimeout = 10;
    runner.test_settings.globals.waitForConditionTimeout = 10;
    runner.test_settings.globals.waitForConditionPollInterval = 9;
    assert.ok(runner.test_settings.test_workers);

    return runner.runTests().then(_ => {
      assert.strictEqual(taskArgv.length, 4);
      assert.strictEqual(runner.concurrency.globalExitCode, 0);
    });
  });

  it('testParallelExecutionSameEnv - child-process', function() {
    let originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../extra/'));
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './nightwatch.json',
      reporter: 'junit',
      env: 'mixed,mixed'
    });
    runner.setup({
      use_child_process: true
    });
    assert.ok(runner.parallelMode());
    assert.strictEqual(runner.testEnv, 'mixed,mixed');
    assert.deepStrictEqual(runner.availableTestEnvs, ['default', 'mixed']);

    return runner.runTests().then(_ => {
      assert.strictEqual(allArgs.length, 2);
      assert.ok(allArgs[0].join(' ').includes('--env mixed --parallel-mode'));
      assert.ok(allArgs[1].join(' ').includes('--env mixed --parallel-mode'));
      process.chdir(originalCwd);
    });
  });

  it('testParallelExecutionSameEnv - worker threads', function() {
    let originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../extra/'));

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './nightwatch.json',
      reporter: 'junit',
      env: 'mixed,mixed'
    });

    runner.setup({
      use_child_process: false
    });

    assert.ok(runner.parallelMode());
    assert.strictEqual(runner.testEnv, 'mixed,mixed');
    assert.deepStrictEqual(runner.availableTestEnvs, ['default', 'mixed']);

    return runner.runTests().then(_ => {
      assert.strictEqual(taskArgv.length, 2);
      assert.strictEqual(taskArgv[0].env, 'mixed');
      assert.strictEqual(taskArgv[1].env, 'mixed');
      process.chdir(originalCwd);
    });
  });


  it('testParallelExecutionWithWorkersAuto - child process', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism-auto.json')
    });
    runner.setup({
      use_child_process: true
    });
    assert.deepStrictEqual(runner.test_settings.test_workers, {
      enabled: true,
      workers: 'auto'
    });

    return runner.runTests().then(_ => {
      assert.strictEqual(allArgs.length, 4);
    });
  });

  it('testParallelExecutionWithWorkersAuto - worker threads', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism-auto.json')
    });

    runner.setup({
      use_child_process: false
    });
    assert.deepStrictEqual(runner.test_settings.test_workers, {
      enabled: true,
      workers: 'auto'
    });

    return runner.runTests().then(_ => {
      assert.strictEqual(taskArgv.length, 4);
    });
  });

  it('testParallelExecutionWithWorkers and multiple environments - child process', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism-auto.json'),
      env: 'default,default'
    });

    runner.setup({
      use_child_process: true
    });
    assert.strictEqual(runner.test_settings.test_workers.enabled, true);
    assert.ok(runner.test_settings.testWorkersEnabled);
  });

  it('testParallelExecutionWithWorkers and multiple environments - worker threads', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism-auto.json'),
      env: 'default,default'
    });

    runner.setup({
      use_child_process: false
    });
    assert.strictEqual(runner.test_settings.test_workers.enabled, true);
    assert.ok(runner.test_settings.testWorkersEnabled);
  });


  it('test parallel execution with workers count - child process', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism-count.json')
    });
    runner.setup({
      use_child_process: true
    });
    assert.deepStrictEqual(runner.test_settings.test_workers, {
      enabled: true,
      workers: 6
    });

    return runner.runTests().then(_ => {
      assert.strictEqual(allArgs.length, 4);
    });
  });

  it('test parallel execution with workers count - worker threads', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism-count.json')
    });

    runner.setup({
      use_child_process: false
    });
    assert.deepStrictEqual(runner.test_settings.test_workers, {
      enabled: true,
      workers: 6
    });

    return runner.runTests().then(_ => {
      assert.strictEqual(taskArgv.length, 4);
    });
  });

  it('test parallel execution with workers=count arg', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism-count.json'),
      workers: 2
    });

    runner.setup();
    assert.deepStrictEqual(runner.test_settings.test_workers, {
      enabled: true,
      workers: 2
    });
  });

  it('test parallel execution with workers count and extended envs', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism-workers.conf.js'),
      env: 'chrome'
    });

    runner.setup();

    assert.deepStrictEqual(runner.test_settings.test_workers, {
      enabled: true,
      workers: 5
    });

    assert.strictEqual(runner.isTestWorkersEnabled(), true);
  });

  it('test parallel execution with workers disabled per environment', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism-disabled.json')
    });

    runner.setup();

    assert.strictEqual(runner.test_settings.test_workers, false);
  });

  it('test parallel execution with workers and single source file', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism.json'),
      _source: [path.join(__dirname, '../../../sampletests/async/test/sample.js')]
    });

    runner.setup();

    // run in parallel mode even if single source file is provided
    assert.strictEqual(runner.isConcurrencyEnabled([runner.argv._source]), true);
  });

  it('test parallel execution with workers and single source folder', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism.json'),
      _source: path.join(__dirname, '../../../sampletests/before-after')
    });

    runner.setup();

    assert.strictEqual(runner.isConcurrencyEnabled(), true);
  });

  it('test parallel execution using selenium server - child process', function() {
    mockery.registerMock('geckodriver', {
      path: '/path/to/geckodriver'
    });
    mockery.registerMock('chromedriver', {
      path: '/path/to/chromedriver'
    });
    mockery.registerMock('@nightwatch/selenium-server', {
      path: '/path/to/selenium-server-standalone.3.0.jar'
    });
    mockery.registerMock('./service-builders/selenium.js', class SeleniumServer {
      constructor(settings) {
        this.settings = settings;
        this.service = {
          kill() {
            return Promise.resolve();
          }
        };
      }
      async init() {
        this.initCalled = true;
      }
      stop() {
        this.stopped = true;
      }
      setOutputFile(filename) {
        this.outfilename = filename;
      }
    });
    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      config: path.join(__dirname, '../../extra/parallelism-selenium-server.json')
    });
    runner.setup({
      use_child_process: true
    });

    return runner.runTests().then(_ => {
      assert.ok(runner.parallelMode());
      assert.strictEqual(runner.concurrency.globalExitCode, 0);
      assert.strictEqual(allArgs.length, 4);
      assert.strictEqual(runner.seleniumService.initCalled, true);
      assert.strictEqual(runner.seleniumService.stopped, true);
      assert.strictEqual(runner.seleniumService.outfilename, '');
      assert.ok(allArgs[0].join(' ').includes('--test-worker --parallel-mode'));
      assert.ok(allArgs[1].join(' ').includes('--test-worker --parallel-mode'));
    });
  });

  it('test parallel execution using selenium server - worker threads', function() {
    mockery.registerMock('geckodriver', {
      path: '/path/to/geckodriver'
    });

    mockery.registerMock('chromedriver', {
      path: '/path/to/chromedriver'
    });

    mockery.registerMock('@nightwatch/selenium-server', {
      path: '/path/to/selenium-server-standalone.3.0.jar'
    });

    mockery.registerMock('./service-builders/selenium.js', class SeleniumServer {
      constructor(settings) {
        this.settings = settings;
        this.service = {
          kill() {
            return Promise.resolve();
          }
        };
      }

      async init() {
        this.initCalled = true;
      }

      stop() {
        this.stopped = true;
      }
      setOutputFile(filename) {
        this.outfilename = filename;
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      config: path.join(__dirname, '../../extra/parallelism-selenium-server.json')
    });

    runner.setup({
      use_child_process: false
    });

    return runner.runTests().then(_ => {
      assert.ok(runner.parallelMode());
      assert.strictEqual(runner.concurrency.globalExitCode, 0);
      assert.strictEqual(taskArgv.length, 4);
      assert.strictEqual(runner.seleniumService.initCalled, true);
      assert.strictEqual(runner.seleniumService.stopped, true);
      assert.strictEqual(runner.seleniumService.outfilename, '');
      assert.ok(workerPoolArgv[0].join(' ').includes('--test-worker --parallel-mode'));
    });
  });

  it('test concurrency with --headless', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism-count.json'),
      env: 'default',
      headless: true
    });

    runner.setup({
      use_child_process: false
    });
    assert.deepStrictEqual(runner.test_settings.test_workers, {
      enabled: true,
      workers: 6
    });

    return runner.runTests().then(_ => {
      assert.strictEqual(taskArgv[0].env, 'default');
      assert.strictEqual(taskArgv[0].headless, true);
    }); 
  });

  it('test Concurrency.getChildProcessArgs with --env=chrome,firefox', function() {
    const argv = process.argv.slice(0);
    process.argv = ['node', 'runner.js', '--env=chrome,firefox', '--headless'];

    const Concurrency = common.require('runner/concurrency');
    const args = Concurrency.getChildProcessArgs();

    process.argv = argv;
    assert.deepStrictEqual(args, ['--headless']);
  });

  it('test Concurrency.getChildProcessArgs with --env chrome,firefox', function() {
    const argv = process.argv.slice(0);
    process.argv = ['node', 'runner.js', '--env', 'chrome,firefox', '--headless'];

    const Concurrency = common.require('runner/concurrency');
    const args = Concurrency.getChildProcessArgs();

    process.argv = argv;
    assert.deepStrictEqual(args, ['--headless']);
  });

  it('test parallel execution to ensure preservation of all process.execArgv', function() {
    const argv = process.execArgv;
    process.execArgv = ['--inspect'];

    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism-execArgv.json')
    });

    runner.setup();
    const worker = runner.concurrency.createChildProcess('test-worker');
    const args = worker.getArgs();

    process.execArgv = argv;
    assert.ok(args.includes('--inspect'));
    assert.ok(args.includes('--parallel-mode'));
  });

  // TODO: this test is not complete
  xit('test parallel execution to ensure worker start_process is disabled when using selenium server', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      reporter: 'junit',
      config: path.join(__dirname, '../../extra/parallelism-selenium-server.json')
    });

    runner.setup();
    const worker = runner.concurrency.createChildProcess('test-worker');

  });

  it('test random port assignment for parallel execution', function(){
    const client = Nightwatch.createClient({
      webdriver: {
        port: 9999,
        start_process: true
      },

      'test_workers': {
        'enabled': true,
        'workers': 4
      }
    });
    assert.equal(client.transport.settings.webdriver.port, undefined);

    const client2 = Nightwatch.createClient({
      webdriver: {
        port: 9999,
        start_process: false
      },

      'test_workers': {
        'enabled': true,
        'workers': 4
      }
    });
    assert.equal(client2.transport.settings.webdriver.port, 9999);
  });

});
