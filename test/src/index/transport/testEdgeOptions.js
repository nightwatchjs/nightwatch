const assert = require('assert');
const Nightwatch = require('../../../lib/nightwatch.js');
const EdgeOptions =  require('selenium-webdriver/edge').Options;

describe('Test edge option', function(){
  
  it('Edge option object with headless', function(){
    const edgeoptions = new EdgeOptions();
    edgeoptions.headless();

    const client = Nightwatch.createClient({
      capabilities: edgeoptions
    });

    const options =  client.transport.createSessionOptions();
    assert.strictEqual(options, edgeoptions);
    assert.strictEqual(client.api.isEdge(), true);
    assert.strictEqual(client.api.browserName, 'MicrosoftEdge');
  });

  it('ms:edgeOption detach driver option', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'edge',
        'ms:edgeOptions': {
          detach: true
        }
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof EdgeOptions, true);
    assert.strictEqual(options.options_.detach, true);
    assert.strictEqual(client.api.isEdge(), true);
    assert.strictEqual(client.api.browserName, 'edge');
  });
  
  it('Edge Binary Path option', function(){
    const client = Nightwatch.createClient({
      webdriver: {
        edge_binary: '/Applications/Edge.app/Contents/MacOS/Edge'
      },
      desiredCapabilities: {
        browserName: 'edge'
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof EdgeOptions, true);
    assert.strictEqual(options.options_.binary, '/Applications/Edge.app/Contents/MacOS/Edge');
  });

  it('Edge log path option', function(){
    const client = Nightwatch.createClient({
      webdriver: {
        edge_log_file: '/Nightwatch/EdgeLog/'
      },
      desiredCapabilities: {
        browserName: 'edge'
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof EdgeOptions, true);
    assert.strictEqual(options.options_.logPath, '/Nightwatch/EdgeLog/');

  });

  it('headless option', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'edge'
      }
    });
    const options = client.transport.createSessionOptions({headless: true});

    assert.strictEqual(options instanceof EdgeOptions, true);
    assert.deepStrictEqual(options.options_.args, ['headless']);
  });

  it('window size option', function(){
    const client =  Nightwatch.createClient({
      window_size: {
        height: 100,
        width: 100
      },
      desiredCapabilities: {
        browserName: 'edge'
      }
    });
    const options =  client.transport.createSessionOptions();

    assert.strictEqual(options instanceof EdgeOptions, true);
    assert.deepStrictEqual(options.options_.args, ['window-size=100,100']);
  });

  it('Andriod package option', function() {
    const client = Nightwatch.createClient({
      webdriver: {
        android_package: 'com.android.edge'
      },
      desiredCapabilities: {
        browserName: 'edge'
      }
    });
    const options = client.transport.createSessionOptions();
    
    assert.strictEqual(options instanceof EdgeOptions, true);
    assert.strictEqual(options.options_.androidPackage, 'com.android.edge');
  });

  it('proxy option', function(){
    const client =  Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'edge',
        proxy: {
          https: 'localhost:8888'
        }
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof EdgeOptions, true);
    assert.deepStrictEqual(options.getProxy(), {
      proxyType: 'manual',
      sslProxy: 'localhost:8888',
      ftpProxy: undefined,
      httpProxy: undefined,
      noProxy: undefined
    });
  });


});
