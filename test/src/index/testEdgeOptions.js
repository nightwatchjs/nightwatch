const assert = require('assert');
const Nightwatch = require('../../lib/nightwatch.js');
const EdgeOptions =  require('selenium-webdriver/edge').Options;

describe('Test edge option', function(){
  
  it('Edge option object with headless', function(){
    const edgeoptions =  new EdgeOptions();
    edgeoptions.headless();
    const client = Nightwatch.createClient({
      webdriver: {
        options: edgeoptions
      },
      desiredCapabilities: {
        browserName: 'edge'
      }
    });
    const options =  client.transport.createOptions();

    assert.strictEqual(options instanceof EdgeOptions, true);
    assert.deepStrictEqual(options.options_.args, ['headless']);
  });

  it('ms:edgeOption detach driver option', function(){
    const client =  Nightwatch.createClient({
     
      desiredCapabilities: {
        browserName: 'edge',
        'ms:edgeOptions': {
          detach: true
        }
      }
    });
    const options = client.transport.createOptions();

    assert.strictEqual(options instanceof EdgeOptions, true);
    assert.strictEqual(options.options_.detach, true);
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
    const options = client.transport.createOptions();

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
    const options = client.transport.createOptions();

    assert.strictEqual(options instanceof EdgeOptions, true);
    assert.strictEqual(options.options_.logPath, '/Nightwatch/EdgeLog/');

  });

  it('headless option', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'edge'
      }
    });
    const options = client.transport.createOptions({headless: true});

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
    const options =  client.transport.createOptions();

    assert.strictEqual(options instanceof EdgeOptions, true);
    assert.deepStrictEqual(options.options_.args, ['window-size=100,100']);
  });
  
});
