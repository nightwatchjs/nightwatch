const assert = require('assert');
const Nightwatch = require('../../lib/nightwatch.js');
const SafariOptions =  require('selenium-webdriver/safari').Options;

describe('Test safari options', function(){

  it('Safari option object with technology preview', function(){
    const safariOptions =  new SafariOptions();
    safariOptions.setTechnologyPreview(true);
    const client = Nightwatch.createClient({
      webdriver: {
        options: safariOptions
      },
      desiredCapabilities: {
        browserName: 'safari'
      }
    });
    const options =  client.transport.createOptions();
    
    assert.strictEqual(options instanceof SafariOptions, true);
    assert.deepStrictEqual(options.options_.technologyPreview, true);
  });

  it('proxy option', function(){
    const client =  Nightwatch.createClient({
      proxy: {
        https: 'localhost:8888'
      },
      desiredCapabilities: {
        browserName: 'safari'
      }
    });
    const options = client.transport.createOptions();

    assert.strictEqual(options instanceof SafariOptions, true);
    assert.deepStrictEqual(options.map_.get('proxy'), {
      proxyType: 'manual',
      sslProxy: 'localhost:8888',
      ftpProxy: undefined,
      httpProxy: undefined,
      noProxy: undefined
    });
  });
  
    
});