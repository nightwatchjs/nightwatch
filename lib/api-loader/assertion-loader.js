const util = require('util');
const EventEmitter = require('events');
const Utils = require('../util/utils.js');
const BaseCommandLoader = require('./_base-loader.js');
const AssertionRunner = require('./assertion-runner.js');
const Element = require('../element/element.js');

class AssertionLoader extends BaseCommandLoader {
  static get interfaceMethods() {
    return {
      expected: '*',
      message: '*',
      pass: 'function',
      value: 'function',
      command: 'function'
    };
  }

  static createInstance({nightwatchInstance, module, fileName, args}) {
    const AssertionModule = module.assertion;
    util.inherits(AssertionModule, EventEmitter);

    class AssertionInstance extends AssertionModule {
      constructor() {
        super(...args);

        this.message = String(this.message);
        EventEmitter.prototype.constructor.call(this);
      }

      set args(value) {
        throw new Error(`Attempting to override ".args" which is a reserved property in "${fileName}".`);
      }

      set elementSelector(value) {
        throw new Error(`Attempting to override ".elementSelector" which is a reserved property in "${fileName}".`);
      }

      set api(value) {
        throw new Error(`Attempting to override ".api" which is a reserved property in "${fileName}".`);
      }

      get args() {
        return args;
      }

      get api() {
        return nightwatchInstance.api;
      }

      /**
       * @deprecated
       */
      get client() {
        return nightwatchInstance.client;
      }

      get elementSelector() {
        if (this.args[0] instanceof Element) {
          return this.args[0].toString();
        }

        if (Utils.isObject(this.args[0]) && this.args[0].selector) {
          return this.args[0].selector || '';
        }

        return this.args[0];
      }
    }

    const instance = new AssertionInstance();

    Object.keys(AssertionLoader.interfaceMethods).forEach(method => {
      let type = AssertionLoader.interfaceMethods[method];
      if (!BaseCommandLoader.isTypeImplemented(instance, method, type)) {
        throw new Error(`Assertion class must implement method/property ${method}`);
      }
    });

    return instance;
  }

  static runAssertion(instance, opts) {
    const assertionRun = new AssertionRunner(instance, opts);

    assertionRun.executeCommand();

    return assertionRun.deferred.promise;
  }

  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.type = 'assertion';
    this.abortOnFailure = this.globals.abortOnAssertionFailure;
    this.timeout = this.globals.retryAssertionTimeout;
    this.rescheduleInterval = this.globals.waitForConditionPollInterval;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  get globals() {
    return this.api.globals;
  }

  validateModuleDefinition() {
    if (!(Utils.isObject(this.module) && this.module.assertion)) {
      throw new Error('The assertion module needs to contain an .assertion() method');
    }
  }

  createWrapper(abortOnFailure) {
    if (this.module) {
      this.validateModuleDefinition();
      this.abortOnFailure = abortOnFailure;

      this.commandFn = function commandFn({args, stackTrace}) {
        return this.resolveElementSelector(args)
          .then(elementResult => {
            if (elementResult) {
              args[0] = elementResult;
            }

            const {nightwatchInstance, reporter, abortOnFailure, module, fileName} = this;
            const instance = AssertionLoader.createInstance({
              nightwatchInstance,
              module,
              fileName,
              args
            });

            return AssertionLoader.runAssertion(instance, {
              stackTrace,
              rescheduleInterval: Utils.isNumber(instance.rescheduleInterval) ? instance.rescheduleInterval : this.rescheduleInterval,
              timeout: Utils.isNumber(instance.retryAssertionTimeout) ? instance.retryAssertionTimeout : this.timeout,
              abortOnFailure,
              reporter
            });
          });
      };
    }

    return this;
  }
}

module.exports = AssertionLoader;
