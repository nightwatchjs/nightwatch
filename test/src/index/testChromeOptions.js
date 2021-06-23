const assert = require('assert');
const Nightwatch = require('../../lib/nightwatch.js');
const nock =  require('nock');
const ChromeOptions =  require('selenium-webdriver/chrome').Options;

describe('Test chrome options', function () {
  it('chromeOptions detach driver option', function () {

    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          detach: true
        }
      }
    });
    const options = client.transport.createOptions();
    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.strictEqual(options.options_.detach, true);
  });

  it('Chrome Binary Path option', function (){
    const client = Nightwatch.createClient({
      webdriver: {
        chrome_binary: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      },
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });
    const options = client.transport.createOptions();
    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.strictEqual(options.options_.binary, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  });

  it('Chrome log path option', function(){
    const client = Nightwatch.createClient({
      webdriver: {
        chrome_log_file: '/Nightwatch/ChromeLog/'
      },
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });
    const options = client.transport.createOptions();
    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.strictEqual(options.options_.logPath, '/Nightwatch/ChromeLog/');

  });

  it('Andriod chrome option', function() {
    const client = Nightwatch.createClient({
      webdriver: {
        android_chrome: 'com.android.chrome'
      },
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });
    const options = client.transport.createOptions();
    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.strictEqual(options.options_.androidPackage, 'com.android.chrome');
  });
 
  
});
