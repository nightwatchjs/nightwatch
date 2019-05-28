const assert = require('assert');
const path = require('path');
const common = require('../../common.js');
const MockServer = require('../../lib/mockserver.js');
const Nightwatch = require('../../lib/nightwatch.js');
const HttpRequest = common.require('http/request.js');

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
    let client = Nightwatch.createClient({
      silent: false,
      output: false
    });

    client.on('nightwatch:session.create', function (data) {
      assert.equal(client.api.sessionId, 1352110219202, 'Testing if session ID was set correctly');
      assert.equal(client.api.capabilities.browserName, 'firefox');
      done();
    });

    client.startSession().catch(err => done(err));
  });

  it('testChromeSessionWithRedirectStatus', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session',

      postdata: JSON.stringify({
        desiredCapabilities: {
          browserName: 'chrome',
          acceptSslCerts: true,
          platform: 'ANY'
        }
      }),

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

    let client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      silent: false,
      output: false
    });

    client.on('nightwatch:session.create', function (data) {
      assert.equal(data.sessionId, 1352110219202);
      assert.equal(client.api.capabilities.browserName, 'chrome');
      done();
    });

    client.startSession().catch(err => done(err));
  });

  it('test new Chrome session with wrong driver version error message', function (done) {
    MockServer.addMock({
      url: '/session',

      postdata: {
        desiredCapabilities: {
          browserName: 'chrome',
          acceptSslCerts: true,
          platform: 'ANY'
        }
      },

      response: {
        sessionId: '8abea23aaa6bca9eb83f8f7c0f0cb17e',
        status: 33,
        value: {
          message: 'session not created: This version of ChromeDriver only supports Chrome version 75',
          error: [
            '  (Driver info: chromedriver=75.0.3770.8 (681f24ea911fe754973dda2fdc6d2a2e159dd300-refs/branch-heads/3770@{#40}),platform=Mac OS X 10.14.4 x86_64)' ]
        }
      },
      statusCode: 200,
      method: 'POST'
    }, true);

    let client = Nightwatch.createClient({
      selenium: {
        start_process: false
      },
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'chrome'
      },
      silent: false,
      output: false
    });

    client.startSession().catch(err => {
      assert.ok(err instanceof Error);
      assert.equal(err.message, 'An error occurred while retrieving a new session: "session not created: This version of ChromeDriver only supports Chrome version 75"');
      done();
    });
  });

  it('test createSession on Selenium Grid with Firefox', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session',

      postdata: JSON.stringify({
        desiredCapabilities: {
          browserName: 'firefox',
          acceptSslCerts: true,
          platform: 'TEST'
        }
      }),

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

    let client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'firefox',
        platform: 'TEST'
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
        assert.equal(data.sessionId, 'abc-123456');
        assert.equal(client.api.capabilities.browserName, 'firefox');
        done();
      })
      .catch(err => done(err));
  });

  it('testSetOptions', function () {
    let client = Nightwatch.createClient({
      use_xpath: true,
      launch_url: '/home'
    });
    let eq = assert.equal;

    eq(client.locateStrategy, 'xpath');
    eq(client.options.use_xpath, true);
    eq(client.api.options.skip_testcases_on_fail, true);
    eq(client.api.launchUrl, '/home');
    eq(client.api.launch_url, '/home');
  });

  it('testSetWebdriverOptionsDefaults', function () {
    HttpRequest.globalSettings = {};
    let client = Nightwatch.createClientDefaults();
    let eq = assert.equal;

    eq(client.options.webdriver.host, 'localhost');
    eq(client.options.webdriver.port, 4444);
    eq(client.options.webdriver.ssl, false);

    assert.deepEqual(client.api.options.screenshots, {enabled: false, path: ''});

    eq(client.options.start_session, true);
    eq(client.options.end_session_on_fail, true);
  });

  it('testSetWebdriverOptions', function () {
    let client = Nightwatch.createClient({
      webdriver: {
        host: '127.0.0.1',
        ssl: false,
        timeout_options: {
          timeout: 10000,
          retry_attempts: 3
        },
        default_path_prefix: '',
        username: 'test-user',
        access_key: 'test-key'
      }
    });

    let eq = assert.equal;
    let HttpRequest = common.require('http/request.js');
    let request = new HttpRequest({});

    eq(request.reqOptions.host, '127.0.0.1');
    eq(request.reqOptions.port, 10195);
    eq(request.hostname, '');
    eq(request.defaultPathPrefix, '');
  });

  it('testSetSeleniumPort', function () {
    const Nightwatch = common.require('index.js');
    const Settings = common.require('settings/settings.js');

    let settings = Settings.parse({
      selenium : {
        start_process: false
      },
      selenium_host: 'localhost.org',
      selenium_port: 80
    });

    Nightwatch.client(settings, null);

    let eq = assert.equal;
    let HttpRequest = common.require('http/request.js');
    let request = new HttpRequest({});

    eq(request.reqOptions.port, 80);
  });

  it('testSetOptionsCredentials', function () {
    let client = Nightwatch.createClient({
      username: 'test-user',
      accessKey: 'test-access-key'
    });

    let eq = assert.equal;

    eq(client.options.username, 'test-user');
    eq(client.api.options.username, 'test-user');
    eq(client.api.options.accessKey, 'test-access-key');
    eq(client.options.accessKey, 'test-access-key');
  });

  it('testSetOptionsScreenshots', function () {
    let client = Nightwatch.createClient({
      screenshots: {
        enabled: true,
        path: ''
      },
      log_screenshot_data: true
    });
    let eq = assert.equal;

    eq(client.api.options.log_screenshot_data, true);
    eq(client.options.screenshots.on_error, true);
    eq(client.api.options.screenshotsPath, '');
  });

  it('testSetOptionsScreenshotsOnError', function () {
    let client = Nightwatch.createClient({
      screenshots: {
        enabled: true,
        on_error: true,
        path: ''
      },
      log_screenshot_data: true
    });
    let eq = assert.equal;

    eq(client.options.screenshots.on_error, true);
  });

  it('testSetOptionsScreenshotsThrows', function () {
    assert.throws(function () {
      Nightwatch.createClient({
        screenshots: {
          enabled: true
        }
      });
    });
  });

  it('testEndSessionOnFail', function () {
    let client = Nightwatch.createClient({
      end_session_on_fail: true
    });

    let eq = assert.equal;
    eq(client.options.end_session_on_fail, true);
    eq(client.session.endSessionOnFail, true);

    client.endSessionOnFail(false);
    eq(client.endSessionOnFail(), false);
    eq(client.options.end_session_on_fail, false);
    eq(client.session.endSessionOnFail, false);
  });

  it('testSetRequestTimeoutOptions', function () {
    let client = Nightwatch.createClient({
      request_timeout_options: {
        timeout: 10000,
        retry_attempts: 3
      }
    });

    assert.deepEqual(client.options.request_timeout_options, {
      timeout: 10000,
      retry_attempts: 3
    });

    assert.deepEqual(client.options.webdriver.timeout_options, {
      timeout: 10000,
      retry_attempts: 3
    });


    let HttpRequest = common.require('http/request.js');
    let request = new HttpRequest({});

    assert.equal(request.httpOpts.timeout, 10000);
    assert.equal(request.retryAttempts, 3);
  });

  it('test session response with status success and no sessionId', function (done) {
    MockServer.addMock({
      url: '/wd/hub/session',
      postdata: JSON.stringify({
        desiredCapabilities: {
          browserName: 'safari',
          acceptSslCerts: true,
          platform: 'ANY'
        }
      }),
      response: '{"value":{"message":"Could not find device : iPhone 6"}}',
      statusCode: 200,
      method: 'POST'
    }, true);

    let client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'safari'
      },
      silent: true,
      output: false
    });

    client.startSession().catch(err => {
      assert.ok(err instanceof Error);
      assert.equal(typeof err.data, 'string');
      assert.deepEqual(JSON.parse(err.data), {message: 'Could not find device : iPhone 6', error: []});
      assert.ok(err.message.indexOf('Could not find device : iPhone 6') > 0);
      done();
    }).catch(err => done(err));
  });

  it('test runner API', function(done) {
    const Nightwatch = common.require('index.js');
    const CliRunner = common.require('runner/cli/cli.js');
    const init = CliRunner.prototype.initTestSettings;
    CliRunner.prototype.initTestSettings = function(opts = {}, baseSettings = null, argv = null, testEnv = null) {
      assert.deepEqual(argv, {
        config: path.resolve('./test/extra/nightwatch.json'),
        verbose: true,
        reporter: 'junit',
        source: 'test.js',
        _source: 'test.js'
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
