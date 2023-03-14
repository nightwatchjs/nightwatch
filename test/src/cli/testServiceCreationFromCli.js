const common = require('../../common.js');
const mockery = require('mockery');
const assert = require('assert');
const origPath = require('path');

const IS_WINDOWS = process.platform === 'win32';

(IS_WINDOWS ? describe.skip : describe)('Service creation from cli.js', function() {
  this.timeout(15000);

  beforeEach(function() {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});

    mockery.registerMock('package.json', {});
    mockery.registerMock('path', {
      ...origPath,
      resolve: function(path, ...args) {
        if (path === './appium_config.json') {
          return path;
        }

        return origPath.resolve(path, ...args);
      }
    });
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  const fn = function() {};
  function deleteFromRequireCache(location) {
    const entry = Object.keys(require.cache).filter(item => {
      return item.includes(location);
    });

    entry.forEach(item => {
      delete require.cache[item];
    });
  }

  function mockOptions({onAppiumPathQuery = fn}) {
    const Options = common.require('transport/selenium-webdriver/options.js');
    class MockOptions extends Options {
      getAppiumPath() {
        onAppiumPathQuery();

        return 'path/to/appium';
      }
    }

    deleteFromRequireCache('selenium-webdriver/options');

    mockery.registerMock('./options.js', MockOptions);
  }

  it('test appium server startup', function() {
    let appiumPathQueried = false;
    mockOptions({
      onAppiumPathQuery() {
        appiumPathQueried = true;
      }
    });

    mockery.registerMock('./appium_config.json', {
      src_folders: ['test/sampletests/before-after'],
      output_folder: false,
      selenium: {
        start_process: true,
        use_appium: true
      },
      test_settings: {
        'default': {
          output: false,
          silent: false,
          desiredCapabilities: {
            browserName: ''
          }
        }
      }
    });
  
    mockery.registerMock('./service-builders/appium', class AppiumServer {
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
      config: './appium_config.json'
    }).setup();
  
    return runner.runTests().then(_ => {
      assert.strictEqual(runner.seleniumService.initCalled, true);
      assert.strictEqual(runner.seleniumService.stopped, true);
      assert.strictEqual(runner.seleniumService.outfilename, '');
      assert.strictEqual(appiumPathQueried, true);
      assert.strictEqual(runner.seleniumService.settings.webdriver.server_path, 'path/to/appium');
      assert.strictEqual(runner.seleniumService.settings.selenium['[_started]'], true);
    });
  });

  it('test appium server startup with server_path=appium', function() {
    let appiumPathQueried = false;
    mockOptions({
      onAppiumPathQuery() {
        appiumPathQueried = true;
      }
    });

    mockery.registerMock('./appium_config.json', {
      src_folders: ['test/sampletests/before-after'],
      output_folder: false,
      selenium: {
        start_process: true,
        use_appium: true,
        server_path: 'appium'
      },
      test_settings: {
        'default': {
          output: false,
          silent: false,
          desiredCapabilities: {
            browserName: 'firefox'
          }
        }
      }
    });
  
    mockery.registerMock('./service-builders/appium', class AppiumServer {
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
      config: './appium_config.json'
    }).setup();
  
    return runner.runTests().then(_ => {
      assert.strictEqual(runner.seleniumService.initCalled, true);
      assert.strictEqual(runner.seleniumService.stopped, true);
      assert.strictEqual(runner.seleniumService.outfilename, '');
      assert.strictEqual(appiumPathQueried, false);
      assert.strictEqual(runner.seleniumService.settings.webdriver.server_path, 'appium');
      assert.strictEqual(runner.seleniumService.settings.selenium['[_started]'], true);
    });
  });

  it('test appium server startup with start_process false', function() {
    mockery.registerMock('./appium_config.json', {
      src_folders: ['test/sampletests/before-after'],
      output_folder: false,
      selenium: {
        start_process: false,
        use_appium: true,
        host: 'localhost'
      },
      test_settings: {
        'default': {
          output: false,
          silent: false,
          desiredCapabilities: {
            browserName: ''
          }
        }
      }
    });
  
    let appiumServerStarted = false;
    mockery.registerMock('./selenium-webdriver/appium.js', class AppiumServer {
      static createService() {
        appiumServerStarted = true;
      }
    });
  
    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      config: './appium_config.json'
    }).setup();
  
    return runner.runTests().then(_ => {
      assert.strictEqual(appiumServerStarted, false);
      assert.strictEqual(runner.seleniumService, undefined);
    });
  });

  it('test selenium server startup if use_appium not used', function() {
    mockery.registerMock('./appium_config.json', {
      src_folders: ['test/sampletests/before-after'],
      output_folder: false,
      selenium: {
        start_process: true
      },
      test_settings: {
        'default': {
          output: false,
          silent: false,
          desiredCapabilities: {
            browserName: 'chrome'
          }
        }
      }
    });
  
    let seleniumServerStarted = false;
    mockery.registerMock('./selenium-webdriver/selenium.js', class SeleniumServer {
      static createService() {
        seleniumServerStarted = true;

        return {
          async init() {}
        };
      }
    });
  
    const CliRunner = common.require('runner/cli/cli.js');
    const runner = new CliRunner({
      config: './appium_config.json'
    }).setup();
  
    return runner.runTests().then(_ => {
      assert.strictEqual(seleniumServerStarted, true);
      assert.strictEqual(runner.test_settings.selenium['[_started]'], true);
    });
  });
});