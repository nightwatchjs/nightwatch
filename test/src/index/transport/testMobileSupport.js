const nock = require('nock');
const assert = require('assert');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');
const Mobile = common.require('transport/selenium-webdriver/mobile-webdriver.js');


describe('MobileTransport', function () {
  it('test create Transport for Mobile',  function(){
    const client = NightwatchClient.client({
      webdriver: {
        start_process: false
      },
      selenium: {
        start_process: false,
        host: 'localhost',
        port: '4723'
      },
      output: true,
      silent: false,
      desiredCapabilities: {
        browserName: null,
        platformName: 'iOS',
        platformVersion: '15.5',
        deviceName: 'iPhone 13'
      }
    });

    const {transport} = client;
    assert.ok(transport instanceof Mobile);
    assert.ok(client.settings.webdriver.host, 'localhost');
    assert.ok(client.settings.webdriver.default_path_prefix, '/wd/hub');
    assert.strictEqual(client.settings.webdriver.start_process, false);
  });
});