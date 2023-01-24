const assert = require('assert');
const Nightwatch = require('../../../lib/nightwatch.js');
const ChromeOptions = require('selenium-webdriver/chrome').Options;

describe('Test chrome options', function () {

  it('Chrome option object with headless', function(){
    const capabilities = new ChromeOptions();
    capabilities.headless();
    const client = Nightwatch.createClient({
      capabilities
    });
    
    const options = client.transport.createSessionOptions();
    assert.strictEqual(options, capabilities);
    assert.strictEqual(client.api.isChrome(), true);
    assert.strictEqual(client.api.browserName, 'chrome');
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
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.strictEqual(options.options_.detach, true);
    assert.strictEqual(client.api.isChrome(), true);
    assert.strictEqual(client.api.browserName, 'chrome');
  });

  it('chromeOptions detach driver option', function () {
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          detach: true
        }
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.strictEqual(options.options_.detach, true);
    assert.strictEqual(client.api.isChrome(), true);
    assert.strictEqual(client.api.browserName, 'chrome');
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
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.strictEqual(options.options_.binary, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
    assert.strictEqual(client.api.isChrome(), true);
    assert.strictEqual(client.api.browserName, 'chrome');
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
    const options = client.transport.createSessionOptions();

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
    const options = client.transport.createSessionOptions();
    
    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.strictEqual(options.options_.androidPackage, 'com.android.chrome');
  });

  it('headless option', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });
    const options = client.transport.createSessionOptions({headless: true});

    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.deepStrictEqual(options.options_.args, ['headless=new']);
  });

  it('devtools cli arg', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'chrome'
      }
    });

    const options = client.transport.createSessionOptions({devtools: true});

    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.deepStrictEqual(options.options_.args, ['auto-open-devtools-for-tabs']);
  });

  it('devtools cli arg with already defined setting', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['auto-open-devtools-for-tabs']
        }
      }
    });

    const options = client.transport.createSessionOptions({devtools: true});

    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.deepStrictEqual(options.options_.args, ['auto-open-devtools-for-tabs']);
  });

  it('devtools cli arg with already defined setting 2', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--auto-open-devtools-for-tabs']
        }
      }
    });

    const options = client.transport.createSessionOptions({devtools: true});

    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.deepStrictEqual(options.options_.args, ['--auto-open-devtools-for-tabs']);
  });

  it('devtools cli arg with already defined setting (using chromeOptions)', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['auto-open-devtools-for-tabs']
        }
      }
    });

    const options = client.transport.createSessionOptions({devtools: true});

    assert.strictEqual(options instanceof ChromeOptions, true);
    assert.deepStrictEqual(options.options_.args, ['auto-open-devtools-for-tabs']);
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
    const options =  client.transport.createSessionOptions();

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
    const options = client.transport.createSessionOptions();
    
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
