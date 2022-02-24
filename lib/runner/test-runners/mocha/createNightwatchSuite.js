const TestSuite = require('../../../testsuite');

module.exports = function ({suite, settings, argv, modulePath, addtOpts, runner}) {
  const modules = [];
  const timeoutFn = suite.timeout;
  const nightwatchSuite = new TestSuite({
    modules,
    settings,
    argv,
    usingMocha: true,
    addtOpts,
    modulePath
  });

  nightwatchSuite.initCommon({
    suiteTitle: suite.title
  });

  Object.defineProperties(suite, {
    nightwatchSuite: {
      configurable: true,
      get: function() {
        return nightwatchSuite;
      }
    },

    client: {
      configurable: true,
      get: function() {
        return this.nightwatchSuite.client;
      }
    },

    isWorker: {
      configurable: true,
      get: function() {
        return runner.isWorker;
      }
    },

    files: {
      configurable: true,
      get: function() {
        return runner.files;
      }
    },

    mochaOptions: {
      configurable: true,
      get: function() {
        return runner.options;
      }
    }
  });

  Object.defineProperties(suite, {
    globals: {
      get: function() {
        return this.nightwatchSuite.settings.globals;
      }
    },

    settings: {
      get: function() {
        return this.nightwatchSuite.settings;
      }
    },

    argv: {
      get: function() {
        return this.nightwatchSuite.argv;
      }
    },

    suiteRetries: {
      value: function(value) {
        if (typeof value != 'undefined') {
          this.nightwatchSuite.context.setSuiteRetries(value);
        }
      }
    },

    waitForTimeout: {
      value: function(value) {
        if (typeof value == 'undefined') {
          return this.globals.waitForConditionTimeout;
        }
        this.globals.waitForConditionTimeout = value;
        this.globals.retryAssertionTimeout = value;
      }
    },

    timeout: {
      value: function(value) {
        if (typeof value == 'undefined') {
          return timeoutFn.call(this);
        }

        this.globals.unitTestsTimeout = value;

        timeoutFn.call(this, value);
      }
    },

    waitForRetryInterval: {
      value: function(value) {
        if (typeof value == 'undefined') {
          return this.globals.waitForConditionPollInterval;
        }

        this.globals.waitForConditionPollInterval = value;
      }
    }
  });
};