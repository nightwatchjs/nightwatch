const assert = require('assert');
const common = require('../../common.js');
const Nightwatch = require('../../lib/nightwatch.js');
const HttpRequest = common.require('http/request.js');
const Settings = common.require('settings/settings.js');
const eq = assert.strictEqual;

describe('test Settings', function () {
  it('testSetOptions', function () {
    const client = Nightwatch.createClient({
      use_xpath: true,
      launch_url: '/home'
    });

    eq(client.locateStrategy, 'xpath');
    eq(client.options.use_xpath, true);
    eq(client.api.options.skip_testcases_on_fail, true);
    eq(client.api.launchUrl, '/home');
    eq(client.api.launch_url, '/home');
  });

  it('test set test_runner invalid value', function () {
    assert.throws(function() {
      const client = Nightwatch.createClient({
        test_runner: null
      });
    }, /Error: Invalid "test_runner" settings specified; received: null/);
  });

  it('test set test_runner invalid value - function', function () {
    assert.throws(function() {
      const client = Nightwatch.createClient({
        test_runner: function() {}
      });
    }, /Error: Invalid "test_runner" settings specified; received: function\(\) \{\}/);
  });

  it('test set test_runner string value', function () {

    const client = Nightwatch.createClient({
      test_runner: 'mocha'
    });

    assert.deepStrictEqual(client.settings.test_runner, {
      options: {},
      type: 'mocha'
    });
  });

  it('testSetWebdriverOptionsDefaults', function () {
    HttpRequest.globalSettings = {};
    const client = Nightwatch.createClientDefaults();

    eq(client.options.webdriver.host, 'localhost');
    eq(client.options.webdriver.port, 4444);
    eq(client.options.webdriver.ssl, false);

    eq(client.api.options.screenshots.enabled, false);
    eq(client.api.options.screenshots.path, '');

    eq(client.options.start_session, true);
    eq(client.options.end_session_on_fail, true);
  });

  it('testSetWebdriverOptions', function () {
    const client = Nightwatch.createClient({
      webdriver: {
        host: '127.0.0.1',
        ssl: false,
        port: 10195,
        timeout_options: {
          timeout: 10000,
          retry_attempts: 3
        },
        default_path_prefix: '',
        username: 'test-user',
        access_key: 'test-key'
      }
    });

    const HttpRequest = common.require('http/request.js');
    const request = new HttpRequest({});

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
      screenshots: {
        bla: false
      },
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

    const settings = Settings.parse({
      selenium: {
        start_process: false
      },
      selenium_host: 'localhost.org',
      selenium_port: 80
    });

    Nightwatch.client(settings, null);

    const HttpRequest = common.require('http/request.js');
    const request = new HttpRequest({});

    eq(request.reqOptions.port, 80);
  });

  it('test create Transport for remote with Firefox', function() {
    const Settings = common.require('settings/settings.js');

    const settings = Settings.parse({
      selenium: {
        start_process: false
      }
    }, {
      test_settings: {
        default: {},
        remote: {
          selenium_host: 'localhost.org',
          selenium_port: 8000
        }
      }
    }, {}, 'remote');

    assert.strictEqual(settings.webdriver.host, 'localhost.org');
    assert.strictEqual(settings.webdriver.port, 8000);
  });

  it('testSetOptionsCredentials', function () {
    const client = Nightwatch.createClient({
      username: 'test-user',
      accessKey: 'test-access-key'
    });

    eq(client.options.username, 'test-user');
    eq(client.api.options.username, 'test-user');
    eq(client.api.options.accessKey, 'test-access-key');
    eq(client.options.accessKey, 'test-access-key');
  });

  it('testEnableFailFast', function () {
    const client = Nightwatch.createClient({}, null, {
      'fail-fast': true
    });

    eq(client.options.enable_fail_fast, true);
  });

  it('testSetOptionsScreenshots – path empty', function () {
    const client = Nightwatch.createClient({
      screenshots: {
        enabled: true,
        path: ''
      },
      log_screenshot_data: true
    });

    eq(client.api.options.log_screenshot_data, true);
    eq(client.options.screenshots.on_error, true);
    eq(client.settings.screenshots.on_error, true);
    eq(client.settings.screenshots.path, '');
  });

  it('testSetOptionsScreenshots – path not empty', function () {
    const client = Nightwatch.createClient({
      screenshots: {
        enabled: true,
        path: '/tmp/'
      },
      log_screenshot_data: true
    });

    eq(client.api.options.log_screenshot_data, true);
    eq(client.options.screenshots.on_error, true);
    
    if (process.platform === 'win32') {
      assert.ok(client.settings.screenshots.path.endsWith('\\tmp'));
    } else {
      eq(client.settings.screenshots.path, '/tmp');
    }
  });


  it('testSetOptionsScreenshotsOnError', function () {
    const client = Nightwatch.createClient({
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
    const client = Nightwatch.createClient({
      screenshots: true
    });

    eq(client.settings.screenshots.enabled, true);
    eq(client.settings.screenshots.on_error, true);
    eq(client.settings.screenshots.on_failure, true);
    eq(client.settings.screenshots.path, '');
    assert.ok(client.settings.screenshots.filename_format().startsWith('_FAILED_'));
  });

  it('testEndSessionOnFail', function () {
    const client = Nightwatch.createClient({
      end_session_on_fail: true
    });

    eq(client.options.end_session_on_fail, true);
    client.endSessionOnFail(false);
    eq(client.endSessionOnFail(), false);
    eq(client.options.end_session_on_fail, false);
  });

  it('testSetRequestTimeoutOptions', function () {
    const client = Nightwatch.createClient({
      webdriver: {
        timeout_options: {
          timeout: 10000,
          retry_attempts: 5
        }
      }
    });

    assert.deepStrictEqual(client.options.webdriver.timeout_options, {
      timeout: 10000,
      retry_attempts: 5
    });


    const HttpRequest = common.require('http/request.js');
    const request = new HttpRequest({});

    assert.strictEqual(request.httpOpts.timeout, 10000);
    assert.strictEqual(request.retryAttempts, 5);
  });

  it('Test initialize with parallel cli argument', function () {
    const settings = Settings.parse({
      selenium_port: 10195,
      silent: false,
      output: false
    }, {}, {
      parallel: true
    });

    assert.strictEqual(settings.testWorkersEnabled, true);
  });
});

xit('recursive extends in test_settings', function () {

  const baseSettings = {
    test_settings: {
      browserstack: {
        selenium: {
          host: 'hub-cloud.browserstack.com',
          port: 443
        },
        desiredCapabilities: {
          'bstack:options': {
            local: 'false'
          }
        },
  
        disable_error_log: true,
        webdriver: {
          keep_alive: true,
          start_process: false
        }
      },
      'browserstack.chrome': {
        extends: 'browserstack',
        desiredCapabilities: {
          browserName: 'chrome',
          chromeOptions: {
            w3c: false
          }
        }
      },
      'browserstack.chrome_mac': {
        extends: 'browserstack.chrome',
        desiredCapabilities: {
          os: 'OS X'
        }
      }
    }
  };
  const expectedDesiredCapabilites = {
    os: 'OS X',
    browserName: 'chrome',
    chromeOptions: {
      w3c: false
    },
    'bstack:options': {
      local: 'false'
    }
  };
  const parsedSetting  = Settings.parse({}, baseSettings, {}, 'browserstack.chrome_mac');
  assert.strictEqual(parsedSetting.selenium.host, 'hub-cloud.browserstack.com');
  assert.strictEqual(parsedSetting.selenium.port, 443);
  assert.deepStrictEqual(parsedSetting.desiredCapabilities, expectedDesiredCapabilites);
  assert.deepStrictEqual(parsedSetting.desiredCapabilities.chromeOptions, {w3c: false});
});
