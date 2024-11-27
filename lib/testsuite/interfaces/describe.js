const Utils = require('../../utils');
const Common = require('./common.js');

/*
describe('test suite', function() {

  this.timeout(1000);
});
*/

class DescribeInstance {
  constructor({describeTitle, instance, client}) {
    this['[instance]'] = instance;
    this['[attributes]'] = {};
    this['[client]'] = client;
    this.define('@name', describeTitle);
  }

  /////////////////////////////////////////////////
  // Attributes
  /////////////////////////////////////////////////
  get name() {
    return this['[attributes]']['@name'];
  }

  set tags(value) {
    this.define('@tags', value);
  }

  get tags() {
    return this['[attributes]']['@tags'];
  }

  set unitTest(value) {
    this.define('@unitTest', value);
  }

  get unitTest() {
    return this['[attributes]']['@unitTest'];
  }

  set endSessionOnFail(value) {
    this.define('@endSessionOnFail', value);
  }

  get endSessionOnFail() {
    return this['[attributes]']['@endSessionOnFail'];
  }

  set skipTestcasesOnFail(value) {
    this.define('@skipTestcasesOnFail', value);
  }

  get skipTestcasesOnFail() {
    return this['[attributes]']['@skipTestcasesOnFail'];
  }

  set disabled(value) {
    this.define('@disabled', value);
  }

  get disabled() {
    return this['[attributes]']['@disabled'];
  }

  set desiredCapabilities(value) {
    if (Utils.isObject(value) || Utils.isFunction(value)) {
      this.define('@desiredCapabilities', value);
    }
  }

  get desiredCapabilities() {
    return this['[client]'].initialCapabilities;
  }
  /////////////////////////////////////////////////
  // Getters
  /////////////////////////////////////////////////
  get page() {
    if (this['[client]'] && this['[client]'].api) {
      return this['[client]'].api.page;
    }

    return null;
  }

  get globals() {
    return this.settings.globals;
  }

  get settings() {
    if (this['[client]']) {
      return this['[client]'].settings;
    }

    return this['[instance]'].settings;
  }

  get argv() {
    return this['[instance]'].argv;
  }

  timeout(value) {
    this.globals.waitForConditionTimeout = value;
    this.globals.retryAssertionTimeout = value;
    this.globals.unitTestsTimeout = value;
  }

  waitForTimeout(value) {
    if (typeof value == 'undefined') {
      return this.globals.waitForConditionTimeout;
    }

    return this.timeout(value);
  }

  waitForRetryInterval(value) {
    if (typeof value == 'undefined') {
      return this.globals.waitForConditionPollInterval;
    }

    return this.retryInterval(value);
  }

  retryInterval(value) {
    this.globals.waitForConditionPollInterval = value;
  }

  retries(n) {
    this['[instance]'].setTestcaseRetries(n);
  }

  suiteRetries(n) {
    this['[instance]'].setSuiteRetries(n);
  }

  define(name, value) {
    this['[attributes]'][name] = value;

    const isAttributeValid = Object.keys(Common.DEFAULT_ATTRIBUTES).includes(name) ||
      Object.keys(Common.DEFAULT_ATTRIBUTES).includes(`@${name}`);

    if (isAttributeValid) {
      if (!name.startsWith('@')) {
        name = `@${name}`;
      }

      return this['[instance]'].setAttribute(name, value);
    }

    // eslint-disable-next-line no-console
    console.warn(`Attribute "${name}" is not a valid attribute. Valid attributes are: ${Object.keys(Common.DEFAULT_ATTRIBUTES).join(', ')}.`);
  }
}

class Describe extends Common {
  constructor(instance, client = null) {
    super(instance);

    this.describeFn = null;
    this.client = client;
    this.describeInstance = null;
    this.describeTitle = null;
    this.instance.on('pre-require', (context) => this.createInterface(context));
  }

  createInstance(runOnly) {
    if (!Utils.isFunction(this.describeFn)) {
      throw new Error(`The describe/context must be a function. ${typeof this.describeFn} given.`);
    }

    const {describeTitle, instance, describeFn, client} = this;
    this.describeInstance = new DescribeInstance({
      describeTitle, instance, client
    });

    const {describeInstance} = this;
    describeFn.call(describeInstance);

    this.instance.setDescribeContext({describeTitle, describeInstance, runOnly});
  }

  /**
   * Adds before, after, beforeEach, afterEach hooks to test suite
   *
   * @param context
   */
  addHooks(context) {
    const hooksContext = Common.TestHooks.reduce((prev, hookName) => {
      prev[hookName] = hookFn => {
        this.instance.addTestHook(hookName, hookFn, this.describeInstance);
      };

      return prev;
    }, {});

    Object.assign(context, hooksContext);
  }

  addRun(context) {
    context.run = function() {
      // TODO: implement
    };
  }

  createTestsuite({title, describeFn, context, runOnly = false}) {
    this.describeFn = describeFn;
    this.describeTitle = title;
    if (this.describeFn) {
      this.createInstance(runOnly);
      const testsuite = require.cache[this.instance.modulePath];
      if (testsuite && testsuite.exports) {
        testsuite.exports['[@nightwatchDescribe]'] = true;
      }
    }
  }

  addDescribe(context) {
    context.xmodule = {};
    context.describe =
      context.context = (title, describeFn) => {
        this.createTestsuite({
          context,
          title,
          describeFn
        });
      };

    context.xdescribe =
      context.xcontext =
        context.describe.skip = (title, describeFn) => {
          this.instance.once('module-loaded', () => {
            // in case tests have been declared using other interfaces (e.g. exports),
            // we do not want to disable the suite.
            if (this.instance.tests.length === 0) {
              // if no tests are added after all interfaces are loaded, disable the suite.
              this.instance.setAttribute('@disabled', true);
            }
          });
        };

    context.describe.only = (title, describeFn) => {
      this.createTestsuite({
        title, describeFn, context, runOnly: true
      });
    };
  }

  addTest(context) {
    context.it =
    context.specify =
    context.test = (testName, testFn) => {
      this.instance.addTestCase({testName, testFn, describeInstance: this.describeInstance});
    };

    context.xit       =
    context.xspecify  =
    context.xtest     =
    context.it.skip   =
    context.test.skip = (testName) => {
      this.instance.addTestCase({testName, testFn: function() {}, describeInstance: this.describeInstance, skipTest: true});
    };

    context.it.only =
    context.specify.only =
    context.test.only = (testName, testFn) => {
      this.instance.addTestCase({testName, testFn, describeInstance: this.describeInstance, runOnly: true});
    };
  }

  shouldReloadModuleCache() {
    if (this.instance.shouldReloadModuleCache()) {
      return true;
    }

    if (require.cache && require.cache[this.instance.modulePath]) {
      const testsuiteModule = require.cache[this.instance.modulePath];
      if (testsuiteModule.exports && testsuiteModule.exports['[@nightwatchDescribe]']) {
        return true;
      }
    }

    return false;
  }

  createInterface(context) {
    // for suiteRetries to work with describe interface we need to re-require the file and clear the require cache
    if (this.shouldReloadModuleCache()) {
      delete require.cache[this.instance.modulePath];
    }

    this.addHooks(context);
    this.addRun(context);
    this.addDescribe(context);
    this.addTest(context);
  }
}

module.exports = Describe;
