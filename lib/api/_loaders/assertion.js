const BaseCommandLoader = require('./_base-loader.js');
const Utils = require('../../utils');
const AssertionInstance = require('../assertions/_assertionInstance.js');
const Scheduler = require('./assertion-scheduler.js');

class AssertionLoader extends BaseCommandLoader {
  static get interfaceMethods() {
    return {
      expected: '*',
      'pass|evaluate': 'function',
      command: 'function'
    };
  }

  static validateAssertClass(instance) {
    Object.keys(AssertionLoader.interfaceMethods).forEach(method => {
      let type = AssertionLoader.interfaceMethods[method];
      if (!BaseCommandLoader.isTypeImplemented(instance, method, type)) {
        const methodTypes = method.split('|').map(name => `"${name}"`);

        throw new Error(`Assertion class must implement method/property ${methodTypes.join(' or ')}`);
      }
    });
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

  getQueuedCommandFn() {
    const commandFn = this.commandFn.bind(this);
    const {commandQueue, commandName, namespace} = this;

    return function queuedCommandFn({negate, args}) {
      const stackTrace = AssertionLoader.getOriginalStackTrace(queuedCommandFn);

      commandQueue.add({
        commandName,
        commandFn,
        context: this,
        args,
        options: {
          negate
        },
        stackTrace,
        namespace
      });

      return this.api;
    }.bind(this);
  }

  createWrapper(abortOnFailure) {
    if (this.module) {
      this.validateModuleDefinition();
      this.abortOnFailure = abortOnFailure;

      this.commandFn = function commandFn({args, stackTrace, options}) {
        return this.resolveElementSelector(args)
          .then(elementResult => {
            if (elementResult) {
              args[0] = elementResult;
            }

            const {nightwatchInstance, reporter, abortOnFailure, module, fileName} = this;
            const instance = AssertionInstance.create({
              nightwatchInstance,
              assertionModule: module,
              fileName,
              args,
              options
            });

            AssertionLoader.validateAssertClass(instance);

            this.__instance = instance;

            return Scheduler.create(instance, {
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
