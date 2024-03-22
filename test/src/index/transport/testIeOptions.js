const assert = require('assert');
const Nightwatch = require('../../../lib/nightwatch.js');
const IeOptions =  require('selenium-webdriver/ie').Options;

describe('Internet Explorer driver options', function(){

  it('Internet Explorer option object defaults', function(){
    const ieOptions =  new IeOptions();
    const client = Nightwatch.createClient({
      capabilities: ieOptions
    });

    const options =  client.transport.createSessionOptions({initialBrowserUrl: 'https://google.com'});
    assert.deepStrictEqual(options, ieOptions);
    assert.strictEqual(client.api.isInternetExplorer(), true);
    assert.strictEqual(client.api.browserName, 'internet explorer');
  });

  it('Internet Explorer with instance of IeOptions', function(){
    const ieOptions =  new IeOptions();
    const client = Nightwatch.createClient({
      desiredCapabilities: ieOptions
    });

    const options =  client.transport.createSessionOptions();
    assert.deepStrictEqual(options, ieOptions);
    assert.strictEqual(client.api.isInternetExplorer(), true);
    assert.strictEqual(client.api.browserName, 'internet explorer');
  });

  it('IE initialBrowserUrl option', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'internet explorer',
        'se:ieOptions': {
          initialBrowserUrl: 'https://nightwatchjs.org'
        }
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof IeOptions, true);
    assert.strictEqual(options.get('se:ieOptions').initialBrowserUrl, 'https://nightwatchjs.org');
  });

  it('IE ensureCleanSession option', function(){
    const client = Nightwatch.createClient({
      desiredCapabilities: {
        browserName: 'internet explorer',
        'se:ieOptions': {
          ensureCleanSession: true
        }
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof IeOptions, true);
    assert.strictEqual(options.get('se:ieOptions').ensureCleanSession, true);
  });

  it('IE log path option', function(){
    const client = Nightwatch.createClient({
      webdriver: {
        log_path: '/custom/log/path'
      },
      desiredCapabilities: {
        browserName: 'internet explorer'
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof IeOptions, true);
    assert.strictEqual(options.get('se:ieOptions').logFile, '/custom/log/path');
  });

  it('IE host option', function(){
    const client = Nightwatch.createClient({
      webdriver: {
        host: '10.0.0.1'
      },
      desiredCapabilities: {
        browserName: 'internet explorer'
      }
    });
    const options = client.transport.createSessionOptions();

    assert.strictEqual(options instanceof IeOptions, true);
    assert.strictEqual(options.get('se:ieOptions').host, '10.0.0.1');
  });
});
