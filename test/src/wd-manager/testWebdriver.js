const assert = require('assert');
const mockery = require('mockery');
const common = require('../../common.js');
const WDServer = common.require('runner/webdriver-server.js');
const Settings = common.require('settings/settings.js');

describe('Webdriver Manager', function () {

  describe('test Webdriver managed', function () {
    const BaseWDServer = common.require('runner/wd-instances/base-wd-server.js');
    const filtered = Object.keys(require.cache).filter(item => (
      item.endsWith('wd-instances/base-wd-server.js')
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
      delete process.env.__NIGHTWATCH_PARALLEL_MODE;
      mockery.deregisterAll();
      mockery.resetCache();
      mockery.disable();
    });

    it('runner throws error if server_path is not set', async function () {
      const settings = Settings.parse({
        webdriver: {
          start_process: true
        }
      });

      let error;
      try {
        const wdServer = new WDServer(settings);
        await wdServer.start();
      } catch (err) {
        error = err;
      }

      assert.ok(error instanceof Error);
      assert.ok(error.message.includes('The path to the GeckoDriver binary is not set.'));
    });

    it('runner throws error if driver is not known', async function () {
      const settings = Settings.parse({
        desiredCapabilities: {
          browserName: 'opera'
        },
        webdriver: {
          start_process: true
        }
      });

      let error;
      try {
        const wdServer = new WDServer(settings);
        await wdServer.start();
      } catch (err) {
        error = err;
      }

      assert.ok(error instanceof Error);
      assert.ok(error.message.includes('Unknown browser driver: opera. Please try using Selenium Server instead.'));
    });

    it('test run geckodriver with concurrency', async function () {
      class BaseWDServerMock extends BaseWDServer {
        createProcess() {
          this.process = {
            removeListener() {},
            stdout: {
              on() {}
            },
            stderr: {
              on() {}
            },
            on() {}
          };

          setTimeout(() => {
            this.promiseStarted.resolve();
          }, 100);

          return this;
        }
      }

      mockery.registerMock('./base-wd-server.js', BaseWDServerMock);
      process.env.__NIGHTWATCH_PARALLEL_MODE = '1';
      const settings = Settings.parse({
        webdriver: {
          start_process: true,
          server_path: './bin/geckodriver'
        }
      });

      const wdServer = new WDServer(settings, {
        'test-worker': true
      });

      const instance = await wdServer.start();

      assert.strictEqual(instance.options.findFreePort, true);
      assert.strictEqual(instance.npmPackageName, 'geckodriver');
      assert.strictEqual(instance.outputFile, 'geckodriver.log');
      assert.strictEqual(instance.serviceName, 'GeckoDriver');
      assert.strictEqual(instance.processCreated, true);
      assert.strictEqual(instance.cliArgs[0], '--port');
      assert.ok(instance.cliArgs[1] !== Number(instance.defaultPort));
    });

    it('test run safaridriver with concurrency', async function () {
      class BaseWDServerMock extends BaseWDServer {
        createProcess() {
          this.process = {
            removeListener() {},
            stdout: {
              on() {}
            },
            stderr: {
              on() {}
            },
            on() {}
          };

          setTimeout(() => {
            this.promiseStarted.resolve();
          }, 10);

          return this;
        }
      }

      mockery.registerMock('./base-wd-server.js', BaseWDServerMock);
      process.env.__NIGHTWATCH_PARALLEL_MODE = '1';
      const settings = Settings.parse({
        desiredCapabilities: {
          browserName: 'safari'
        },
        webdriver: {
          start_process: true
        }
      });

      const wdServer = new WDServer(settings, {
        'test-worker': true
      });

      const instance = await wdServer.start();

      assert.strictEqual(instance.options.findFreePort, true);
      assert.strictEqual(instance.npmPackageName, null);
      assert.strictEqual(instance.outputFile, 'safaridriver.log');
      assert.strictEqual(instance.serviceName, 'SafariDriver');
      assert.strictEqual(instance.processCreated, true);
      assert.strictEqual(instance.cliArgs[0], '--port');
      assert.ok(instance.cliArgs[1] !== Number(instance.defaultPort));
    });

    it('test run chromedriver with concurrency', async function () {
      class BaseWDServerMock extends BaseWDServer {
        createProcess() {
          this.process = {
            removeListener() {},
            stdout: {
              on() {}
            },
            stderr: {
              on() {}
            },
            on() {}
          };

          setTimeout(() => {
            this.promiseStarted.resolve();
          }, 10);

          return this;
        }
      }

      mockery.registerMock('./base-wd-server.js', BaseWDServerMock);
      process.env.__NIGHTWATCH_PARALLEL_MODE = '1';
      const settings = Settings.parse({
        desiredCapabilities: {
          browserName: 'chrome'
        },
        webdriver: {
          start_process: true,
          server_path: './bin/chromedriver'
        }
      });

      const wdServer = new WDServer(settings, {
        'test-worker': true
      });

      const instance = await wdServer.start();

      assert.strictEqual(instance.options.findFreePort, true);
      assert.strictEqual(instance.npmPackageName, 'chromedriver');
      assert.strictEqual(instance.outputFile, 'chromedriver.log');
      assert.strictEqual(instance.serviceName, 'ChromeDriver');
      assert.strictEqual(instance.processCreated, true);
      assert.ok(instance.cliArgs[0].startsWith('--port='));
      assert.strictEqual(instance.cliArgs.length, 1);
    });

    it('test run edgedriver with concurrency', async function () {
      class BaseWDServerMock extends BaseWDServer {
        createProcess() {
          this.process = {
            removeListener() {},
            stdout: {
              on() {}
            },
            stderr: {
              on() {}
            },
            on() {}
          };

          setTimeout(() => {
            this.promiseStarted.resolve();
          }, 10);

          return this;
        }
      }

      mockery.registerMock('./base-wd-server.js', BaseWDServerMock);
      process.env.__NIGHTWATCH_PARALLEL_MODE = '1';
      const settings = Settings.parse({
        desiredCapabilities: {
          browserName: 'MicrosoftEdge'
        },
        webdriver: {
          start_process: true,
          server_path: './bin/chromedriver'
        }
      });

      const wdServer = new WDServer(settings, {
        'test-worker': true
      });

      const instance = await wdServer.start();

      assert.strictEqual(instance.options.findFreePort, true);
      assert.strictEqual(instance.npmPackageName, null);
      assert.strictEqual(instance.outputFile, 'edgedriver.log');
      assert.strictEqual(instance.serviceName, 'EdgeDriver');
      assert.strictEqual(instance.processCreated, true);
      assert.strictEqual(instance.defaultPort, 9514);
      assert.ok(instance.cliArgs[0].startsWith('--port='));
      assert.strictEqual(instance.cliArgs.length, 1);
    });
  });
});
