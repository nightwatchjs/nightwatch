const assert = require('assert');
const mockery = require('mockery');
const common = require('../../common.js');
const NightwatchClient = common.require('index.js');
const Settings = common.require('settings/settings.js');

describe('SeleniumServer Transport Tests', function () {
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
      return '1111'
    },
    getCapabilities() {
      return {
        getPlatform() {
          return 'MAC'
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
      }
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
      }
    }
  }

  const fn = function() {};
  function deleteFromRequireCache(location) {
    const entry = Object.keys(require.cache).filter(item => {
      return item.includes(location);
    });

    entry.forEach(item => {
      delete require.cache[item];
    });
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

  function createMockDriverBuilder() {
    const {Builder} = require('selenium-webdriver');
    class MockBuilder extends Builder {
      build() {
        return Promise.resolve(mockDriver);
      }
    }

    return new MockBuilder();
  }


  function mockServiceBuilder({onConstruct = fn, onOpts = fn, onSetPort = fn}) {
    const remote = require('selenium-webdriver/remote');
    const {Options, SeleniumServer, DriverService} = remote;

    deleteFromRequireCache('node_modules/selenium-webdriver/remote');

    class MockSeleniumServer {
      constructor(jar, opts) {
        onConstruct.call(this, jar);
        if (opts.port) {
          onSetPort(opts.port);
        }
        onOpts(opts);
      }

      async start() {
        return {}
      }
    }

    class MockDriverService {
      constructor(command, opts) {
        onConstruct.call(this, command);

        if (opts.port) {
          onSetPort(opts.port);
        }

        onOpts(opts);
      }

      async start() {
        return {}
      }
    }

    MockSeleniumServer.Options = SeleniumServer.Options;

    mockery.registerMock('selenium-webdriver/remote', {
      Options,
      SeleniumServer: MockSeleniumServer,
      DriverService: MockDriverService
    });
  }

  async function SeleniumServerTestSetup(useSettings, {selenium4 = false, onLogFile = fn} = {}) {
    const BaseService = common.require('transport/selenium-webdriver/service-builders/base-service.js');
    class MockBaseService extends BaseService {
      constructor(settings) {
        super(settings);

        this.setOutputFile('');

        assert.strictEqual(this.serviceName, 'Selenium Server');
        assert.strictEqual(this.outputFile, '_selenium-server.log');
        assert.strictEqual(this.defaultPort, 4444);
        assert.strictEqual(this.usingSelenium4(), selenium4);
        assert.strictEqual(this.npmPackageName, '@nightwatch/selenium-server');
        assert.strictEqual(this.serviceDownloadUrl, 'https://selenium.dev/download/');
        assert.strictEqual(this.downloadMessage, 'download the selenium server jar from https://selenium.dev/download/, \n and set "selenium.server_path" config option to point to the jar file.');
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

    let serverPath;
    let serverPort;
    let buildArgs;
    let logFilePath;
    let options;

    mockServiceBuilder({
      onConstruct(server_path) {
        serverPath = server_path;
      },

      onAddArguments(args) {
        buildArgs = args;
      },

      onSetPort(p) {
        serverPort = p;
      },

      onOpts(o) {
        options = o;
      }
    });

    const settings = Settings.parse(useSettings);

    const client = NightwatchClient.client(settings, null, {});
    const {transport} = client;
    transport.createSessionBuilder = function() {
      return createMockDriverBuilder();
    };

    const session = await transport.createSession({argv: {}, moduleKey: 'testModuleKey'});

    return {
      session,
      serverPath,
      serverPort,
      options
    }
  }

  it('test create session with selenium server 3', async function() {
    mockery.registerMock('geckodriver', {
      path: ''
    });

    mockery.registerMock('chromedriver', {
      path: ''
    });

    mockery.registerMock('@nightwatch/selenium-server', {
      path: '/path/to/selenium-server-standalone.3.0.jar'
    });

    let logFilePath;
    const {session, serverPath, serverPort, options} = await SeleniumServerTestSetup({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium: {
        port: 9999,
        start_process: true
      }
    }, {
      onLogFile(filePath) {
        logFilePath = filePath;
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111', capabilities: {}
    });
    assert.strictEqual(serverPath, '/path/to/selenium-server-standalone.3.0.jar');
    assert.strictEqual(serverPort, 9999);
    assert.strictEqual(options.port, 9999);
    assert.deepStrictEqual(options.args, []);
    assert.deepStrictEqual(options.jvmArgs, []);
    assert.deepStrictEqual(options.stdio, ['pipe', undefined, undefined]);
    assert.ok(logFilePath.endsWith('testModuleKey_selenium-server.log'));
  });

  it('test create session with selenium server 3 -- with drivers', async function() {
    mockery.registerMock('geckodriver', {
      path: '/path/to/geckodriver'
    });

    mockery.registerMock('chromedriver', {
      path: '/path/to/chromedriver'
    });

    mockery.registerMock('@nightwatch/selenium-server', {
      path: '/path/to/selenium-server-standalone.3.0.jar'
    });

    let logFilePath;
    const {session, serverPath, serverPort, options} = await SeleniumServerTestSetup({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium: {
        port: 9999,
        start_process: true,
        cli_args: {
          '-timeout': 1000
        }
      }
    }, {
      onLogFile(filePath) {
        logFilePath = filePath;
      }
    });

    assert.strictEqual(serverPath, '/path/to/selenium-server-standalone.3.0.jar');
    assert.deepStrictEqual(options.args, ['-timeout', 1000]);
    assert.deepStrictEqual(options.jvmArgs,  [
      '-Dwebdriver.gecko.driver=/path/to/geckodriver',
      '-Dwebdriver.chrome.driver=/path/to/chromedriver'
    ]);
    assert.deepStrictEqual(options.stdio, ['pipe', undefined, undefined]);
    assert.ok(logFilePath.endsWith('testModuleKey_selenium-server.log'));
  });

  it('test create session with selenium server 3 -- random port', async function() {
    mockery.registerMock('@nightwatch/selenium-server', {
      path: '/path/to/selenium-server-standalone.3.0.jar'
    });

    const {session, serverPath, serverPort} = await SeleniumServerTestSetup({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium: {
        port: null,
        start_process: true
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111', capabilities: {}
    });
    assert.strictEqual(serverPath, '/path/to/selenium-server-standalone.3.0.jar');
    assert.ok(!!serverPort);
  });

  it('test create session with selenium server 4 -- and no drivers', async function() {
    mockery.registerMock('geckodriver', {
      path: ''
    });

    mockery.registerMock('chromedriver', {
      path: ''
    });

    mockery.registerMock('@nightwatch/selenium-server', {
      path: '/path/to/selenium-server.4.0.jar'
    });

    let logFilePath;
    const {session, serverPath, serverPort, options} = await SeleniumServerTestSetup({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium: {
        port: 9999,
        command: 'standalone',
        start_process: true,
        cli_args: {
          '--allow-cors': true
        }
      }
    }, {
      selenium4: true,
      onLogFile(filePath) {
        logFilePath = filePath;
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111', capabilities: {}
    });

    assert.strictEqual(serverPort, 9999);
    assert.strictEqual(options.port, 9999);
    assert.strictEqual(options.path, '/wd/hub');

    assert.deepStrictEqual(options.args, [
      '-jar',
      '/path/to/selenium-server.4.0.jar',
      'standalone',
      '--port',
      9999,
      '--allow-cors',
      true
    ]);

    assert.deepStrictEqual(options.stdio, ['pipe', undefined, undefined]);
  });
});
