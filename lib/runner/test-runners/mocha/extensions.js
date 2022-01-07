const Utils = require('../../../utils');
const customRunnable = require('./custom-runnable.js');
const createNightwatchSuite = require('./createNightwatchSuite.js');
const {Logger} = Utils;

module.exports = class Extensions {
  static adaptRunnables(parent) {
    Extensions.adaptHooks(parent, ['_afterAll', '_afterEach', '_beforeAll', '_beforeEach']);

    parent.tests = parent.tests.map(function(test) {
      test.run = function(...args) {
        // eslint-disable-next-line no-console
        console.log(`\n  Running ${Logger.colors.green(this.title)}${Logger.colors.stack_trace('...')}`);

        this.parent.client.isES6AsyncTestcase = Utils.isES6AsyncFn(this.fn);
        delete this.parent.client.isES6AsyncTestHook;

        return customRunnable.apply(this, args);
      }.bind(test);

      return test;
    });

    if (parent.suites && parent.suites.length > 0) {
      parent.suites.forEach(function(item) {
        Extensions.adaptRunnables(item);
      });
    }

  }

  static adaptHooks(suite, hooks) {
    hooks.forEach(function(hook) {
      suite[hook].forEach(hookInstance => {
        const originalRunFn = hookInstance.run;
        hookInstance.run = function(fn) {
          const isAsync = Utils.isES6AsyncFn(this.fn);
          //console.log(`  Running ${Logger.colors.stack_trace(this.title + ':')}`);
          this.parent.client.isES6AsyncTestcase = isAsync;

          if (this.fn.length === 0 && isAsync) {
            return originalRunFn.call(this, fn);
          }

          return customRunnable.call(this, fn, true);
        }.bind(hookInstance);
      });
    });
  }

  static augmentTestSuite({suite, runner, argv, settings, addtOpts}) {
    const timeoutFn = suite.timeout;

    const attributes = [
      'tags',
      'desiredCapabilities',
      'endSessionOnFail',
      'skipTestcasesOnFail',
      'unitTest'
    ];

    Object.defineProperties(suite, attributes.reduce((prev, attribute) => {
      prev[attribute] = {
        configurable: true,
        set: function(value) {
          this.nightwatchSuite.context.setAttribute(`@${attribute}`, value);
        },

        get: function() {
          if (!this.nightwatchSuite) {
            return null;
          }

          return this.nightwatchSuite.context.getAttribute(`@${attribute}`);
        }
      };

      return prev;
    }, {}));

    const nightwatchSuite = createNightwatchSuite({
      suite,
      settings,
      argv,
      addtOpts
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
          return nightwatchSuite.client;
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

    if (Utils.isUndefined(suite.timeout())) {
      suite.timeout(20000);
    }
  }
};