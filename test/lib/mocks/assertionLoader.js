const common = require('../../common.js');
const MockClient = require('../mockclient.js');

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
    const AssertionLoader = common.requireMock('api/_loaders/assertion.js', this.commandName, this.assertionModule, assertCallback, doneCallback);
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
      commandFn.call(context, {args, stackTrace});
    });

    return loader;
  }
}

module.exports = AssertionLoaderMock;
