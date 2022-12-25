const assert = require('assert');
const mockery = require('mockery');
const path = require('path');
const common = require('../../common.js');
const NightwatchClient = common.require('index.js');
const Settings = common.require('settings/settings.js');

describe('AppiumServer Transport Tests', function () {
  beforeEach(function() {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  });

  afterEach(function(){
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
  });

  const sessionData = {
    sessionId: '111',
    getId() {
      return '1111';
    },
    getCapabilities() {
      return {
        getPlatform() {
          return 'MAC';
        },
        getBrowserName() {
          return 'chrome';
        },
        getBrowserVersion() {
          return '11';
        },
        get(name) {
          return name;
        },
        keys() {
          return new Map();
        }
      };
    }
  };

  const mockDriver = {
    session_: Promise.resolve(),
    async getSession() {
      return sessionData;
    },
    async getExecutor() {
      return {
        w3c: true
      };
    }
  };

  const fn = function() {};
  function deleteFromRequireCache(location) {
    const entry = Object.keys(require.cache).filter(item => {
      return item.includes(location);
    });

    entry.forEach(item => {
      delete require.cache[item];
    });
  }

  function mockHttpClient({onServerUrl = fn}) {
    function httpClient() {
      return class HttpClient {
        constructor(serverUrl) {
          onServerUrl(serverUrl);
        }
      };
    }

    mockery.registerMock('./httpclient.js', httpClient);
  }

  function mockExecutor(results) {
    const {Executor, HttpClient} = require('selenium-webdriver/http');
    class MockExecutor extends Executor {
      async execute(command) {
        return Promise.resolve(results);
      }
    }

    deleteFromRequireCache('node_modules/selenium-webdriver/http');

    mockery.registerMock('selenium-webdriver/http', {
      Executor: MockExecutor,
      HttpClient
    });
  }

  function mockWebDriver({onSessionOpts = fn}) {
    const SeleniumWebdriver = require('selenium-webdriver');
    class MockWebDriver extends SeleniumWebdriver.WebDriver {
      static createSession(executor, options) {
        onSessionOpts(options);

        return Promise.resolve(mockDriver);
      }
    }

    deleteFromRequireCache('node_modules/selenium-webdriver');

    mockery.registerMock('selenium-webdriver', {
      ...SeleniumWebdriver,
      WebDriver: MockWebDriver
    });
  }


  function mockServiceBuilder({onConstruct = fn, onOpts = fn, onSetPort = fn}) {
    const remote = require('selenium-webdriver/remote');
    const {Options, SeleniumServer} = remote;

    deleteFromRequireCache('node_modules/selenium-webdriver/remote');

    class MockDriverService {
      constructor(command, opts) {
        onConstruct.call(this, command);

        if (opts.port) {
          onSetPort(opts.port);
        }

        onOpts(opts);
      }

      async start() {
        return {};
      }
    }

    mockery.registerMock('selenium-webdriver/remote', {
      Options,
      SeleniumServer,
      DriverService: MockDriverService
    });
  }

  async function AppiumServerTestSetup(useSettings, {onLogFile = fn} = {}) {
    const BaseService = common.require('transport/selenium-webdriver/service-builders/base-service.js');
    class MockBaseService extends BaseService {
      constructor(settings) {
        super(settings);

        this.setOutputFile('');

        assert.strictEqual(this.serviceName, 'Appium Server');
        assert.strictEqual(this.outputFile, '_appium-server.log');
        assert.strictEqual(this.defaultPort, 4723);
        assert.strictEqual(this.npmPackageName, 'appium');
        assert.strictEqual(this.serviceDownloadUrl, '');
        assert.strictEqual(this.downloadMessage, 'install Appium globally with "npm i -g appium" command, \n and set "selenium.server_path" config option to "appium".');
      }
      needsSinkProcess() {
        return true;
      }
      hasSinkSupport() {
        return true;
      }
      async writeLogFile() {
      }
      async createSinkProcess() {
        this.process = {
          kill: () => {}
        };
        const logPath = this.getLogPath();
        if (!logPath) {
          return true;
        }

        const filePath = this.getOutputFilePath();
        onLogFile(filePath);
      }
    }

    deleteFromRequireCache('transport/selenium-webdriver/service-builders/base-service.js');
    mockery.registerMock('./base-service.js', MockBaseService);

    let command;
    let serverPort;
    let serverUrl;
    let logFilePath;
    let buildOptions;
    let sessionOptions;

    mockServiceBuilder({
      onConstruct(cmd) {
        command = cmd;
      },

      onSetPort(p) {
        serverPort = p;
      },

      onOpts(o) {
        buildOptions = o;
      }
    });

    mockHttpClient({
      onServerUrl(url) {
        serverUrl = url;
      }
    });

    mockWebDriver({
      onSessionOpts(opts) {
        sessionOptions = opts;
      }
    });

    const settings = Settings.parse(useSettings);

    const client = NightwatchClient.client(settings, null, {});
    const {transport} = client;

    const session = await transport.createSession({argv: {}, moduleKey: 'testModuleKey'});

    return {
      session,
      command,
      serverPort,
      serverUrl,
      buildOptions,
      sessionOptions
    };
  }

  it('test create session with Appium', async function() {
    let logFilePath;
    const {session, command, serverPort, buildOptions, sessionOptions} = await AppiumServerTestSetup({
      desiredCapabilities: {
        browserName: '',
        'appium:options': {
          app: './sample.apk',
          chromedriverExecutable: './chromedriver'
        }
      },
      selenium: {
        port: 9999,
        isAppium: true,
        start_process: true,
        // server_path is only set automatically when server is started from cli.js
        server_path: '/path/to/appium/main.js'
      }
    }, {
      onLogFile(filePath) {
        logFilePath = filePath;
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111', capabilities: {}
    });
    assert.strictEqual(command, 'node');
    assert.strictEqual(serverPort, 9999);
    assert.strictEqual(buildOptions.port, 9999);
    assert.strictEqual(buildOptions.path, '/wd/hub');
    assert.deepStrictEqual(buildOptions.args, ['/path/to/appium/main.js', '--port', 9999]);
    assert.deepStrictEqual(buildOptions.stdio, ['pipe', undefined, undefined]);
    assert.strictEqual(sessionOptions.browserName, '');
    assert.strictEqual(sessionOptions['appium:app'], path.join(process.cwd(), 'sample.apk'));
    assert.strictEqual(sessionOptions['appium:chromedriverExecutable'], path.join(process.cwd(), 'chromedriver'));
    assert.strictEqual('appium:options' in sessionOptions, false);
    assert.ok(logFilePath.endsWith('testModuleKey_appium-server.log'));
  });

  it('test create session with globally installed appium 2 server', async function() {
    mockery.registerMock('chromedriver', {
      path: '/path/to/chromedriver'
    });

    let logFilePath;
    const {command, serverPort, buildOptions, sessionOptions} = await AppiumServerTestSetup({
      desiredCapabilities: {
        browserName: null,
        'appium:options': {
          app: 'sample.apk',
          chromedriverExecutable: ''
        }
      },
      selenium: {
        start_process: true,
        isAppium: true,
        server_path: 'appium',
        cli_args: [
          '--allow-insecure=chromedriver_autodownload'
        ],
        default_path_prefix: ''
      }
    }, {
      onLogFile(filePath) {
        logFilePath = filePath;
      }
    });

    assert.strictEqual(command, 'appium');
    assert.strictEqual(serverPort, 4723);
    assert.strictEqual(buildOptions.path, '');
    assert.deepStrictEqual(buildOptions.args, ['--allow-insecure=chromedriver_autodownload']);
    assert.deepStrictEqual(buildOptions.stdio, ['pipe', undefined, undefined]);
    assert.strictEqual(sessionOptions.browserName, null);
    assert.strictEqual(sessionOptions['appium:app'], 'sample.apk');
    assert.strictEqual(sessionOptions['appium:chromedriverExecutable'], '/path/to/chromedriver');
    assert.strictEqual('appium:options' in sessionOptions, false);
    assert.ok(logFilePath.endsWith('testModuleKey_appium-server.log'));
  });

  it('test create session with appium server -- externally managed', async function() {
    const {session, command, serverPort, serverUrl, buildOptions, sessionOptions} = await AppiumServerTestSetup({
      desiredCapabilities: {
        browserName: 'firefox',
        platformName: 'android',
        'appium:automationName': 'UiAutomator2'

      },
      selenium: {
        host: 'somewhere',
        port: '4725',
        start_process: false,
        isAppium: true
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111', capabilities: {}
    });
    // service not created
    assert.ok(!serverPort);
    assert.ok(!command);
    assert.ok(!buildOptions);
    // session assertions
    assert.strictEqual(serverUrl, 'http://somewhere:4725');
    assert.strictEqual(sessionOptions.browserName, 'firefox');
    assert.strictEqual(sessionOptions['appium:automationName'], 'UiAutomator2');
    assert.strictEqual(sessionOptions.platformName, 'android');
    assert.strictEqual('appium:options' in sessionOptions, false);
  });
});
