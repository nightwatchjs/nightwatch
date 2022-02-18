const assert = require('assert');
const common = require('../../common.js');
const SeleniumServiceBuilder = common.require('transport/selenium-webdriver/service-builders/selenium.js');

describe('test selenium argument parsing', function() {
  it('should convert simple arguments to jvmArgs', function() {
    const settings = {
      start_process: true,
      port: 4444,
      server_path: ('/example/path'),
      cli_args: {
        'webdriver.chrome.driver': '/example/path/chromedriver'
      }
    };
     
    const {parsedCliArgs, parsedJvmArgs} = SeleniumServiceBuilder.parseCliArgs(settings);
    assert.strictEqual(parsedCliArgs.length, 0);
    assert.strictEqual(parsedJvmArgs.length, 1);
    assert.strictEqual(parsedJvmArgs[0], '-Dwebdriver.chrome.driver=/example/path/chromedriver');
  });

  it('should pass on arguments prefexed with -', function() {
    const settings = {
      start_process: true,
      port: 4444,
      server_path: ('/example/path'),
      cli_args: {
        'webdriver.chrome.driver': '/example/path/chromedriver',
        '-version': '',
        '-output': 'some/path'
      }
    };

    const {parsedCliArgs, parsedJvmArgs} = SeleniumServiceBuilder.parseCliArgs(settings);
    assert.strictEqual(parsedCliArgs.length, 3);
    assert.strictEqual(parsedJvmArgs.length, 1);
    assert.strictEqual(parsedCliArgs[0], '-output');
    assert.strictEqual(parsedCliArgs[1], 'some/path');
    assert.strictEqual(parsedCliArgs[2], '-version');
    
  });

  it('sould accept empty and falsy values', function() {
    const settings = {
      start_process: true,
      port: 4444,
      server_path: ('/example/path'),
      cli_args: {
        'skipTests': '',
        '-verbose': false
      }
    };

    const {parsedCliArgs, parsedJvmArgs} = SeleniumServiceBuilder.parseCliArgs(settings);
    assert.strictEqual(parsedCliArgs.length, 2);
    assert.strictEqual(parsedJvmArgs.length, 1);
    assert.strictEqual(parsedJvmArgs[0], '-DskipTests');
    assert.strictEqual(parsedCliArgs[0], '-verbose');
    assert.strictEqual(parsedCliArgs[1], false);
  });
});