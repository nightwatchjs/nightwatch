const assert = require('assert');
const mockery = require('mockery');
const common = require('../../common.js');

describe('BaseService concurrency behaviour', function() {
  const Concurrency = common.require('runner/concurrency/');
  const originalIsWorker = Concurrency.isWorker;

  before(function() {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  });

  after(function() {
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
    Concurrency.isWorker = originalIsWorker;
  });

  function createService({isWorker, retainLogsInWorker} = {}) {
    Concurrency.isWorker = function() {
      return !!isWorker;
    };

    const BaseService = common.require('transport/selenium-webdriver/service-builders/base-service.js');

    class MockBaseService extends BaseService {
      get requiresDriverBinary() {
        return false;
      }

      async createSinkProcess() {
        this.sinkCreated = true;
      }
    }

    const settings = {
      webdriver: {
        log_path: 'logs',
        retain_logs_in_worker: retainLogsInWorker
      }
    };

    const service = new MockBaseService(settings);

    return service;
  }

  it('creates sink process when not running as worker', async function() {
    const service = createService({isWorker: false});

    assert.strictEqual(service.needsSinkProcess(), true);

    await service.createService({});

    assert.strictEqual(service.sinkCreated, true);
    assert.strictEqual(service.settings.webdriver.log_path, 'logs');
  });

  it('does not create sink and disables log_path for workers by default', async function() {
    const service = createService({isWorker: true, retainLogsInWorker: false});

    assert.strictEqual(service.needsSinkProcess(), false);

    await service.createService({});

    assert.strictEqual(service.sinkCreated, undefined);
    assert.strictEqual(service.settings.webdriver.log_path, false);
  });

  it('creates sink and keeps log_path when retain_logs_in_worker is true', async function() {
    const service = createService({isWorker: true, retainLogsInWorker: true});

    assert.strictEqual(service.needsSinkProcess(), true);

    await service.createService({});

    assert.strictEqual(service.sinkCreated, true);
    assert.strictEqual(service.settings.webdriver.log_path, 'logs');
  });
});




