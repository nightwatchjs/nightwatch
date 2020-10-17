const assert = require('assert');
const common = require('../../common.js');
const Nightwatch = require('../../lib/nightwatch.js');
const HttpRequest = common.require('http/request.js');
const Settings = common.require('settings/settings.js');
const eq = assert.strictEqual;

describe('test Settings', function () {
  it('testSetOptions', function () {
    let client = Nightwatch.createClient({
      use_xpath: true,
      launch_url: '/home'
    });

    eq(client.locateStrategy, 'xpath');
    eq(client.options.use_xpath, true);
    eq(client.api.options.skip_testcases_on_fail, true);
    eq(client.api.launchUrl, '/home');
    eq(client.api.launch_url, '/home');
  });

  it('testSetWebdriverOptionsDefaults', function () {
    HttpRequest.globalSettings = {};
    let client = Nightwatch.createClientDefaults();

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

    let HttpRequest = common.require('http/request.js');
    let request = new HttpRequest({});

    eq(request.reqOptions.host, '127.0.0.1');
    eq(request.reqOptions.port, 10195);
    eq(request.hostname, '');
    eq(request.defaultPathPrefix, '');
  });

  it('test to overwrite webdriver settings programmatically', function() {
    const parsedSettings = Settings.parse({
      webdriver: {
        start_process: false,
        server_path: './bin/geckodriver',
        log_path: './logs'
      }
    }, {
      screenshots: {},
      test_settings: {
        default: {
          webdriver: {
            start_process: true,
            server_path: './bin/chromedriver',
            log_path: './logs',
            request_timeout_options: {
              retry_attempts: 1
            }
          }
        }
      }
    });

    assert.strictEqual(parsedSettings.webdriver.start_process, false);
    assert.strictEqual(parsedSettings.webdriver.server_path, './bin/geckodriver');
    assert.strictEqual(parsedSettings.webdriver.log_path, './logs');
    assert.deepStrictEqual(parsedSettings.webdriver.request_timeout_options, {
      retry_attempts: 1
    });
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

    let HttpRequest = common.require('http/request.js');
    let request = new HttpRequest({});

    eq(request.reqOptions.port, 80);
  });

  it('testSetOptionsCredentials', function () {
    let client = Nightwatch.createClient({
      username: 'test-user',
      accessKey: 'test-access-key'
    });

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

  it('Test initialize with parallel cli argument', function () {
    let settings = Settings.parse({
      selenium_port: 10195,
      silent: false,
      output: false
    }, {}, {
      parallel: true
    });

    assert.strictEqual(settings.testWorkersEnabled, true);
  });
});
