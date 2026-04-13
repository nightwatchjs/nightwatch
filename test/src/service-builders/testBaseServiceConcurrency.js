const assert = require('assert');
const common = require('../../common.js');

describe('BaseService concurrency behaviour', function () {
  const originalParallelEnv = process.env.__NIGHTWATCH_PARALLEL_MODE;

  after(function () {
    if (originalParallelEnv === undefined) {
      delete process.env.__NIGHTWATCH_PARALLEL_MODE;
    } else {
      process.env.__NIGHTWATCH_PARALLEL_MODE = originalParallelEnv;
    }
  });

  function createService({isWorker, retainLogsInParallelRun} = {}) {
    // Concurrency.isWorker() reads this on each call (see lib/runner/concurrency/index.js)
    if (isWorker) {
      process.env.__NIGHTWATCH_PARALLEL_MODE = '1';
    } else {
      delete process.env.__NIGHTWATCH_PARALLEL_MODE;
    }

    const BaseService = common.require('transport/selenium-webdriver/service-builders/base-service.js');

    class MockBaseService extends BaseService {
      get requiresDriverBinary() {
        return false;
      }

      async createSinkProcess() {
        this.sinkCreated = true;
      }

      async createService(options) {
        // Mock the service object that BaseService.createService() expects
        this.service = {
          setPort: () => { },
          setHostname: () => { },
          setPath: () => { }
        };

        return super.createService(options);
      }
    }

    const settings = {
      webdriver: {
        log_path: 'logs',
        ...(retainLogsInParallelRun ? {retain_logs_in_parallel_run: retainLogsInParallelRun} : {})
      }
    };

    const service = new MockBaseService(settings);

    return service;
  }

  it('creates sink process when not running as worker', async function () {
    const service = createService({isWorker: false});

    assert.strictEqual(service.needsSinkProcess(), true);

    await service.createService({});
    if (process.platform === 'win32') {
      assert.strictEqual(service.sinkCreated, undefined);
      assert.strictEqual(service.settings.webdriver.log_path, false);
    } else {
      assert.strictEqual(service.sinkCreated, true);
      assert.strictEqual(service.settings.webdriver.log_path, 'logs');
    }
  });

  it('does not create sink and disables log_path for workers by default', async function () {
    const service = createService({isWorker: true});

    assert.strictEqual(service.needsSinkProcess(), false);

    await service.createService({});

    assert.strictEqual(service.sinkCreated, undefined);
    assert.strictEqual(service.settings.webdriver.log_path, false);
  });

  it('creates sink and keeps log_path when retain_logs_in_parallel_run is true', async function () {
    const service = createService({isWorker: true, retainLogsInParallelRun: true});

    assert.strictEqual(service.needsSinkProcess(), true);

    await service.createService({});
    if (process.platform === 'win32') {
      assert.strictEqual(service.sinkCreated, undefined);
      assert.strictEqual(service.settings.webdriver.log_path, false);
    } else {
      assert.strictEqual(service.sinkCreated, true);
      assert.strictEqual(service.settings.webdriver.log_path, 'logs');
    }
  });
});
