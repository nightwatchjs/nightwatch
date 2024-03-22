const util = require('util');
const events = require('events');
const mockery = require('mockery');
const path = require('path');
const assert = require('assert');
const common = require('../../common.js');

describe('test Parallel Execution Exit Code', function() {
  const allArgs = [];
  const allOpts = [];
  this.timeout(5000);

  beforeEach(function() {
    let index = 0;
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock('package.json', {});
    mockery.registerMock('child_process', {
      spawn: function(path, args, opts) {
        allArgs.push(args);
        allOpts.push(opts);

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
            this.emit('exit', index === 0 ? 1 : 0);
          }.bind(this), 11);
        };

        util.inherits(Child, events.EventEmitter);

        return new Child();
      }
    });
    mockery.registerMock('./worker-process.js', class WorkerProcess extends events {
      constructor(args, settings, maxWorkerCount) {
        super();
        this.tasks = [];
        this.index = 0;
      }

      addTask({argv}) {
        this.tasks.push(Promise.reject());
        Promise.resolve();
      }
    });

    const {platform, constants, homedir, release} = require('os');
    mockery.registerMock('os', {
      cpus: function() {
        return [0, 1, 2];
      },
      platform, 
      constants,
      homedir,
      release
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

  it('test parallel execution with code non zero test workers', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../extra/parallelism-count.json')
    });

    runner.setup({
      use_child_process: true
    });

    let setExitCode = runner.processListener.setExitCode;
    runner.processListener.setExitCode = function(code) {
      runner.processListener.setExitCode = setExitCode;
      assert.strictEqual(code, 1);
    };

    return runner.runTests();
  });

  it('test parallel execution with code non zero envs', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../extra/parallelism-envs.json'),
      env: 'env1,env2'
    });

    runner.setup({
      use_child_process: true
    });

    let setExitCode = runner.processListener.setExitCode;
    runner.processListener.setExitCode = function(code) {
      runner.processListener.setExitCode = setExitCode;
      assert.strictEqual(code, 1);
    };

    return runner.runTests();
  });

  it('test parallel execution with code non zero test workers - worker threads', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../extra/parallelism-count.json')
    });

    runner.setup({
      use_child_process: false
    });

    let setExitCode = runner.processListener.setExitCode;
    runner.processListener.setExitCode = function(code) {
      runner.processListener.setExitCode = setExitCode;
      assert.strictEqual(code, 1);
    };

    return runner.runTests();
  });

  it('test parallel execution with code non zero envs - worker threads', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: path.join(__dirname, '../../extra/parallelism-envs.json'),
      env: 'env1,env2'
    });

    runner.setup({
      use_child_proces: true
    });

    let setExitCode = runner.processListener.setExitCode;
    runner.processListener.setExitCode = function(code) {
      runner.processListener.setExitCode = setExitCode;
      assert.strictEqual(code, 1);
    };

    return runner.runTests();
  });
});
