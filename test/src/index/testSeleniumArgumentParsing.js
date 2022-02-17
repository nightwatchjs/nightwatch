const assert = require('assert');
const common = require('../../common.js');
const SeleniumServiceBuilder = common.require('transport/selenium-webdriver/service-builders/selenium.js');

describe('test selenium argument parsing', function() {
  it('should convert simple arguments to jvmArgs', function() {
    let settings = {
      start_process: true,
      port: 4444,
      server_path: ('/usr/dummy/path'),
      cli_args: {
        'webdriver.chrome.driver': '/usr/dummy/path/chromedriver'
      }
    };
     
    let {parsedCliArgs, parsedJvmArgs} = SeleniumServiceBuilder._parseCliArgs(settings);
    assert.strictEqual(parsedCliArgs.length, 0);
    assert.strictEqual(parsedJvmArgs.length, 1);
    assert.strictEqual(parsedJvmArgs[0], '-Dwebdriver.chrome.driver=/usr/dummy/path/chromedriver');
  });

  it('should pass on arguments prefexed with -', function() {
    let settings = {
      start_process: true,
      port: 4444,
      server_path: ('/usr/dummy/path'),
      cli_args: {
        'webdriver.chrome.driver': '/usr/dummy/path/chromedriver',
        '-version': '',
        '-output': 'some/path'
      }
    };

    let {parsedCliArgs, parsedJvmArgs} = SeleniumServiceBuilder._parseCliArgs(settings);
    assert.strictEqual(parsedCliArgs.length, 3);
    assert.strictEqual(parsedJvmArgs.length, 1);
    assert.strictEqual(parsedCliArgs[0], '-output');
    assert.strictEqual(parsedCliArgs[1], 'some/path');
    assert.strictEqual(parsedCliArgs[2], '-version');
    
  });

  it('sould accept empty and falsy values', function() {
    let settings = {
      start_process: true,
      port: 4444,
      server_path: ('/usr/dummy/path'),
      cli_args: {
        'skipTests': '',
        '-verbose': false
      }
    };

    let {parsedCliArgs, parsedJvmArgs} = SeleniumServiceBuilder._parseCliArgs(settings);
    assert.strictEqual(parsedCliArgs.length, 2);
    assert.strictEqual(parsedJvmArgs.length, 1);
    assert.strictEqual(parsedJvmArgs[0], '-DskipTests');
    assert.strictEqual(parsedCliArgs[0], '-verbose');
    assert.strictEqual(parsedCliArgs[1], 'false');
  });
});