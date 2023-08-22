const util = require('util');
const chai = require('@nightwatch/chai');
const assertModule = require('assert');
const EventEmitter = require('events');
const Utils = require('../../utils');
const Element = require('../../element');
const chaiExpect = chai.expect;
const {flag} = chai.util;
const {AssertionRunner} = require('../../assertion');
const namespacedApi = require('../../core/namespaced-api.js');

let __last_deferred__ = null;

module.exports = class StaticAssert {
  static get assertOperators() {
    return {
      ok: ['ok', 'ko'],
      equal: ['==', '!='],
      notEqual: ['!=', '=='],
      deepEqual: ['deepEqual', 'not deepEqual'],
      notDeepEqual: ['not deepEqual', 'deepEqual'],
      strictEqual: ['===', '!=='],
      notStrictEqual: ['!==', '==='],
      deepStrictEqual: ['deep strict equal', 'not deep strict equal'],
      throws: ['throws', 'doesNotThrow'],
      doesNotThrow: ['doesNotThrow', 'throws'],
      match: ['matches', 'does not match'],
      fail: 'fail',
      ifError: 'ifError'
    };
  }

  static get lastDeferred() {
    return __last_deferred__;
  }

  static set lastDeferred(value) {
    __last_deferred__ = value;
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  get commandQueue() {
    return this.nightwatchInstance.queue;
  }

  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
  }

  /**
   * Extends the node.js assert module
   *
   * @param commandName
   * @param abortOnFailure
   * @param apiToReturn
   * @returns {Function}
   */
  createStaticAssertion(commandName, abortOnFailure, apiToReturn) {
    class Assertion extends EventEmitter {
      constructor({negate, args}) {
        super();

        StaticAssert.lastDeferred = null;
        this.negate = negate;
        this.args = args;
        this.passed = null;
        this.expected = null;
        this.actual = null;
        const lastArgument = args[args.length - 1];
        const isLastArgString = Utils.isString(lastArgument);
        this.message = isLastArgString && (args.length > 2 || Utils.isBoolean(args[0])) && lastArgument ||
          Utils.isFunction(args[0]) && '[Function]';
      }

      getMessage(propName) {
        if (!Array.isArray(StaticAssert.assertOperators[propName])) {
          return StaticAssert.assertOperators[propName] || '';
        }

        const operator = (this.passed && !this.negate) ? StaticAssert.assertOperators[propName][0] : StaticAssert.assertOperators[propName][1];

        let message = '';

        if (this.negate) {
          message += ' not ';
        }

        if (this.args.length === 2) {
          this.args.splice(1, 0, operator);
        } else {
          this.args.push(operator);
        }

        this.args = this.args.map(function(argument) {
          if (Utils.isObject(argument)) {
            argument = util.inspect(argument);
          }

          return argument;
        });

        return message + this.args.join(' ');
      }

      assert(propName) {
        try {
          assertModule[propName].apply(null, this.args);
          this.passed = !this.negate;
          this.message = `${this.negate ? 'Failed' : 'Passed'} [${propName}]: ${this.message || this.getMessage(propName)}`;
        } catch (ex) {
          this.passed = !!this.negate;

          if (!this.passed && (ex instanceof Error) && propName === 'fail') {
            this.message = ex.message;
          } else {
            this.message = `${this.negate ? 'Passed' : 'Failed'} [${propName}]: (${ex.message || this.message || this.getMessage(propName)})`;
          }

          if (Utils.isDefined(ex.showTrace)) {
            this.showTrace = ex.showTrace;
          }

          if (Utils.isDefined(ex.link)) {
            this.link = ex.link;
          }

          if (Utils.isDefined(ex.help)) {
            this.help = ex.help;
          }

          this.actual = ex.actual;
          this.expected = ex.expected;
          this.stackTrace = ex.stack;
        }
      }
    }

    return function assertFn({negate, args}) {
      const assertion = new Assertion({negate, args});
      const {reporter, nightwatchInstance} = this;
      assertion.assert(commandName);
      const startTime = new Date();

      const namespace = abortOnFailure ? 'assert' : 'verify';
      const commandFn = () => {
        const {passed, expected, actual, message, stackTrace, showTrace, link, help} = assertion;
        const elapsedTime = new Date() - startTime;

        this.runner = new AssertionRunner({
          passed,
          err: {
            expected, actual
          }, message, calleeFn: assertFn, abortOnFailure, stackTrace, showTrace, reporter, elapsedTime, link, help
        });

        return this.runner.run();
      };

      const isES6Async = nightwatchInstance.isES6AsyncTestcase || nightwatchInstance.settings.always_async_commands;
      const deferred = Utils.createPromise();

      const node = this.commandQueue.add({
        commandName,
        commandFn,
        context: this.api,
        args: [],
        stackTrace: assertFn.stackTrace,
        namespace,
        deferred,
        isES6Async
      });

      if (isES6Async || node.isES6Async) {
        StaticAssert.lastDeferred = deferred;

        Object.assign(node.deferred.promise, apiToReturn || this.api);

        //prevent unhandled rejection
        node.deferred.promise.catch(err => {
          return StaticAssert.lastDeferred.reject(err);
        });

        return node.deferred.promise;
      }

      return apiToReturn || this.api;
    }.bind(this);
  }

  /**
   *
   * @param {object} [parent]
   * @return {ApiLoader}
   */
  loadStaticAssertions(parent = null) {
    Object.keys(assertModule).forEach(prop => {
      let namespace;
      if (parent) {
        namespace = parent.assert = parent.assert || {};
      }

      let apiToReturn;
      if (parent && parent.__is_page_object_cache) {
        apiToReturn = parent;
      }

      const namespacedApiToReturn = (namespace) => {
        return new Proxy(namespacedApi[namespace], {
          get(_, name) {
            return namespacedApi[namespace][name];
          }
        });
      };

      this.nightwatchInstance.setApiMethod(prop, namespace || 'assert', (function(prop) {
        return this.createStaticAssertion(prop, true, apiToReturn);
      }.bind(this))(prop));

      if (!parent) {
        this.nightwatchInstance.setNamespacedApiMethod(prop, 'assert', (function(prop) {
          return this.createStaticAssertion(prop, true, namespacedApiToReturn('assert'));
        }.bind(this))(prop));
      }

      if (this.nightwatchInstance.startSessionEnabled) {
        let namespace;
        if (parent) {
          namespace = parent.verify = parent.verify || {};
        }

        this.nightwatchInstance.setApiMethod(prop, namespace || 'verify', (function(prop) {
          return this.createStaticAssertion(prop, false);
        }.bind(this))(prop));

        if (!parent) {
          this.nightwatchInstance.setNamespacedApiMethod(prop, 'verify', (function(prop) {
            return this.createStaticAssertion(prop, true, namespacedApiToReturn('verify'));
          }.bind(this))(prop));
        }
      }
    });

    return this;
  }

  /**
   * @param {object} [parent]
   */
  loadStaticExpect(parent = null) {
    try {
      this.nightwatchInstance.setApiMethod('expect', parent, (...args) => {
        let obj = args[0];
        const isElement = Element.isElementObject(obj) || Utils.isObject(obj) && obj['@nightwatch_element'];

        if (!(obj instanceof Promise) && !isElement) {
          args[0] = obj = new Promise(resolve => resolve(obj));
        }

        const assertion = chaiExpect(...args);
        if (!obj) {
          return assertion;
        }

        if (isElement) {
          if (obj.isComponent || obj['@nightwatch_component']) {
            return this.api.expect.component(...args);
          }

          return this.api.expect.element(...args);
        }

        flag(assertion, 'actionFn', (opts) => {
          return this.addToQueue(opts);
        });

        return assertion;
      });
    } catch (err) {
      this.nightwatchInstance.setApiMethod('expect', parent, {});
    }

    return this;
  }

  addToQueue() {
    return function assertFn(valueDisplay, assertionName, handlerFn) {
      const abortOnFailure = true;
      const startTime = new Date();
      const namespace = function() {
        return 'expect(<value>)';
      };
      const {nightwatchInstance, reporter} = this;

      const commandFn = () => {
        let passed = true;
        let expected;
        let actual;
        let message = `Expected ${valueDisplay} ${assertionName.join(' ')}: `;
        const stackTrace = '';

        try {
          handlerFn();
        } catch (err) {
          passed = false;
          expected = err.expected;
          actual = err.actual;
          message = err.message;
        }

        const elapsedTime = new Date() - startTime;

        this.runner = new AssertionRunner({
          passed,
          err: {
            expected, actual
          }, message, calleeFn: assertFn, abortOnFailure, stackTrace, reporter, elapsedTime
        });

        return this.runner.run();
      };

      const isES6Async = nightwatchInstance.isES6AsyncTestcase || nightwatchInstance.settings.always_async_commands;
      const deferred = Utils.createPromise();

      const node = this.commandQueue.add({
        commandName: assertionName.join('.'),
        commandFn,
        context: this.api,
        args: [],
        stackTrace: assertFn.stackTrace,
        namespace,
        deferred,
        isES6Async
      });

      if (isES6Async) {
        Object.assign(node.deferred.promise, this.api);

        return node.deferred.promise;
      }

      return this.api;

    }.bind(this);

  }
};
