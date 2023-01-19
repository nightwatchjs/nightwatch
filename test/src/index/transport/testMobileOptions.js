const assert = require('assert');
const {describe} = require('mocha');
const common = require('../../../common.js');
const Nightwatch = require('../../../lib/nightwatch.js');
const Appium = common.require('transport/selenium-webdriver/appium.js');
const ChromeDriver = common.require('transport/selenium-webdriver/chrome.js');
const SafariDriver = common.require('transport/selenium-webdriver/safari.js');

describe('Test mobile options in Nightwatch/Appium client', function () {
  it('have isIOS() for web testing on iOS', function () {
    const client = Nightwatch.createClient({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'Safari',
        javascriptEnabled: true,
        platformName: 'iOS',
        platformVersion: '15.0',
        deviceName: 'iPhone 13'
      }
    });
    client.transport.createSessionOptions();

    assert.ok(client.transport instanceof SafariDriver);
    assert.strictEqual(client.api.isIOS(), true);
    assert.strictEqual(client.api.isAndroid(), false);
    assert.strictEqual(client.api.isMobile(), true);
    assert.strictEqual(client.api.isAppiumClient(), false);
  });

  it('have isAndroid() for web testing on Android', function () {
    const client = Nightwatch.createClient({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'Chrome',
        javascriptEnabled: true,
        'goog:chromeOptions': {
          androidPackage: 'com.android.chrome'
        }
      }
    });

    client.transport.createSessionOptions();

    assert.ok(client.transport instanceof ChromeDriver);
    assert.strictEqual(client.api.isIOS(), false);
    assert.strictEqual(client.api.isAndroid(), true);
    assert.strictEqual(client.api.isMobile(), true);
    assert.strictEqual(client.api.isAppiumClient(), false);
  });

  it('doesn\'t have isIOS(), isAndroid() and isMobile() for web testing on desktop', function () {
    const client = Nightwatch.createClient({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        browserName: 'Chrome'
      }
    });

    client.transport.createSessionOptions();

    assert.ok(client.transport instanceof ChromeDriver);
    assert.strictEqual(client.api.isIOS(), false);
    assert.strictEqual(client.api.isAndroid(), false);
    assert.strictEqual(client.api.isMobile(), false);
    assert.strictEqual(client.api.isAppiumClient(), false);
  });

  it('have isIOS() and isAppiumClient() for native testing on iOS', function () {
    const client = Nightwatch.createClient({
      selenium: {
        use_appium: true
      },
      desiredCapabilities: {
        browserName: null,
        platformName: 'iOS',
        platformVersion: '15.0',
        deviceName: 'iPhone 13'
      }
    });
    client.transport.createSessionOptions();

    assert.ok(client.transport instanceof Appium);
    assert.strictEqual(client.api.isIOS(), true);
    assert.strictEqual(client.api.isAndroid(), false);
    assert.strictEqual(client.api.isMobile(), true);
    assert.strictEqual(client.api.isAppiumClient(), true);
  });

  it('have isAndroid() for native testing on Android', function () {
    const client = Nightwatch.createClient({
      selenium: {
        use_appium: false
      },
      desiredCapabilities: {
        browserName: null,
        platformName: 'Android'
      }
    });

    client.transport.createSessionOptions();

    assert.ok(client.transport instanceof Appium);
    assert.strictEqual(client.api.isIOS(), false);
    assert.strictEqual(client.api.isAndroid(), true);
    assert.strictEqual(client.api.isMobile(), true);
    // backward compatibility with browserName: null
    assert.strictEqual(client.api.isAppiumClient(), true);
  });

  it('have isAndroid() and isAppiumClient() for web testing on Android using Appium', function () {
    const client = Nightwatch.createClient({
      selenium: {
        use_appium: true
      },
      desiredCapabilities: {
        browserName: 'Chrome',
        platformName: 'Android'
      }
    });

    client.transport.createSessionOptions();

    assert.ok(client.transport instanceof Appium);
    assert.strictEqual(client.api.isIOS(), false);
    assert.strictEqual(client.api.isAndroid(), true);
    assert.strictEqual(client.api.isMobile(), true);
    assert.strictEqual(client.api.isAppiumClient(), true);
  });
});
