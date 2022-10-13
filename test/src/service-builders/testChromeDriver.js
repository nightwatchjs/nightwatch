const assert = require('assert');
const mockery = require('mockery');
const common = require('../../common.js');
const NightwatchClient = common.require('index.js');
const Settings = common.require('settings/settings.js');

describe('ChromeDriver Transport Tests', function () {
  beforeEach(function() {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});

    const {constants, rmdirSync} = require('fs');

    delete require.cache['fs'];

    mockery.registerMock('fs', {
      existsSync() {
        return true;
      },
      constants,
      rmdirSync,
      readFileSync() {
        return true;
      }
    });

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

  function createMockDriverBuilder() {
    const {Builder} = require('selenium-webdriver');
    class MockBuilder extends Builder {
      build() {
        return Promise.resolve(mockDriver);
      }
    }

    return new MockBuilder();
  }

  function mockServiceBuilder({onConstruct = fn, onAddArguments = fn, onSetPort = fn, onSetHostname = fn, onSetPath = fn}) {
    const chrome = require('selenium-webdriver/chrome');
    const {Options, ServiceBuilder} = chrome;

    deleteFromRequireCache('node_modules/selenium-webdriver/chrome');

    class MockServiceBuilder extends ServiceBuilder {
      constructor(server_path) {
        super(server_path);

        onConstruct.call(this, server_path);
      }

      setPort(port) {
        onSetPort(port);
      }

      setHostname(h) {
        onSetHostname(h);
      }

      setPath(h) {
        onSetPath(h);
      }

      addArguments(args) {
        onAddArguments(args);
      }

      build() {
        return {
          kill() {

          },
          async start() {
            return 'http://localhost';
          }
        };
      }
    }

    mockery.registerMock('selenium-webdriver/chrome', {
      Options,
      ServiceBuilder: MockServiceBuilder
    });
  }

  async function ChromeDriverTestSetup(useSettings, argv = {}) {
    const BaseService = common.require('transport/selenium-webdriver/service-builders/base-service.js');
    class MockBaseService extends BaseService {
      constructor(settings) {
        super(settings);

        this.setOutputFile('');

        assert.strictEqual(this.serviceName, 'ChromeDriver');
        assert.strictEqual(this.outputFile, '_chromedriver.log');
        assert.strictEqual(this.requiresDriverBinary, true);
        assert.strictEqual(this.defaultPort, undefined);
        assert.strictEqual(this.npmPackageName, 'chromedriver');
        assert.strictEqual(this.serviceDownloadUrl, 'https://sites.google.com/chromium.org/driver/downloads');
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

      }
    }

    deleteFromRequireCache('transport/selenium-webdriver/service-builders/base-service.js');
    mockery.registerMock('./base-service.js', MockBaseService);

    let serverPath;
    let serverPort;
    let buildArgs = [];
    let logFilePath;

    mockServiceBuilder({
      onConstruct(server_path) {
        serverPath = server_path;
      },

      onAddArguments(args) {
        buildArgs.push(args);
      },

      onSetPort(p) {
        serverPort = p;
      }
    });

    const settings = Settings.parse(useSettings);

    const client = NightwatchClient.client(settings, null, argv);
    const {transport} = client;
    transport.createSessionBuilder = function() {
      return createMockDriverBuilder();
    };

    const session = await transport.createSession({argv: {}, moduleKey: 'testModuleKey'});

    return {
      session,
      serverPath,
      serverPort,
      buildArgs
    };
  }

  it('test create session with chrome driver -- not found error', async function() {
    let error;
    try {
      const mockery = require('mockery');
      mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
      mockery.registerMock('chromedriver', null);

      await ChromeDriverTestSetup({
        desiredCapabilities: {
          browserName: 'chrome'
        },
        webdriver: {
          port: 9999,
          start_process: true
        }
      });
      mockery.disable();
    } catch (err) {
      error = err;
    }

    assert.ok(error instanceof Error);
    assert.strictEqual(error.message, 'ChromeDriver cannot be found in the current project.');
  });


  it('test create session with chrome driver', async function() {
    mockery.registerMock('chromedriver', {
      path: '/path/to/chromedriver'
    });

    const {session, serverPath, serverPort} = await ChromeDriverTestSetup({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      webdriver: {
        port: 9999,
        start_process: true
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111', capabilities: {}
    });
    assert.strictEqual(serverPath, '/path/to/chromedriver');
    assert.strictEqual(serverPort, 9999);
  });

  it('test create session with chrome driver -- random port', async function() {
    mockery.registerMock('chromedriver', {
      path: '/path/to/chromedriver'
    });

    const {session, serverPath, serverPort} = await ChromeDriverTestSetup({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      webdriver: {
        start_process: true
      }
    }, {
      parallel: true
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111', capabilities: {}
    });
    assert.strictEqual(serverPath, '/path/to/chromedriver');
    assert.strictEqual(serverPort, undefined);
  });

  it('test chrome logging is absent in creating session with chrome driver on windows', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32'
    });

    mockery.registerMock('chromedriver', {
      path: '/path/to/chromedriver'
    });

    const {session, serverPath, serverPort, buildArgs} = await ChromeDriverTestSetup({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      webdriver: {
        port: 9999,
        start_process: true
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111',
      capabilities: {}
    });
    assert.strictEqual(serverPath, '/path/to/chromedriver');
    assert.strictEqual(serverPort, 9999);
    assert.deepStrictEqual(buildArgs, ['--verbose']);
  });

  it('test chrome logging is present in creating session with chrome driver on mac', async () => {
    const platform = process.platform;
    Object.defineProperty(process, 'platform', {
      value: 'darwin'
    });

    mockery.registerMock('chromedriver', {
      path: '/path/to/chromedriver'
    });

    const {session, serverPath, serverPort, buildArgs} = await ChromeDriverTestSetup({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      webdriver: {
        port: 9999,
        start_process: true
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111',
      capabilities: {}
    });
    assert.strictEqual(serverPath, '/path/to/chromedriver');
    assert.strictEqual(serverPort, 9999);
    assert.deepStrictEqual(buildArgs, ['--verbose', '--enable-chrome-logs']);

    Object.defineProperty(process, 'platform', {
      value: platform
    });
  });
});
