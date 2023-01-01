const assert = require('assert');
const common = require('../../common.js');
const NightwatchClient = common.require('index.js');


describe('Mobile Component Testing in Android Emulator', function () {
  it('test baseUrl - localhost', function() {
    const client = NightwatchClient.client({
      baseUrl: 'http://localhost:3000',
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        avd: 'nightwatch-android-11',
        real_mobile: false
      }
    });

    assert.strictEqual(client.api.baseUrl, 'http://10.0.2.2:3000');
  });

  it('test baseUrl - 127.0.0.1',  function(){
    const client = NightwatchClient.client({
      baseUrl: 'http://127.0.0.1:3000',
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        avd: 'nightwatch-android-11',
        real_mobile: false
      }
    });

    assert.strictEqual(client.api.baseUrl, 'http://10.0.2.2:3000');
  });

  it('test baseUrl - not defined',  function(){
    const client = NightwatchClient.client({
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        avd: 'nightwatch-android-11',
        real_mobile: false
      }
    });

    assert.strictEqual(client.api.baseUrl, null);
  });

  it('test baseUrl - non local',  function(){
    const client = NightwatchClient.client({
      baseUrl: 'https://www.google.com/',
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        avd: 'nightwatch-android-11',
        real_mobile: false
      }
    });

    assert.strictEqual(client.api.baseUrl, 'https://www.google.com/');
  });

  it('test baseUrl - real mobile',  function(){
    const client = NightwatchClient.client({
      baseUrl: 'http://127.0.0.1:3000',
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        avd: 'nightwatch-android-11',
        real_mobile: true
      }
    });

    assert.strictEqual(client.api.baseUrl, 'http://127.0.0.1:3000');
  });

  it('test baseUrl - no mobile',  function(){
    const client = NightwatchClient.client({
      baseUrl: 'http://127.0.0.1:3000',
      webdriver: {
        start_process: true
      },
      desiredCapabilities: {
        real_mobile: false
      }
    });

    assert.strictEqual(client.api.baseUrl, 'http://127.0.0.1:3000');
  });
});
