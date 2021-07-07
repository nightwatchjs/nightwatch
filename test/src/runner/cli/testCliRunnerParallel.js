const assert = require('assert');
const path = require('path');
const mockery = require('mockery');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');

describe('Test CLI Runner in Parallel', function () {
  const ChildProcess = common.require('runner/concurrency/child-process.js');
  const RunnerBase = common.require('runner/runner.js');

  const filtered = Object.keys(require.cache).filter(item => (
    item.endsWith('runner/runner.js') || item.endsWith('runner/concurrency/child-process.js')
  ));

  if (filtered && filtered.length > 0) {
    filtered.forEach(item => {
      delete require.cache[item];
    });
  }

  before(function() {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  });

  after(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('test run geckodriver with concurrency', function () {
    class RunnerBaseMock extends RunnerBase {
      static readTestSource(settings, argv) {
        assert.strictEqual(settings.testWorkersEnabled, true);

        return [
          'test_file_1.js',
          'test_file_2.js'
        ];
      }
    }

    class ChildProcessMock extends ChildProcess {
      run(colors, type) {
        assert.strictEqual(colors.length, 4);
        assert.strictEqual(type, 'workers');
        assert.deepStrictEqual(Object.keys(this._events), ['message']);

        return Promise.resolve(0);
      }
    }

    mockery.registerMock('./child-process.js', ChildProcessMock);
    mockery.registerMock('../runner.js', RunnerBaseMock);

    return NightwatchClient.runTests({
      env: 'default',
      config: path.join(__dirname, '../../../extra/withgeckodriver-concurrent.json')
    }, {
      silent: false,
      output: true,
      output_folder: false
    });
  });

  it('start single test run with geckodriver and test workers enabled', function () {
    const testPath = path.join(__dirname, '../../../sampletests/async/test/sample.js');
    const runner = NightwatchClient.CliRunner({
      source: testPath
    });

    assert.strictEqual(runner.argv.source, undefined);
    assert.deepStrictEqual(runner.argv._source, [testPath]);

    runner.setup({
      silent: false,
      output: true,
      output_folder: false
    });

    const Utils = common.require('utils');
    assert.strictEqual(Utils.singleSourceFile(runner.argv), true);
    assert.strictEqual(runner.isTestWorkersEnabled(), false);
  });
});
