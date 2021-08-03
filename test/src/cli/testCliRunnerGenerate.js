const common = require('../../common.js');
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
      }
    });
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  it('test start CLI Runner with no config file', function () {
    let configData;
    const {constants, rmdirSync, readFileSync} = require('fs');
    const path = require('path');
    const tplData = readFileSync(path.resolve('lib/runner/cli/nightwatch.conf.ejs')).toString();

    const os = require('os');
    mockery.registerMock('os', {
      platform: function() {
        return 'win';
      },
      constants: os.constants
    });

    mockery.registerMock('fs', {
      statSync: function (fileName) {
        if (fileName.endsWith('/nightwatch.conf.js')) {
          return {
            isFile: function () {
              return false;
            }
          };
        }

        if (fileName.endsWith('/nightwatch.json')) {
          return {
            isFile: function () {
              return false;
            }
          };
        }
      },

      readFileSync: function(fileName) {
        return {
          toString: function () {
            return tplData;
          }
        };
      },

      writeFileSync: function (destFileName, content) {
        assert.strictEqual(destFileName, path.join(process.cwd(), 'nightwatch.conf.js'));
        configData = eval(content);
        mockery.registerMock(path.join(process.cwd(), 'nightwatch.conf.js'), configData);

        assert.strictEqual(typeof configData.safari, 'undefined');

        assert.deepStrictEqual(configData.test_settings.chrome, {
          desiredCapabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
              args: [],
              w3c: false
            }
          },

          webdriver: {
            start_process: true,
            server_path: '',
            cli_args: []
          }
        });

        assert.deepStrictEqual(configData.test_settings.firefox, {
          desiredCapabilities: {
            browserName: 'firefox',
            alwaysMatch: {
              acceptInsecureCerts: true,
              'moz:firefoxOptions': {
                args: []
              }
            }
          },
          webdriver: {
            start_process: true,
            server_path: '',
            cli_args: []
          }
        });

        assert.deepStrictEqual(configData.test_settings.browserstack, {
          desiredCapabilities: {
            'bstack:options': {
              userName: '${BROWSERSTACK_USER}',
              accessKey: '${BROWSERSTACK_KEY}'
            }
          },

          selenium: {
            host: 'hub-cloud.browserstack.com',
            port: 443
          },

          disable_error_log: true,
          webdriver: {
            timeout_options: {
              timeout: 15000,
              retry_attempts: 3
            },
            keep_alive: true,
            start_process: false
          }
        });

        assert.deepStrictEqual(configData.test_settings['browserstack.local'], {
          extends: 'browserstack',
          desiredCapabilities: {
            'browserstack.local': true
          }
        });

        assert.deepStrictEqual(configData.test_settings['browserstack.local_firefox'], {
          extends: 'browserstack.local',
          desiredCapabilities: {
            browserName: 'firefox'
          }
        });

        assert.deepStrictEqual(configData.test_settings['browserstack.local_chrome'], {
          extends: 'browserstack.local',
          desiredCapabilities: {
            browserName: 'chrome'
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
            browserName: 'internet explorer',
            browserVersion: '11.0'
          }
        });

        assert.deepStrictEqual(configData.test_settings.selenium_server, {
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

      },
      constants,
      rmdirSync
    });

    const CliRunner = common.require('runner/cli/cli.js');
    const ieRunner = new CliRunner({
      config: './nightwatch.json',
      env: 'browserstack.ie'
    }).setup();

    assert.strictEqual(ieRunner.argv.config, path.join(process.cwd(), 'nightwatch.conf.js'));
    assert.deepStrictEqual(ieRunner.test_settings.desiredCapabilities, {
      browserName: 'internet explorer',
      browserVersion: '11.0',
      'bstack:options': {
        userName: '${BROWSERSTACK_USER}',
        accessKey: '${BROWSERSTACK_KEY}'
      }
    });

    const chromeLocalRunner = new CliRunner({
      config: './nightwatch.json',
      env: 'browserstack.local_chrome'
    }).setup();

    assert.deepStrictEqual(chromeLocalRunner.test_settings.desiredCapabilities, {
      browserName: 'chrome',
      'browserstack.local': true,
      'bstack:options': {
        userName: '${BROWSERSTACK_USER}',
        accessKey: '${BROWSERSTACK_KEY}'
      }
    });
  });

});
