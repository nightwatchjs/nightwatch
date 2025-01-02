const {WebElementPromise} = require('selenium-webdriver');

const BaseCommandLoader = require('./_command-loader.js');
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
      const type = AssertionLoader.interfaceMethods[method];
      if (!BaseCommandLoader.isTypeImplemented(instance, method, type)) {
        const methodTypes = method.split('|').map(name => `"${name}"`);

        throw new Error(`Assertion class must implement method/property ${methodTypes.join(' or ')}`);
      }
    });
  }

  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    AssertionLoader.lastDeferred = null;
    this.type = 'assertion';
    this.abortOnFailure = this.globals.abortOnAssertionFailure;
  }

  get timeout() {
    return this.globals.retryAssertionTimeout;
  }

  get rescheduleInterval() {
    return this.globals.waitForConditionPollInterval;
  }

  get globals() {
    return this.api.globals;
  }

  containsES6Class() {
    return this.module.prototype && this.module.prototype.constructor.toString().startsWith('class');
  }

  validateModuleDefinition() {
    if (this.containsES6Class()) {
      return this.validateES6Class();
    }

    return this.validateCJSModule();
  }

  validateCJSModule() {
    if (!(Utils.isObject(this.module) && this.module.assertion)) {
      throw new Error('The assertion module needs to contain an .assertion() method');
    }
  }

  validateES6Class() {
    if (!this.module.prototype.command) {
      throw new Error('Assertion class must implement an command() method');
    }
  }

  createQueuedCommandFn({parent, apiToReturn}) {
    const commandFn = this.commandFn.bind(this);
    const {commandQueue, commandName, namespace, api, nightwatchInstance} = this;

    return function queuedCommandFn({negate, args}) {
      const stackTrace = Utils.getOriginalStackTrace(queuedCommandFn);

      // we only should return a Promise if not a nightwatch element, otherwise we risk breaking changes
      const element = args[0];
      const shouldReturnPromise = element && !(element instanceof WebElementPromise) && (element.sessionId && element.elementId || element.driver_ && element.id_);
      const deferred = Utils.createPromise();
      const isES6Async = shouldReturnPromise || nightwatchInstance.settings.always_async_commands ||
        (Utils.isUndefined(this.isES6Async) ? nightwatchInstance.isES6AsyncTestcase : this.isES6Async);

      const node = commandQueue.add({
        commandName,
        commandFn,
        context: this,
        args,
        options: {
          negate
        },
        stackTrace,
        namespace,
        deferred,
        isES6Async
      });

      if (isES6Async) {
        AssertionLoader.lastDeferred = deferred;

        commandQueue.tree.once('asynctree:finished', (err) => {
          node.deferred.resolve(node.resolveValue);
        });

        if (parent && parent.__pageObjectItem__) {
          Object.assign(node.deferred.promise, parent.__pageObjectItem__);
        } else {
          Object.assign(node.deferred.promise, apiToReturn || api);
        }

        // prevent unhandledRejection errors
        node.deferred.promise.catch(err => {
          // null check, as done for BaseLoader.lastDeferred as well.
          if (AssertionLoader.lastDeferred) {
            return AssertionLoader.lastDeferred.reject(err);
          }
        });

        return node.deferred.promise;
      }

      return apiToReturn || api;
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
