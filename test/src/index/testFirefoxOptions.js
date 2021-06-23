const assert = require('assert');
const Nightwatch = require('../../lib/nightwatch.js');
const FirefoxOptions =  require('selenium-webdriver/firefox').Options;

describe('Firefox driver options', function(){

  it('Firefox Binary Path option', function(){
    const client = Nightwatch.createClient({
      webdriver: {
        firefox_binary: '/Applications/Firefox.app/Contents/MacOS/Firefox'
      },
      desiredCapabilities: {
        browserName: 'firefox'
      }
    });
    const options = client.transport.createOptions();

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
    const options = client.transport.createOptions();

    assert.strictEqual(options instanceof FirefoxOptions, true);
    assert.strictEqual(options.get('moz:firefoxOptions').profile.template_, 'Nightwatch');

  });
 
});
