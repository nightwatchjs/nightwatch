const assert = require('assert');
const path = require('path');
const MockServer = require('../../lib/mockserver.js');
const common = require('../../common.js');
const Nightwatch = require('../../lib/nightwatch.js');

describe('test NightwatchIndex', function () {
  beforeEach(function (done) {
    this.server = MockServer.init();
    this.server.on('listening', function () {
      done();
    });
  });

  afterEach(function (done) {
    this.server.close(function () {
      done();
    });
  });

  it('Test initialization', function (done) {
    const client = Nightwatch.createClient({
      silent: false,
      output: false
    });

    client.on('nightwatch:session.create', function (data) {
      assert.strictEqual(client.api.sessionId, '1352110219202', 'Testing if session ID was set correctly');
      assert.strictEqual(client.api.capabilities.browserName, 'firefox');
      done();
    });

    client.startSession().catch(err => done(err));
  });

  it('testChromeSessionWithRedirectStatus', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session',

      postdata: {
        capabilities: {firstMatch: [{}], alwaysMatch: {browserName: 'chrome', 'goog:chromeOptions': {}}}
      },

      responseHeaders: {
        location: 'http://localhost:10195/wd/hub/session/1352110219202'
      },
      statusCode: 302,
      method: 'POST'
    }, true);

    MockServer.addMock({
      url: '/wd/hub/session/1352110219202',
      response: JSON.stringify({
        status: 0,
        sessionId: '1352110219202',
        value: {browserName: 'chrome'},
        state: null
      }),
      responseHeaders: {
        statusCode: 201
      },
      method: 'GET'
    }, true);

    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      silent: false,
      output: false
    });

    client.on('nightwatch:session.create', function (data) {
      assert.strictEqual(data.sessionId, '1352110219202');
      assert.strictEqual(client.api.capabilities.browserName, 'chrome');
      done();
    });

    client.startSession().catch(err => {
      done(err);
    });
  });

  it('testChromeSessionWithRelativeRedirectUrl', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session',
      responseHeaders: {
        location: '/wd/hub/session/1352110219203'
      },
      statusCode: 302,
      method: 'POST'
    }, true);

    MockServer.addMock({
      url: '/wd/hub/session/1352110219203',
      response: JSON.stringify({
        status: 0,
        sessionId: '1352110219203',
        value: {browserName: 'chrome'}
      }),
      responseHeaders: {
        statusCode: 201
      },
      method: 'GET'
    }, true);


    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      silent: false,
      output: false
    });

    client.on('nightwatch:session.create', function (data) {
      assert.strictEqual(data.sessionId, '1352110219203');
      assert.strictEqual(client.api.capabilities.browserName, 'chrome');
      done();
    });

    client.startSession().catch(err => {
      done(err);
    });
  });

  it('test new Chrome session with wrong driver version error message', function () {
    MockServer.addMock({
      url: '/session',
      response: {
        sessionId: '8abea23aaa6bca9eb83f8f7c0f0cb17e',
        status: 33,
        value: {
          message: 'session not created: This version of ChromeDriver only supports Chrome version 75',
          error: [
            '  (Driver info: chromedriver=75.0.3770.8 (681f24ea911fe754973dda2fdc6d2a2e159dd300-refs/branch-heads/3770@{#40}),platform=Mac OS X 10.14.4 x86_64)']
        }
      },
      statusCode: 200,
      method: 'POST'
    }, true);

    const client = Nightwatch.createClient({
      selenium: {
        start_process: false,
        host: null
      },
      webdriver: {
        start_process: false,
        host: 'localhost',
        port: '10195'
      },
      desiredCapabilities: {
        browserName: 'chrome'
      },
      silent: false,
      output: false
    });

    return client.startSession().catch(err => {
      assert.ok(err instanceof Error);
      assert.strictEqual(err.message, 'An error occurred while creating a new ChromeDriver session: [SessionNotCreatedError] session not created: This version of ChromeDriver only supports Chrome version 75');
    });
  });

  it('test createSession on Selenium Grid with Firefox', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session',
      response: JSON.stringify({
        platform: 'TEST',
        value: {
          sessionId: 'abc-123456',
          capabilities: {
            acceptInsecureCerts: true,
            browserName: 'firefox',
            browserVersion: '60.0.2'
          }
        }
      }),
      statusCode: 200,
      method: 'POST'
    }, true);

    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'firefox',
        platform: 'TEST',
        'nightwatch:options': {
          name: 'selenium-test'
        }
      },
      selenium_host: 'localhost',
      selenium_port: 10195,
      silent: false,
      output: false,
      selenium: {
        version2: false,
        start_process: false
      }
    });

    client.createSession()
      .then(data => {
        assert.strictEqual(data.sessionId, 'abc-123456');
        assert.strictEqual(client.api.capabilities.browserName, 'firefox');
        done();
      })
      .catch(err => done(err));
  });

  it('test session response with status success and no sessionId', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session',
      response: '{"value":{"message":"Could not find device : iPhone 6"}}',
      statusCode: 200,
      method: 'POST'
    }, true);

    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'safari'
      },
      silent: true,
      output: false
    });

    client.startSession().catch(err => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes('Could not find device : iPhone 6'));
      done();
    }).catch(err => done(err));
  });

  it('test create Transport for with browserName disabled', function() {
    const Nightwatch = common.require('index.js');
    const client = Nightwatch.client({
      selenium: {
        start_process: false
      },
      webdriver: {},
      desiredCapabilities: {
        browserName: null
      },
      selenium_host: 'remote.url'
    });

    assert.strictEqual(client.options.desiredCapabilities.browserName, null);
  });


  it('test runner API', function(done) {
    const Nightwatch = common.require('index.js');
    const CliRunner = common.require('runner/cli/cli.js');
    const init = CliRunner.prototype.initTestSettings;
    CliRunner.prototype.initTestSettings = function(opts = {}, baseSettings = null, argv = null, testEnv = null) {
      assert.deepStrictEqual(argv, {
        config: path.resolve('./test/extra/nightwatch.json'),
        verbose: true,
        reporter: ['junit', 'json', 'html'],
        source: 'test.js',
        _source: ['test.js']
      });

      init.call(this, opts, baseSettings, argv, testEnv);
    };

    Nightwatch.runner({
      config: './test/extra/nightwatch.json',
      verbose: true,
      source: 'test.js'
    }, function(err) {
      CliRunner.prototype.initTestSettings = init;
      done();
    });
  });
});
