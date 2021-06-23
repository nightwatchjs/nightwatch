const assert = require('assert');
const Nightwatch = require('../../lib/nightwatch.js');
const EdgeOptions =  require('selenium-webdriver/edge').Options;

describe('Test edge option', function(){
  
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
  
});
