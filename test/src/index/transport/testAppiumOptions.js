const assert = require('assert');
const {describe} = require('mocha');
const Nightwatch = require('../../../lib/nightwatch.js');

describe('Test Appium client', function () {
  it('have isIOS() function', function () {
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'Safari',
        javascriptEnabled: true,
        platformName: 'iOS',
        platformVersion: '15.0',
        deviceName: 'iPhone 13'
      }
    });

    client.transport.createSessionOptions();
    assert.strictEqual(client.api.isIOS(), true);
    assert.strictEqual(client.api.isMobile(), true);
  });

  it('have isAndroid() function', function () {
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'Chrome',
        javascriptEnabled: true,
        platformName: 'Android',
        platformVersion: '13.0',
        deviceName: 'Google Pixel'
      }
    });

    client.transport.createSessionOptions();
    assert.strictEqual(client.api.isAndroid(), true);
    assert.strictEqual(client.api.isMobile(), true);
  });
});

describe('test nightwatch client', function () {
  it('doesn\'t have isIOS(), isAndroid() and isMobile() function', function () {
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'Chrome'
      }
    });

    client.transport.createSessionOptions();
    assert.strictEqual(client.api.isIOS(), false);
    assert.strictEqual(client.api.isAndroid(), false);
    assert.strictEqual(client.api.isMobile(), false);
  });
});
