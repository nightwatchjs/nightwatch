const assert = require('assert');
const path = require('path');
const mockery = require('mockery');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');
const {settings} = common;

describe('Test CLI Runner in Parallel', function () {
  const ChildProcess = common.require('runner/concurrency/child-process.js');
  const WorkerProcess = common.require('runner/concurrency/worker-process.js');
  const WorkerTask = common.require('runner/concurrency/worker-task.js');
  const RunnerBase = common.require('runner/runner.js');

  const filtered = Object.keys(require.cache).filter(item => (
    item.endsWith('runner/runner.js') || item.endsWith('runner/concurrency/child-process.js') || item.endsWith('runner/concurrency/worker-process.js') || item.endsWith('runner/concurrency/worker-task.js')
  ));

  if (filtered && filtered.length > 0) {
    filtered.forEach(item => {
      delete require.cache[item];
    });
  }

  beforeEach(function() {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('test run geckodriver with concurrency - child process', function () {
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
      use_child_process: true,
      silent: false,
      output: false,
      output_folder: false
    });
  });
  
  it('test run geckodriver with concurrency - worker threads', function () {
    process.env.TEST_ENV = 'TEST';
    class RunnerBaseMock extends RunnerBase {
      static readTestSource(settings, argv) {
        assert.strictEqual(settings.testWorkersEnabled, true);

        return [
          'test_file_1.js',
          'test_file_2.js'
        ];
      }
    }

    class WorkerProcessMock extends WorkerProcess {
      addTask({colors}) {
        assert.strictEqual(colors.length, 4);
        assert.strictEqual(this.piscina.options.env.TEST_ENV, 'TEST');
        assert(Object.keys(this.piscina.options.env).length > 1, 'process.env should have more than one key');

        // cleaning the env
        process.env.TEST_ENV = undefined;

        return Promise.resolve(0);
      }
    }

    mockery.registerMock('./worker-process.js', WorkerProcessMock);
    mockery.registerMock('../runner.js', RunnerBaseMock);

    return NightwatchClient.runTests({
      env: 'default',
      config: path.join(__dirname, '../../../extra/withgeckodriver-concurrent.json')
    }, {
      use_child_process: false,
      silent: false,
      output: false,
      output_folder: false
    });
  });

  it('run error test file with concurrency - worker threads', function() {
    let numberOfTasks = 0;
    class RunnerBaseMock extends RunnerBase {
      static readTestSource(settings, argv) {
        assert.strictEqual(settings.testWorkersEnabled, true);

        return [
          'test_file_1.js',
          'test_file_2.js'
        ];
      }
    }

    class WorkerProcessMock extends WorkerProcess {
      addTask({colors}) {

        this.__tasks.push(new Promise((resolve, reject) => {
          setTimeout(()=>{
            numberOfTasks++;
            reject(new Error('Nigtwatch custom error'));
          }, 10 * (numberOfTasks + 1));
        }));

        return Promise.resolve(0);
      }
    }
    mockery.registerMock('./worker-process.js', WorkerProcessMock);
    mockery.registerMock('../runner.js', RunnerBaseMock);

    return NightwatchClient.runTests({
      env: 'default',
      config: path.join(__dirname, '../../../extra/withgeckodriver-concurrent.json')
    }, settings({
      globals: {
        reporter() {
          assert.strictEqual(numberOfTasks, 2); 
        }
      },
      use_child_process: false,
      silent: false,
      output: false,
      output_folder: false
    }));
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
      output: false,
      output_folder: false
    });

    const Utils = common.require('utils');
    assert.strictEqual(Utils.singleSourceFile(runner.argv), true);
    assert.strictEqual(runner.isTestWorkersEnabled(), false);
  });

  it('mobile config setup on with worker threads - disabled parallelism ', function() {
    class RunnerBaseMock extends RunnerBase {
      static readTestSource(settings, argv) {
        assert.strictEqual(settings.testWorkersEnabled, true);

        return [
          'test_file_1.js',
          'test_file_2.js'
        ];
      }
    }
    mockery.registerMock('../runner.js', RunnerBaseMock);
    mockery.registerMock(path.join(process.cwd(), 'ios_config.json'), {
      test_settings: {
        desiredCapabilities: {
          browserName: 'firefox'
        },
        'simulator.ios': {
          desiredCapabilities: {
            browserName: 'safari',
            platformName: 'iOS',
            'safari:useSimulator': true,
            'safari:deviceName': 'iPhone 13',
            'safari:platformVersion': '15.0'
          }
        }
      }
    });
    const runner = NightwatchClient.CliRunner({
      config: 'ios_config.json',
      env: 'simulator.ios',
      workers: 4
    }).setup();
    assert.strictEqual(runner.isTestWorkersEnabled(), false);
    assert.strictEqual(runner.parallelMode(), false);
  });

  it('mobile config setup on with worker threads - enable worker threads while using server config', function() {
    class RunnerBaseMock extends RunnerBase {
      static readTestSource(settings, argv) {
        assert.strictEqual(settings.testWorkersEnabled, true);

        return [
          'test_file_1.js',
          'test_file_2.js'
        ];
      }
    }
    mockery.registerMock('../runner.js', RunnerBaseMock);
    mockery.registerMock(path.join(process.cwd(), 'ios_config.json'), {
      test_settings: {
        desiredCapabilities: {
          browserName: 'firefox'
        },
        'simulator.ios': {
          selenium: {
            host: 'localhost',
            use_appium: true
          },
          desiredCapabilities: {
            browserName: null,
            platformName: 'iOS',
            'appium:deviceName': 'iPhone 13',
            'appium:platformVersion': '15.0'
          }
        }
      }
    });
    const runner = NightwatchClient.CliRunner({
      config: 'ios_config.json',
      env: 'simulator.ios',
      workers: 4
    }).setup();
    assert.strictEqual(runner.isTestWorkersEnabled(), true);
    assert.strictEqual(runner.parallelMode(), true);
  });


  it('disable parallelism when running tests on safari', function() {
    class RunnerBaseMock extends RunnerBase {
      static readTestSource(settings, argv) {
        assert.strictEqual(settings.testWorkersEnabled, true);

        return [
          'test_file_1.js',
          'test_file_2.js'
        ];
      }
    }
    mockery.registerMock('../runner.js', RunnerBaseMock);
    const runner = NightwatchClient.CliRunner({
      config: path.join(__dirname, '../../../extra/withsafari-concurrent.json'),
      env: 'default'
    }).setup();
    assert.strictEqual(runner.isTestWorkersEnabled(), false);
    assert.strictEqual(runner.parallelMode(), false);
  });

  it('disable parallelism when running tests on safari with --env chrome,safari', function() {
    class RunnerBaseMock extends RunnerBase {
      static readTestSource(settings, argv) {
        assert.strictEqual(settings.testWorkersEnabled, true);

        return [
          'test_file_1.js',
          'test_file_2.js'
        ];
      }
    }
    mockery.registerMock('../runner.js', RunnerBaseMock);
    const runner = NightwatchClient.CliRunner({
      config: path.join(__dirname, '../../../extra/withsafari-concurrent.json'),
      env: ['default', 'chrome']
    }).setup();
    assert.strictEqual(runner.isTestWorkersEnabled(), false);
    assert.strictEqual(runner.parallelMode(), false);
  });

  it('mobile config setup on with multiple envs - enable parallelism ', function() {
    class RunnerBaseMock extends RunnerBase {
      static readTestSource(settings, argv) {
        assert.strictEqual(settings.testWorkersEnabled, true);

        return [
          'test_file_1.js',
          'test_file_2.js'
        ];
      }
    }
    mockery.registerMock('../runner.js', RunnerBaseMock);
    mockery.registerMock(path.join(process.cwd(), 'android_config.json'), {
      test_settings: {
        'default': {
          desiredCapabilities: {
            browserName: 'firefox'
          }
        },
        'android.chrome': {
          desiredCapabilities: {
            avd: 'nightwatch-android-11',
            browserName: 'chrome',
            'goog:chromeOptions': {
              androidPackage: 'com.android.chrome'
            }
          }
        }
      }
    });
    const runner = NightwatchClient.CliRunner({
      config: 'android_config.json',
      env: 'android.chrome,default'
    }).setup();
    assert.strictEqual(runner.isTestWorkersEnabled(), false);
    assert.strictEqual(runner.parallelMode(), true);
  });
  

  it('run worker threads with parallel_process_delay - worker threads', function() {
    let startDelay = 0;
    class RunnerBaseMock extends RunnerBase {
      static readTestSource(settings, argv) {
        assert.strictEqual(settings.testWorkersEnabled, true);

        return [
          'test_file_1.js',
          'test_file_2.js'
        ];
      }
    }

    class WorkerTaskMock extends WorkerTask {
      async runWorkerTask(colors, type) {
        startDelay = this.startDelay;
       
        return new Promise((resolve, reject) => {
          try {
            assert.strictEqual(this.startDelay, 10);
            resolve();
          } catch (err) {
            reject(err);
          }
        }, 10);
      }
    }
    mockery.registerMock('./worker-task.js', WorkerTaskMock);
    mockery.registerMock('../runner.js', RunnerBaseMock);

    return NightwatchClient.runTests({
      env: 'default',
      config: path.join(__dirname, '../../../extra/withgeckodriver-concurrent.json')
    }, settings({
      parallel_process_delay: 100,
      globals: {
        reporter() {
          assert.strictEqual(startDelay, 100);
        }
      },
      use_child_process: false,
      silent: false,
      output: true,
      output_folder: false
    }));
  });
});
