const assert = require('assert');
const mockery = require('mockery');
const common = require('../../common.js');
const NightwatchClient = common.require('index.js');
const Settings = common.require('settings/settings.js');
const HttpRequest = common.require('http/request.js');
const HttpClient = common.require('transport/selenium-webdriver/httpclient.js')({});

describe('GeckoDriver Transport Tests', function () {
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

  const RANDOM_PORT = 6732;
  
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
          return 'firefox';
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
        const httpClient =  new HttpClient(`http://localhost:${RANDOM_PORT}`);

        return Promise.resolve(mockDriver);
      }
    }

    return new MockBuilder();
  }

  function mockServiceBuilder({onConstruct = fn, onEnableVerboseLogging = fn, onAddArguments = fn, onSetPort = fn, onSetHostname = fn, onSetPath = fn}) {
    const firefox = require('selenium-webdriver/firefox');
    const {Options, ServiceBuilder} = firefox;

    deleteFromRequireCache('node_modules/selenium-webdriver/firefox');

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

      enableVerboseLogging(value) {
        onEnableVerboseLogging(value);

        return this;
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

    mockery.registerMock('selenium-webdriver/firefox', {
      Options,
      ServiceBuilder: MockServiceBuilder
    });
  }

  async function GeckoDriverTestSetup(useSettings, argv = {}) {
    const BaseService = common.require('transport/selenium-webdriver/service-builders/base-service.js');
    class MockBaseService extends BaseService {
      constructor(settings) {
        super(settings);

        this.setOutputFile('');

        assert.strictEqual(this.serviceName, 'GeckoDriver');
        assert.strictEqual(this.outputFile, '_geckodriver.log');
        assert.strictEqual(this.requiresDriverBinary, true);
        assert.strictEqual(this.defaultPort, undefined);
        assert.strictEqual(this.npmPackageName, 'geckodriver');
        assert.strictEqual(this.serviceDownloadUrl, 'https://github.com/mozilla/geckodriver/releases');
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
    let buildArgs;
    let verboseLogging;

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

      onEnableVerboseLogging(v) {
        verboseLogging = v;
      }
    });

    const Transport = common.require('transport/selenium-webdriver/firefox.js');
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
      verboseLogging
    };
  }

  it('test create session with firefox driver -- not found error', async function() {
    let error;
    mockery.registerMock('geckodriver', {
      path: ''
    });
    try {
      await GeckoDriverTestSetup({
        desiredCapabilities: {
          browserName: 'firefox'
        },
        webdriver: {
          port: 9999,
          start_process: true
        }
      });
    } catch (err) {
      error = err;
    }

    assert.ok(error instanceof Error);
    assert.strictEqual(error.message, 'GeckoDriver cannot be found in the current project.');
  });


  it('test create session with firefox driver', async function() {
    mockery.registerMock('geckodriver', {
      path: '/path/to/geckodriver'
    });

    const {session, serverPath, serverPort, verboseLogging} = await GeckoDriverTestSetup({
      desiredCapabilities: {
        browserName: 'firefox'
      },
      webdriver: {
        port: 9999,
        start_process: true
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111', capabilities: {}
    });
    assert.strictEqual(serverPath, '/path/to/geckodriver');
    assert.strictEqual(serverPort, 9999);
    assert.strictEqual(verboseLogging, true);
  });

  it('test create session with gecko driver -- random port', async function() {
    mockery.registerMock('geckodriver', {
      path: '/path/to/geckodriver'
    });

    const {session, serverPath, serverPort} = await GeckoDriverTestSetup({
      desiredCapabilities: {
        browserName: 'firefox'
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
    assert.strictEqual(serverPath, '/path/to/geckodriver');
    assert.strictEqual(serverPort, undefined);

    //Global port should be set to random assigned Port
    assert.strictEqual(HttpRequest.globalSettings.port, RANDOM_PORT);
  });
});
