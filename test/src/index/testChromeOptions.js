const assert = require('assert');
const Nightwatch = require('../../lib/nightwatch.js');
const ChromeOptions =  require('selenium-webdriver/chrome').Options;

describe('Test chrome options', function () {

  it('Chrome option object with headless', function(){
    const chromeOptions =  new ChromeOptions();
    chromeOptions.headless();
    const client = Nightwatch.createClient({
      webdriver: {
        options: chromeOptions
      },
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });
    const options =  client.transport.createOptions();

    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.deepStrictEqual(options.options_.args, ['headless']);
  });

  it('goog:chromeOptions detach driver option', function () {
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

  it('Chrome Binary Path option', function(){
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

  it('headless option', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });
    const options = client.transport.createOptions({headless: true});

    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.deepStrictEqual(options.options_.args, ['headless']);
  });

  it('window size option', function(){
    const client =  Nightwatch.createClient({
      window_size: {
        height: 100,
        width: 100
      },
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });
    const options =  client.transport.createOptions();

    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.deepStrictEqual(options.options_.args, ['window-size=100,100']);
  });

  it('proxy option', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'chrome',
        proxy: {
          https: 'localhost:8888'
        }
      }
    });
    const options = client.transport.createOptions();
    
    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.deepStrictEqual(options.getProxy(), {
      proxyType: 'manual',
      sslProxy: 'localhost:8888',
      ftpProxy: undefined,
      httpProxy: undefined,
      noProxy: undefined
    });
  });
 
  
});
