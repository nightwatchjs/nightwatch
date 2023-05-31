const assert = require('assert');
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
    waitForConditionPollInterval: 10,
    registerEventHandlers: function(eventBroadcaster) {
      eventBroadcaster.on('TestCaseStarted', (args) => {
        assert.deepStrictEqual(Object.keys(args), ['envelope', 'report']);
      });

      eventBroadcaster.on('TestCaseFinished', (args) => {
        assert.deepStrictEqual(Object.keys(args), ['envelope', 'report']);
      });

      eventBroadcaster.on('TestStepStarted', (args) => {
        assert.deepStrictEqual(Object.keys(args), ['envelope', 'report']);
      });

      eventBroadcaster.on('TestStepFinished', (args) => {
        assert.deepStrictEqual(Object.keys(args), ['envelope', 'report']);
      });

      eventBroadcaster.on('TestStarted', (args) => {
        assert.deepStrictEqual(Object.keys(args), ['envelope', 'report']);
      });

      eventBroadcaster.on('TestFinished', (args) => {
        assert.deepStrictEqual(Object.keys(args), ['envelope', 'report']);
      });
    }
  },

  test_runner: {
    type: 'cucumber',
    options: {
      feature_path: path.join(__dirname, '../cucumber-integration-tests/sample_cucumber_tests/withexpect/sample.feature')
    }
  },
  output: false,
  silent: false
};
