const assert = require('assert');
const mockery = require('mockery');
const common = require('../../common.js');
const NightwatchClient = common.require('index.js');
const Settings = common.require('settings/settings.js');

describe('EdgeDriver Transport Tests', function () {
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
      return '1111'
    },
    getCapabilities() {
      return {
        getPlatform() {
          return 'MAC'
        },
        getBrowserName() {
          return 'MicrosoftEdge';
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
    const edge = require('selenium-webdriver/edge');
    const {Options, ServiceBuilder} = edge;

    deleteFromRequireCache('node_modules/selenium-webdriver/edge');

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

      enableChromeLogging() {
        return this;
      }

      enableVerboseLogging() {
        return this;
      }

      build() {
        return {
          kill() {

          },
          async start() {
            return 'http://localhost'
          }
        }
      }
    }

    mockery.registerMock('selenium-webdriver/edge', {
      Options,
      ServiceBuilder: MockServiceBuilder
    });
  }

  async function EdgeDriverTestSetup(useSettings, argv = {}) {
    const BaseService = common.require('transport/selenium-webdriver/service-builders/base-service.js');
    class MockBaseService extends BaseService {
      constructor(settings) {
        super(settings);

        this.setOutputFile('');

        assert.strictEqual(this.serviceName, 'EdgeDriver');
        assert.strictEqual(this.outputFile, '_msedgedriver.log');
        assert.strictEqual(this.defaultPort, undefined);
        assert.strictEqual(this.npmPackageName, null);
        assert.strictEqual(this.serviceDownloadUrl, 'https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/');
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
    let logFilePath;

    mockServiceBuilder({
      onConstruct(server_path) {
        serverPath = server_path;
      },

      onAddArguments(args) {
        buildArgs = args;
      },

      onSetPort(p) {
        serverPort = p;
      }
    });

    const Transport = common.require('transport/selenium-webdriver/edge.js');
    const settings = Settings.parse(useSettings);

    const client = NightwatchClient.client(settings, null, argv);
    const {transport} = client;
    //const transport = new Transport(client, 'MicrosoftEdge');
    transport.createSessionBuilder = function() {
      return createMockDriverBuilder();
    };

    const session = await transport.createSession({argv: {}, moduleKey: 'testModuleKey'});

    return {
      session,
      serverPath,
      serverPort
    }
  }

  it('test create session with edge driver -- not found error', async function() {
    let error;
    try {
      await EdgeDriverTestSetup({
        desiredCapabilities: {
          browserName: 'MicrosoftEdge'
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
    assert.strictEqual(error.message, 'EdgeDriver cannot be found in the current project.');
  });


  it('test create session with edge driver', async function() {
    const {session, serverPath, serverPort} = await EdgeDriverTestSetup({
      desiredCapabilities: {
        browserName: 'MicrosoftEdge'
      },
      webdriver: {
        port: 9999,
        start_process: true,
        server_path: '/path/to/edgedriver'
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111', capabilities: {}
    });
    assert.strictEqual(serverPath, '/path/to/edgedriver');
    assert.strictEqual(serverPort, 9999);
  });

  it('test create session with edge driver -- random port', async function() {
    const {session, serverPath, serverPort} = await EdgeDriverTestSetup({
      desiredCapabilities: {
        browserName: 'MicrosoftEdge'
      },
      webdriver: {
        start_process: true,
        server_path: '/path/to/edgedriver'
      }
    }, {parallel: true});

    assert.deepStrictEqual(session, {
      sessionId: '1111', capabilities: {}
    });
    assert.strictEqual(serverPath, '/path/to/edgedriver');
    assert.strictEqual(serverPort, undefined);
  });

});
