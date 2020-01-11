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
      page: {},
      verify: {},
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

module.exports = MockClient;
