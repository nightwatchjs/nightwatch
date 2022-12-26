const assert = require('assert');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');
const Appium = common.require('transport/selenium-webdriver/appium.js');


describe('AppiumTransport', function () {
  it('test create Transport for Appium external',  function(){
    const client = NightwatchClient.client({
      selenium: {
        start_process: false,
        use_appium: true,
        host: 'remote.host',
        port: 443
      },
      webdriver: {
        start_process: false
      },
      output: true,
      silent: false,
      desiredCapabilities: {
        browserName: '',
        platformName: 'iOS',
        platformVersion: '15.5',
        deviceName: 'iPhone 13'
      }
    });

    assert.ok(client.transport instanceof Appium);
    assert.strictEqual(client.settings.webdriver.host, 'remote.host');
    assert.strictEqual(client.settings.webdriver.port, 443);
    assert.strictEqual(client.settings.webdriver.ssl, true);
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.start_process, false);
    assert.strictEqual(client.transport.desiredCapabilities.browserName, '');
  });

  it('test create Transport for Appium managed with Firefox',  function(){
    const client = NightwatchClient.client({
      selenium: {
        start_process: true,
        use_appium: true
      },
      webdriver: {
        start_process: false
      },
      output: true,
      silent: false,
      desiredCapabilities: {
        browserName: 'firefox',
        platformName: 'Android'
      }
    });

    assert.ok(client.transport instanceof Appium);
    assert.strictEqual(client.settings.webdriver.host, 'localhost');
    assert.strictEqual(client.settings.webdriver.port, 4723);
    assert.strictEqual(client.settings.webdriver.ssl, false);
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.start_process, true);
    assert.strictEqual(client.transport.desiredCapabilities.browserName, 'firefox');
  });

  it('test create Transport for Appium without use_appium and with browserName=null',  function(){
    const client = NightwatchClient.client({
      webdriver: {
        start_process: false
      },
      selenium: {
        start_process: true,
        host: 'localhost',
        port: 9999,
        default_path_prefix: '',
        '[_started]': true
      },
      output: true,
      silent: false,
      desiredCapabilities: {
        browserName: null
      }
    });

    assert.ok(client.transport instanceof Appium);
    assert.strictEqual(client.settings.webdriver.host, 'localhost');
    assert.strictEqual(client.settings.webdriver.port, 9999);
    assert.strictEqual(client.settings.webdriver.default_path_prefix, '');
    assert.strictEqual(client.settings.webdriver.start_process, false);
    assert.strictEqual(client.transport.desiredCapabilities.browserName, null);
  });
});
