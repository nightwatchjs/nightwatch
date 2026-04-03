const assert = require('assert');
const mockery = require('mockery');
const common = require('../../common.js');

describe('BaseService concurrency behaviour', function () {
  const Concurrency = common.require('runner/concurrency/');
  const originalIsWorker = Concurrency.isWorker;

  before(function () {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  });

  after(function () {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
    Concurrency.isWorker = originalIsWorker;
  });

  function createService({isWorker, retainLogsInParallelRun} = {}) {
    mockery.registerMock('runner/concurrency/', {
      isWorker: function () {
        return true;
      }
    });

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
        retain_logs_in_parallel_run: retainLogsInParallelRun
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
    const service = createService({isWorker: true, retainLogsInParallelRun: false});

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
