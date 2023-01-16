const path = require('path');

module.exports = {
  selenium: {
    port: 10195,
    host: 'localhost'
  },

  persist_globals: true,
  output_folder: false,

  webdriver: {
    start_process: false
  }, 

  custom_commands_path: [path.join(__dirname, './commands')],
  
  globals: {
    test_calls: 0,
    waitForConditionTimeout: 20,
    retryAssertionTimeout: 20,
    waitForConditionPollInterval: 10
  },

  test_runner: {
    type: 'cucumber',
    options: {
      feature_path: path.join(__dirname, '../cucumber-integration-tests/sample_cucumber_tests/integration/sample.feature')
    }
  },
  test_settings: {
    browserstack: {
      selenium: {
        host: 'hub-cloud.browserstack.com',
        port: 443
      },
      desiredCapabilities: {
        'browserstack.user': 'test-access-user',
        'browserstack.key': 'test-access-key',
        browserName: 'chrome'
      }
    }
  }
};