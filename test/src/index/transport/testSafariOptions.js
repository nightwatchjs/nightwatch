const assert = require('assert');
const Nightwatch = require('../../../lib/nightwatch.js');
const SafariOptions =  require('selenium-webdriver/safari').Options;

describe('Test safari options', function(){

  it('Safari option object with technology preview', function(){
    const safariOptions =  new SafariOptions();
    safariOptions.setTechnologyPreview(true);

    const client = Nightwatch.createClient({
      capabilities: safariOptions
    });
    const options =  client.transport.createSessionOptions();
    
    assert.strictEqual(options, safariOptions);
    assert.strictEqual(client.api.isSafari(), true);
    assert.strictEqual(client.api.browserName, 'safari');
  });

  it('proxy option', function(){
    const client =  Nightwatch.createClient({
      desiredCapabilities: {
        proxy: {
          https: 'localhost:8888'
        },
        browserName: 'safari'
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof SafariOptions, true);
    assert.deepStrictEqual(options.getProxy(), {
      proxyType: 'manual',
      sslProxy: 'localhost:8888',
      ftpProxy: undefined,
      httpProxy: undefined,
      noProxy: undefined
    });
  });
  

});