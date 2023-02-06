const EventEmitter = require('events');
const mockery = require('mockery');
const path = require('path');
const assert = require('assert');
const common = require('../../common.js');

describe.only('test Sequential Execution', function() {
  const allArgs = [];
  const allOpts = [];
  this.timeout(5000);

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
    allOpts.length = 0;
    process.env.__NIGHTWATCH_PARALLEL_MODE = null;
  });

  it('testSequentialExecution - sequential with multiple environment', async function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../extra/'));

    let runner = new CliRunner({
      config: './nightwatch.json',
      env: 'default,mixed',
      reporter: 'junit',
      serial: true,
      workers: 1
    });

    await runner.setup();

    assert.ok(runner.sequentialMode());
    assert.strictEqual(runner.testEnv, 'default,mixed');
    assert.deepStrictEqual(runner.availableTestEnvs, ['default', 'mixed']);

    await runner.runTests();

    assert.ok(runner.sequentialMode());
    assert.deepEqual(runner.testEnvArray, ['default', 'mixed']);
    process.chdir(originalCwd);
  });

  it('testSequentialExecution with worker', async function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../extra/'));

    let runner = new CliRunner({
      config: './nightwatch.json',
      env: 'default,mixed',
      reporter: 'junit',
      serial: true,
      workers: 5
    });

    await runner.setup();

    assert.strictEqual(runner.testEnv, 'default,mixed');
    assert.deepStrictEqual(runner.availableTestEnvs, ['default', 'mixed']);

    await runner.runTests();

    assert.strictEqual(runner.sequentialMode(), false);
    assert.strictEqual(runner.parallelMode(), true);
    assert.deepEqual(runner.testEnvArray, ['default', 'mixed']);
    process.chdir(originalCwd);
  });
});
