const path = require('path');

module.exports = {
  selenium: {
    port: 10192,
    host: 'localhost'
  },

  persist_globals: true,
  output_folder: false,

  webdriver: {
    start_process: false
  },

  globals: {
    test_calls: 0,
    waitForConditionTimeout: 20,
    retryAssertionTimeout: 20,
    waitForConditionPollInterval: 10
  },

  test_runner: {
    type: 'cucumber',
    options: {
      feature_path: path.join(__dirname, '../cucumber-integration-tests/sample_cucumber_tests/withwaitFor/sample.feature')
    }
  },
  output: false,
  silent: false
};