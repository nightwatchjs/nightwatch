const common = require('../../../common.js');
const mockery = require('mockery');
const assert = require('assert');

describe('Test CLI Runner Generate', function() {

  beforeEach(function() {
    mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
    mockery.registerMock('./argv-setup.js', {
      isDefault(option, value) {
        return value.includes('nightwatch.');
      },

      getDefault() {
        return './nightwatch.json';
      },
    });
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('test start CLI Runner with no config file', function () {
    let configData;
    const fs = require('fs');
    const path = require('path');
    const tplData = fs.readFileSync(path.resolve('lib/runner/cli/nightwatch.conf.ejs')).toString();

    mockery.registerMock('os', {
      platform: function() {
        return 'win'
      }
    });

    mockery.registerMock('fs', {
      statSync: function (fileName) {
        if (fileName.endsWith('/nightwatch.conf.js')) {
          return {
            isFile: function () {
              return false
            }
          };
        }

        if (fileName.endsWith('/nightwatch.json')) {
          return {
            isFile: function () {
              return false
            }
          };
        }
      },

      readFileSync: function (fileName) {
        return {
          toString: function () {
            return tplData;
          }
        }
      },

      writeFileSync: function (destFileName, content) {
        assert.strictEqual(destFileName, path.join(process.cwd(), 'nightwatch.conf.js'));

        configData = eval(content);
        mockery.registerMock(path.join(process.cwd(), 'nightwatch.conf.js'), configData);

        assert.equal(typeof configData.safari, 'undefined');

        assert.deepStrictEqual(configData.test_settings.chrome, {
          desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: {
              args: []
            }
          },

          webdriver: {
            start_process: true,
            port: 9515,
            server_path: '',
            cli_args: []
          }
        });

        assert.deepStrictEqual(configData.test_settings.firefox, {
          desiredCapabilities: {
            browserName: 'firefox',
            alwaysMatch: {
              'moz:firefoxOptions': {
                args: [],
              }
            }
          },
          webdriver: {
            start_process: true,
            port: 4444,
            server_path: '',
            cli_args: []
          }
        });

        assert.deepStrictEqual(configData.test_settings.browserstack, {
          desiredCapabilities: {
            'bstack:options': {
              local: 'false',
              userName: '${BROWSERSTACK_USER}',
              accessKey: '${BROWSERSTACK_KEY}',
            }
          },

          selenium: {
            host: 'hub-cloud.browserstack.com',
            port: 443
          },

          disable_error_log: true,
          webdriver: {
            keep_alive: true,
            start_process: false
          }
        });

        assert.deepStrictEqual(configData.test_settings['browserstack.chrome'], {
          extends: 'browserstack',
          desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: {
              w3c: false
            }
          }
        });

        assert.deepStrictEqual(configData.test_settings['browserstack.ie'], {
          extends: 'browserstack',
          desiredCapabilities: {
            browserName: 'IE',
            browserVersion: '11.0',
            'bstack:options': {
              os: 'Windows',
              osVersion: '10',
              local: 'false',
              seleniumVersion: '3.5.2',
              resolution: '1366x768'
            }
          }
        });

        assert.deepStrictEqual(configData.test_settings.selenium, {
          selenium: {
            start_process: true,
            port: 4444,
            server_path: '',
            cli_args: {
              'webdriver.gecko.driver': '',
              'webdriver.chrome.driver': ''
            }
          }
        });

      }
    });

    const CliRunner = common.require('runner/cli/cli.js');
    let runner = new CliRunner({
      config: './nightwatch.json',
      env: 'browserstack.ie'
    }).setup();

    assert.equal(runner.argv.config, path.join(process.cwd(), 'nightwatch.conf.js'));
    assert.deepStrictEqual(runner.test_settings.desiredCapabilities, {
      browserName: 'IE',
      browserVersion: '11.0',
      'bstack:options' : {
        os: 'Windows',
        osVersion: '10',
        local: 'false',
        seleniumVersion: '3.5.2',
        resolution: '1366x768',
        userName: '${BROWSERSTACK_USER}',
        accessKey: '${BROWSERSTACK_KEY}',
      }
    });
  });

});
