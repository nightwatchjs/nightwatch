const assert = require('assert');
const mockery = require('mockery');
const MockServer = require('../../lib/command-mocks.js');
const common = require('../../common.js');

describe('test programmatic apis', function () {
  // [ '-vv', '--port=62625' ]
  function getPortFromArg(args) {
    const argItem = args.find(item => {
      return /^--port=\d+$/.test(item);
    });

    if (argItem) {
      return Number(argItem.replace('--port=', ''));
    }

    return null;
  }

  beforeEach((done) => {
    delete global.browser;

    MockServer.start(done);
    mockery.registerMock('@nightwatch/nightwatch-inspector', 'crxFile');
    mockery.registerMock('./websocket-server', class {
      initSocket() {};

      closeSocket() {};
    });
  });
  afterEach((done) => {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();

    MockServer.stop(done);
  });

  it('test createClient() programmatic API defaults', async function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const Nightwatch = common.require('index.js');
    MockServer.createFirefoxSession({});

    const defaultConfig = {
      test_settings: {
        default: {
          launchUrl: 'http://localhost'
        }
      },
      selenium: {
        port: 10195,
        start_process: false
      },
      selenium_host: 'localhost'
    };

    const createDefaultConfig = CliRunner.createDefaultConfig;
    const loadConfig = CliRunner.prototype.loadConfig;

    CliRunner.createDefaultConfig = function(destFileName) {
      return defaultConfig;
    };

    CliRunner.prototype.loadConfig = function () {
      return defaultConfig;
    };

    const client = Nightwatch.createClient({
      headless: true,
      silent: false,
      output: false,
      enable_global_apis: true
    });

    assert.ok(!!global.browser);
    assert.ok(!!global.browser.page);

    assert.deepStrictEqual(Object.keys(client), ['updateCapabilities', 'launchBrowser']);
    assert.strictEqual(typeof client.launchBrowser, 'function');
    assert.strictEqual(typeof client.settings, 'object');


    const session = await client.launchBrowser();
    assert.strictEqual(session.sessionId, '13521-10219-202');
    assert.deepStrictEqual(session.capabilities, {
      acceptInsecureCerts: false,
      browserName: 'firefox',
      browserVersion: '65.0.1'
    });

    CliRunner.createDefaultConfig = createDefaultConfig;
    CliRunner.prototype.loadConfig = loadConfig;
  });

  it('test createClient() programmatic API defaults with log_file_name', async function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const Nightwatch = common.require('index.js');
    MockServer.createFirefoxSession({});

    const defaultConfig = {
      test_settings: {
        default: {
          launchUrl: 'http://localhost'
        }
      },
      selenium: {
        port: 10195,
        start_process: false
      },
      selenium_host: 'localhost'
    };

    const createDefaultConfig = CliRunner.createDefaultConfig;
    const loadConfig = CliRunner.prototype.loadConfig;

    CliRunner.createDefaultConfig = function(destFileName) {
      return defaultConfig;
    };

    CliRunner.prototype.loadConfig = function () {
      return defaultConfig;
    };

    const client = Nightwatch.createClient({
      headless: true,
      silent: false,
      output: false,
      enable_global_apis: true,
      webdriver: {
        log_path: '',
        log_file_name: 'test-file'
      }
    });


    assert.strictEqual(client.settings.webdriver.log_path, '');
    assert.strictEqual(client.settings.webdriver.log_file_name, 'test-file');

    CliRunner.createDefaultConfig = createDefaultConfig;
    CliRunner.prototype.loadConfig = loadConfig;
  });

  it('test createClient() programmatic API defaults parallel and remote server', async function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const Nightwatch = common.require('index.js');
    MockServer.createFirefoxSession({});
    MockServer.element({});

    const defaultConfig = {
      test_settings: {
        default: {
          launchUrl: 'http://localhost'
        }
      },
      selenium: {
        port: 10195,
        start_process: false
      },
      selenium_host: 'localhost'
    };

    const createDefaultConfig = CliRunner.createDefaultConfig;
    const loadConfig = CliRunner.prototype.loadConfig;

    CliRunner.createDefaultConfig = function(destFileName) {
      return defaultConfig;
    };

    CliRunner.prototype.loadConfig = function () {
      return defaultConfig;
    };

    const client = Nightwatch.createClient({
      parallel: true,
      headless: true
    });

    const session = await client.launchBrowser();

    const {element} = Nightwatch;
    const containerEl = element('#container');
    const webElement = await containerEl.getWebElement();
    const elementId = await webElement.getId();
    assert.strictEqual(elementId, '5cc459b8-36a8-3042-8b4a-258883ea642b');

    assert.strictEqual(session.sessionId, '13521-10219-202');
    assert.strictEqual(session.options.webdriver.port, 10195);

    assert.deepStrictEqual(session.capabilities, {
      acceptInsecureCerts: false,
      browserName: 'firefox',
      browserVersion: '65.0.1'
    });

    CliRunner.createDefaultConfig = createDefaultConfig;
    CliRunner.prototype.loadConfig = loadConfig;
  });

  it('test createClient() programmatic API defaults with env', async function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const Nightwatch = common.require('index.js');
    MockServer.createChromeSession({});

    const defaultConfig = {
      test_settings: {
        default: {
          launchUrl: 'http://localhost'
        },
        chrome_env: {
          desiredCapabilities: {
            browserName: 'chrome'
          }
        }
      },
      selenium: {
        port: 10195,
        start_process: false
      },
      selenium_host: 'localhost'
    };

    const createDefaultConfig = CliRunner.createDefaultConfig;
    const loadConfig = CliRunner.prototype.loadConfig;

    CliRunner.createDefaultConfig = function(destFileName) {
      return defaultConfig;
    };

    CliRunner.prototype.loadConfig = function () {
      return defaultConfig;
    };

    const client = Nightwatch.createClient({
      env: 'chrome_env',
      headless: true,
      disable_global_apis: true
    });

    assert.strictEqual(typeof global.browser, 'undefined');

    const session = await client.launchBrowser();

    assert.strictEqual(session.sessionId, '13521-10219-202');
    assert.strictEqual(session.options.webdriver.port, 10195);

    assert.deepStrictEqual(session.capabilities, {
      acceptInsecureCerts: false,
      browserName: 'chrome',
      browserVersion: '90'
    });

    CliRunner.createDefaultConfig = createDefaultConfig;
    CliRunner.prototype.loadConfig = loadConfig;
  });

  it('test createClient() programmatic API not headless', async function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const Nightwatch = common.require('index.js');
    MockServer.createFirefoxSession({});

    const defaultConfig = {
      test_settings: {
        default: {
          launchUrl: 'http://localhost'
        }
      },
      selenium: {
        port: 10195,
        start_process: false
      },
      selenium_host: 'localhost'
    };

    const createDefaultConfig = CliRunner.createDefaultConfig;
    const loadConfig = CliRunner.prototype.loadConfig;

    CliRunner.createDefaultConfig = function(destFileName) {
      return defaultConfig;
    };

    CliRunner.prototype.loadConfig = function () {
      return defaultConfig;
    };

    const client = Nightwatch.createClient({
      headless: false
    });

    const session = await client.launchBrowser();

    assert.strictEqual(session.sessionId, '1352110219202');
    assert.deepStrictEqual(session.capabilities, {
      browserName: 'firefox',
      browserVersion: 'TEST_firefox'
    });

    CliRunner.createDefaultConfig = createDefaultConfig;
    CliRunner.prototype.loadConfig = loadConfig;
  });

  it('test createClient() programmatic API with external config', async function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const Nightwatch = common.require('index.js');
    MockServer.createFirefoxSession({});

    const defaultConfig = {
      test_settings: {
        default: {
          launchUrl: 'http://localhost'
        }
      },
      selenium: {
        port: 10195,
        start_process: false
      },
      selenium_host: 'localhost'
    };

    const createDefaultConfig = CliRunner.createDefaultConfig;
    const loadConfig = CliRunner.prototype.loadConfig;

    CliRunner.createDefaultConfig = function(destFileName) {
      return defaultConfig;
    };

    let customConfig;
    CliRunner.prototype.loadConfig = function () {
      customConfig = this.argv.config;

      return defaultConfig;
    };

    const client = Nightwatch.createClient({
      headless: true,
      config: './custom-config.conf.js'
    });

    const session = await client.launchBrowser();

    assert.strictEqual(customConfig, './custom-config.conf.js');
    assert.strictEqual(session.sessionId, '13521-10219-202');

    CliRunner.createDefaultConfig = createDefaultConfig;
    CliRunner.prototype.loadConfig = loadConfig;
  });

  it('test createClient() programmatic API with custom timeout', async function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const Nightwatch = common.require('index.js');
    MockServer.createFirefoxSession({});

    const createDefaultConfig = CliRunner.createDefaultConfig;
    const loadConfig = CliRunner.prototype.loadConfig;
    const defaultConfig = {
      test_settings: {
        default: {
          launchUrl: 'http://localhost'
        }
      },
      selenium: {
        port: 10195,
        start_process: false
      },
      selenium_host: 'localhost'
    };

    CliRunner.createDefaultConfig = function(destFileName) {
      return defaultConfig;
    };

    CliRunner.prototype.loadConfig = function () {
      return defaultConfig;
    };

    const client = Nightwatch.createClient({
      timeout: 500,
      useAsync: false,
      output: false,
      silent: false,
      headless: true,
      output_folder: 'output',
      globals: {
        testGlobal: 'one'
      }
    });

    const session = await client.launchBrowser();

    CliRunner.createDefaultConfig = createDefaultConfig;
    CliRunner.prototype.loadConfig = loadConfig;
    assert.strictEqual(session.options.always_async_commands, false);
    assert.strictEqual(session.options.globals.retryAssertionTimeout, 500);
    assert.strictEqual(session.options.globals.waitForConditionTimeout, 500);
    assert.strictEqual(session.options.globals.testGlobal, 'one');
    assert.strictEqual(session.options.silent, false);
    assert.strictEqual(session.options.output_folder, 'output');
    assert.strictEqual(session.sessionId, '13521-10219-202');
  });

  it('test createClient() programmatic API defaults with browserName', async function() {
    const CliRunner = common.require('runner/cli/cli.js');
    const Nightwatch = common.require('index.js');
    MockServer.createChromeSession({
    });

    MockServer.createFirefoxSession({});

    const defaultConfig = {
      test_settings: {
        default: {
          launchUrl: 'http://localhost'
        },

        chrome: {
          desiredCapabilities: {
            browserName: 'chrome'
          }
        },

        firefox: {
          desiredCapabilities: {
            browserName: 'firefox'
          }
        },

        safari: {
          desiredCapabilities: {
            browserName: 'chrome'
          }
        },

        edge: {
          desiredCapabilities: {
            browserName: 'chrome'
          }
        }
      },
      selenium: {
        port: 10195,
        start_process: false
      },
      selenium_host: 'localhost'
    };

    const createDefaultConfig = CliRunner.createDefaultConfig;
    const loadConfig = CliRunner.prototype.loadConfig;

    CliRunner.createDefaultConfig = function(destFileName) {
      return defaultConfig;
    };

    CliRunner.prototype.loadConfig = function () {
      return defaultConfig;
    };

    const clientChrome = Nightwatch.createClient({
      browserName: 'chrome',
      headless: true
    });

    const session = await clientChrome.launchBrowser();
    assert.strictEqual(session.sessionId, '13521-10219-202');
    assert.strictEqual(session.options.webdriver.port, 10195);

    assert.deepStrictEqual(session.capabilities, {
      acceptInsecureCerts: false,
      browserName: 'chrome',
      browserVersion: '90'
    });

    const clientFirefox = Nightwatch.createClient({
      browserName: 'firefox',
      headless: true
    });

    const sessionFirefox = await clientFirefox.launchBrowser();
    assert.strictEqual(sessionFirefox.sessionId, '13521-10219-202');
    assert.deepStrictEqual(sessionFirefox.capabilities, {
      acceptInsecureCerts: false,
      browserName: 'firefox',
      browserVersion: '65.0.1'
    });

    CliRunner.createDefaultConfig = createDefaultConfig;
    CliRunner.prototype.loadConfig = loadConfig;
  });

  it('test createClient() programmatic API defaults parallel and local server', async function() {
    const server_path = './bin/geckodriver';
    const {constants, rmdirSync, readdirSync, lstatSync} = require('fs');
    delete require.cache['fs'];

    let serverPort;
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock('fs', {
      existsSync(exe) {
        return !exe.includes('nightwatch-axe-verbose');
      },
      constants,
      rmdirSync,
      lstatSync,
      readdirSync,
      readFileSync() {
        return true;
      },
      writeFile(filePath, output, cb) {
        cb(null);
      }
    });

    mockery.registerMock('../io/exec', {
      exec: function (exe, opts) {
        serverPort = getPortFromArg(opts.args);

        return {
          result() {
            return Promise.resolve({
              code: '0'
            });
          }
        };
      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    const Concurrency = common.require('runner/concurrency');
    const Nightwatch = common.require('index.js');

    Concurrency.isWorker = function() {
      return true;
    };

    const defaultConfig = {
      test_settings: {
        default: {
          launchUrl: 'http://localhost'
        }
      },
      webdriver: {
        port: 10195,
        start_process: true,
        server_path
      },
      selenium_host: 'localhost'
    };

    const createDefaultConfig = CliRunner.createDefaultConfig;
    const loadConfig = CliRunner.prototype.loadConfig;

    CliRunner.createDefaultConfig = function(destFileName) {
      return defaultConfig;
    };

    CliRunner.prototype.loadConfig = function () {
      return defaultConfig;
    };

    const client = Nightwatch.createClient({
      parallel: true
    });

    try {
      await client.launchBrowser();
    } catch (err) {
    }

    assert.strictEqual(typeof serverPort, 'number');
    assert.ok(serverPort > 0);
    assert.notStrictEqual(serverPort, 10195);
    CliRunner.createDefaultConfig = createDefaultConfig;
    CliRunner.prototype.loadConfig = loadConfig;
  });
});
