const common = require('../../common.js');

class AssertionLoaderMock {
  constructor(assertionModule, commandName, settings, mockReporter = {}) {
    this.assertionModule = common.require(assertionModule);
    this.settings = settings;
    this.commandName = commandName;
    this.client = new MockClient(settings, mockReporter);
  }

  /**
   * --
   * getText: function (cssSelector, callback) {
   *   callback({value: returnValue});
   * }
   * --
   *
   * @param {string} name
   * @param {function} fn
   */
  setApiMethod(name, fn) {
    this.client.api[name] = fn;

    return this;
  }

  /**
   * function (commandName, command, context, args, stackTrace) {}
   *
   * @param {function} fn
   */
  setAddToQueueFn(fn) {
    this.client.addToQueueFn = fn;

    return this;
  }

  /**
   *
   * @param {function} assertCallback
   * @param {function} doneCallback
   */
  loadAssertion(assertCallback, doneCallback) {
    const AssertionLoader = common.requireMock('api-loader/assertion-loader.js', this.commandName, this.assertionModule, assertCallback, doneCallback);
    let loader = new AssertionLoader(this.client);

    loader.loadModule()
      .setNamespace('assert')
      .createWrapper(true)
      .define();

    return loader;
  }

  static create(module, commandName, settings = {}) {
    const mockReporter = {
      registerPassed(message) {
      },
      logFailedAssertion(error) {
      },
      registerFailed() {
      },
      logAssertResult(test) {
      }
    };

    let loader = new AssertionLoaderMock(module, commandName, settings, mockReporter);

    loader.setAddToQueueFn(function({commandName, commandFn, context, args, stackTrace}) {
      commandFn.apply(context, args);
    });

    return loader;
  }
}

class MockClient {
  get options() {
    return this.settings;
  }

  get session() {
    return {
      commandQueue: {
        add: (...args) => {
          return this.addToQueueFn.apply(this, args);
        }
      }
    };
  }

  constructor(settings, reporter = {}, addToQueueFn = function() {}) {
    this.settings = settings;
    this.addToQueueFn = addToQueueFn;
    this.locateStrategy = '';

    this.setLocateStrategy();

    this.api = {
      assert: {},
      globals: {
        retryAssertionTimeout: 5,
        waitForConditionPollInterval: 10
      }
    };

    if (settings.globals) {
      Object.assign(this.api.globals, settings.globals);
    }

    this.client = {
      options: this.settings,
      api: this.api,
      locateStrategy: this.locateStrategy
    };

    this.reporter = reporter;
  }

  setLocateStrategy() {
    this.locateStrategy = this.settings.use_xpath ? 'xpath' : 'css selector';

    return this;
  }

  isApiMethodDefined(commandName, namespace) {
    return false;
  }

  setApiMethod(commandName, namespace, commandFn) {
    this.api[namespace] = this.api[namespace] || {};

    this.api[namespace][commandName] = function(...args) {
      return commandFn.apply(this, args);
    };

    return this;
  }
}

module.exports = AssertionLoaderMock;
