const util = require('util');
const assertModule = require('assert');
const EventEmitter = require('events');
const Utils = require('../../utils');
const {AssertionRunner} = require('../../assertion');

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
      throws: ['throws', 'doesNotThrow'],
      doesNotThrow: ['doesNotThrow', 'throws'],
      fail: 'fail',
      ifError: 'ifError'
    };
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  get commandQueue() {
    return this.nightwatchInstance.session.commandQueue;
  }

  constructor(nightwatchInstance) {
    this.nightwatchInstance = nightwatchInstance;
  }

  /**
   * Extends the node.js assert module
   *
   * @param commandName
   * @param abortOnFailure
   * @returns {Function}
   */
  createStaticAssertion(commandName, abortOnFailure) {
    class Assertion extends EventEmitter {
      constructor({negate, args}) {
        super();

        this.negate = negate;
        this.args = args;
        this.passed = null;
        this.expected = null;
        this.actual = null;
        let lastArgument = args[args.length - 1];
        let isLastArgString = Utils.isString(lastArgument);
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
          this.message = `${this.negate ? 'Passed' : 'Failed'} [${propName}]: (${ex.message || this.message || this.getMessage(propName)})`;
          this.actual = ex.actual;
          this.expected = ex.expected;
          this.stackTrace = ex.stack;
        }
      }
    }

    return function assertFn({negate, args}) {
      const assertion = new Assertion({negate, args});
      const {reporter} = this;
      assertion.assert(commandName);
      const startTime = new Date();

      const namespace = abortOnFailure ? 'assert' : 'verify';
      const commandFn = () => {
        const {passed, expected, actual, message, stackTrace} = assertion;
        const elapsedTime = new Date() - startTime;

        this.runner = new AssertionRunner({
          passed,
          err: {
            expected, actual
          }, message, calleeFn: assertFn, abortOnFailure, stackTrace, reporter, elapsedTime
        });

        return this.runner.run();
      };

      this.commandQueue.add({
        commandName,
        commandFn,
        context: this.api,
        args: [],
        stackTrace: assertFn.stackTrace,
        namespace
      });

      return this.api;
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

      this.nightwatchInstance.setApiMethod(prop, namespace || 'assert', (function(prop) {
        return this.createStaticAssertion(prop, true);
      }.bind(this))(prop));

      if (this.nightwatchInstance.startSessionEnabled) {
        let namespace;
        if (parent) {
          namespace = parent.verify = parent.verify || {};
        }

        this.nightwatchInstance.setApiMethod(prop, namespace || 'verify', (function(prop) {
          return this.createStaticAssertion(prop, false);
        }.bind(this))(prop));
      }
    });

    return this;
  }

  /**
   * @param {object} [parent]
   */
  loadStaticExpect(parent = null) {
    try {
      const chaiExpect = module.require('chai').expect;
      this.nightwatchInstance.setApiMethod('expect', parent, function() {
        return chaiExpect.apply(chaiExpect, arguments);
      });
    } catch (err) {
      this.nightwatchInstance.setApiMethod('expect', parent, {});
    }

    return this;
  }
};
