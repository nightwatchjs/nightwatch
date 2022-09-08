const assert = require('assert');
const mockery = require('mockery');
const common = require('../../common.js');
const NightwatchClient = common.require('index.js');
const Settings = common.require('settings/settings.js');
const path = require('path');

describe('SafariDriver Transport Tests', function () {
  beforeEach(function() {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
  });

  afterEach(function(){
    mockery.deregisterAll();
    mockery.disable();
    mockery.resetCache();
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


  function mockServiceBuilder({onConstruct = fn, onAddArguments = fn, onSetPort = fn, onSetHostname = fn, onSetPath = fn}) {
    const safari = require('selenium-webdriver/safari');
    const {Options, ServiceBuilder} = safari;

    deleteFromRequireCache('node_modules/selenium-webdriver/safari');

    class MockServiceBuilder /*extends ServiceBuilder*/ {
      constructor(server_path) {
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
            return 'http://localhost'
          }
        }
      }
    }

    mockery.registerMock('selenium-webdriver/safari', {
      Options,
      ServiceBuilder: MockServiceBuilder
    });
  }

  async function SafariTestSetup(useSettings, {onLogFile = fn} = {}) {
    mockExecutor({
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
            return 'safari';
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
    });

    const BaseService = common.require('transport/selenium-webdriver/service-builders/base-service.js');
    class MockBaseService extends BaseService {
      constructor(settings) {
        super(settings);

        this.setOutputFile('');

        assert.strictEqual(this.serviceName, 'SafariDriver');
        assert.strictEqual(this.outputFile, '_safaridriver.log');
        assert.strictEqual(this.requiresDriverBinary, false);
        assert.strictEqual(this.defaultPort, 0);
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

    const Transport = common.require('transport/selenium-webdriver/safari.js');
    const settings = Settings.parse(useSettings);

    const client = NightwatchClient.client(settings, null, {});
    const transport = new Transport(client, {browserName: 'safari'});

    const session = await transport.createSession({argv: {}, moduleKey: 'testModuleKey'});

    return {
      session,
      serverPath,
      serverPort
    }
  }

  it('test create session with safari driver', async function() {
    let logFilePath;
    const {session, serverPath, serverPort} = await SafariTestSetup({
      desiredCapabilities: {
        browserName: 'safari'
      },
      webdriver: {
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
    assert.strictEqual(serverPath, '/usr/bin/safaridriver');
    assert.strictEqual(serverPort, 9999);
    assert.ok(logFilePath.endsWith(`logs${path.sep}testModuleKey_safaridriver.log`), logFilePath);
  });

  it('test create session with safari driver -- random port', async function() {
    const {session, serverPath, serverPort} = await SafariTestSetup({
      desiredCapabilities: {
        browserName: 'safari'
      },
      webdriver: {
        start_process: true
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111', capabilities: {}
    });
    assert.strictEqual(serverPath, '/usr/bin/safaridriver');
    assert.strictEqual(serverPort, undefined);
  });

  it('test create session with safari driver using technologyPreview', async function() {
    const {session, serverPath} = await SafariTestSetup({
      desiredCapabilities: {
        browserName: 'safari',
        'safari.options': {
          technologyPreview: true
        }
      },
      webdriver: {
        port: 9999,
        start_process: true
      }
    });

    assert.deepStrictEqual(session, {
      sessionId: '1111', capabilities: {}
    });
    assert.strictEqual(serverPath, '/Applications/Safari Technology Preview.app/Contents/MacOS/safaridriver');
  });
});
