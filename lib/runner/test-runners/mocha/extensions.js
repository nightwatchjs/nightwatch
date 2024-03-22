const Utils = require('../../../utils');
const customRunnable = require('./custom-runnable.js');
const nightwatchSuiteUtils = require('./nightwatchSuite.js');
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
        return (function(_item) {
          Extensions.adaptRunnables(_item);
        })(item);
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
    const attributes = [
      'tags',
      'desiredCapabilities',
      'endSessionOnFail',
      'skipTestcasesOnFail',
      'unitTest',
      'disabled'
    ];

    Object.defineProperties(suite, attributes.reduce((prev, attribute) => {
      prev[attribute] = {
        configurable: true,
        set: function(value) {
          this.nightwatchSuite.mochaContext.then(context => {
            context.setAttribute(`@${attribute}`, value);
          });
        },

        get: function() {
          if (!this.nightwatchSuite || !this.nightwatchSuite.context) {
            return null;
          }

          return this.nightwatchSuite.context.getAttribute(`@${attribute}`);
        }
      };

      return prev;
    }, {}));

    const suiteIndex = Math.max(0, runner.suite.suites.length - 1);

    const nightwatchSuite = nightwatchSuiteUtils.create({
      runner,
      suite,
      settings,
      argv,
      addtOpts,
      modulePath: runner.files[suiteIndex]
    });

    suite['@nightwatch_promise'] = function() {
      return nightwatchSuite.init({suite, nightwatchSuite});
    };

    if (Utils.isUndefined(suite.timeout())) {
      suite.timeout(30000);
    }
  }
};
