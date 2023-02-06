const path = require('path');
const assert = require('assert');
const common = require('../../common.js');

describe('test Sequential Execution', function() {
  it('testSequentialExecution - sequential with multiple environment', function() {
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

    runner.setup();

    assert.ok(runner.sequentialMode());
    assert.strictEqual(runner.testEnv, 'default,mixed');
    assert.deepStrictEqual(runner.availableTestEnvs, ['default', 'mixed']);
    process.chdir(originalCwd);
  });

  it('testSequentialExecution - parallel with 5 workers but serial with multiple environments ', function() {
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

    runner.setup();

    assert.strictEqual(runner.sequentialMode(), false);
    assert.strictEqual(runner.testEnv, 'default,mixed');
    assert.deepStrictEqual(runner.availableTestEnvs, ['default', 'mixed']);
    process.chdir(originalCwd);
  });

  it('testSequentialExecution - parallel with multiple environment', function() {
    const CliRunner = common.require('runner/cli/cli.js');
    let originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '../../extra/'));

    let runner = new CliRunner({
      config: './nightwatch.json',
      env: 'default,mixed',
      reporter: 'junit',
      serial: false,
      workers: 1
    });

    runner.setup();

    assert.strictEqual(runner.sequentialMode(), false);
    assert.strictEqual(runner.testEnv, 'default,mixed');
    assert.deepStrictEqual(runner.availableTestEnvs, ['default', 'mixed']);
    process.chdir(originalCwd);
  });
});
