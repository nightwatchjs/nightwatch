const assert = require('assert');
const Nightwatch = require('../../../lib/nightwatch.js');
const FirefoxOptions =  require('selenium-webdriver/firefox').Options;

describe('Firefox driver options', function(){

  it('Firefox option object with headless', function(){
    const firefoxOptions =  new FirefoxOptions();
    firefoxOptions.headless();
    const client = Nightwatch.createClient({
      capabilities: firefoxOptions
    });

    const options =  client.transport.createSessionOptions();
    assert.strictEqual(options, firefoxOptions);
    assert.strictEqual(client.api.isFirefox(), true);
    assert.strictEqual(client.api.browserName, 'firefox');
  });

  it('moz:firefoxOptions detach driver option', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'firefox',
        'moz:firefoxOptions': {
          detach: true
        }
      }
    });
    const options =  client.transport.createSessionOptions();

    assert.strictEqual(options instanceof FirefoxOptions, true);
    assert.deepStrictEqual(options.get('moz:firefoxOptions').detach, true);
    assert.strictEqual(client.api.isFirefox(), true);
    assert.strictEqual(client.api.browserName, 'firefox');
  });

  it('Firefox Binary Path option', function(){
    const client = Nightwatch.createClient({
      webdriver: {
        firefox_binary: '/Applications/Firefox.app/Contents/MacOS/Firefox'
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof FirefoxOptions, true);
    assert.strictEqual(options.get('moz:firefoxOptions').binary, '/Applications/Firefox.app/Contents/MacOS/Firefox');
  });

  it('Firefox log path option', function(){
    const client = Nightwatch.createClient({
      webdriver: {
        firefox_profile: 'Nightwatch'
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof FirefoxOptions, true);
    assert.strictEqual(options.get('moz:firefoxOptions').profile.template_, 'Nightwatch');

  });

  it('headless option', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });
    const options = client.transport.createSessionOptions({headless: true});

    assert.strictEqual(options instanceof FirefoxOptions, true);
    assert.deepStrictEqual(options.get('moz:firefoxOptions').args, ['-headless']);
  });

  it('window size option', function(){
    const client = Nightwatch.createClient({
      window_size: {
        height: 100,
        width: 100
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });

    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof FirefoxOptions, true);
    assert.deepStrictEqual(options.get('moz:firefoxOptions').args, ['--width=100', '--height=100']);
  });
  
  it('proxy options', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        proxy: {
          https: 'localhost:8888'
        },
        browserName: 'firefox'
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof FirefoxOptions, true);
    assert.deepStrictEqual(options.getProxy(), {
      proxyType: 'manual',
      sslProxy: 'localhost:8888',
      ftpProxy: undefined,
      httpProxy: undefined,
      noProxy: undefined
    });
  });

});
