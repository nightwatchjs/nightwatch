const util = require('util');
const events = require('events');
const BaseCommand = require('./base-command.js');
const Logger = require('../../util/logger.js');
const Utils = require('../../util/utils.js');
const Reporter = require('../../core/reporter.js');

class AssertionError extends Error {
  constructor(...params) {
    super(...params);

    this.name = 'AssertionError';

    Error.captureStackTrace(this, AssertionError);
  }
}

class Assertion {
  constructor(message) {
    this.__err = new AssertionError();
    this.__stackTraceTitle = undefined;

    this.failureMessage = '';

    this.message = message;
    this.stackTraceTitle = message;
    this.calleeFn = undefined;
    this.actual = undefined;
    this.expected = undefined;
    this.stackTrace = undefined;
    this.passed = undefined;
  }

  get error() {
    return this.__err;
  }

  set stackTraceTitle(val) {
    this.__stackTraceTitle = val ? null : `AssertionError: ${this.message}`;
  }

  get stackTraceTitle() {
    return this.__stackTraceTitle;
  }

  buildStackTrace() {
    let stackTrace = this.stackTrace || this.captureStackTrace(this.calleeFn);
    let sections = stackTrace.split('\n');

    sections.shift();

    if (this.stackTraceTitle) {
      sections.unshift(this.stackTraceTitle);
    }

    this.error.stack = Utils.stackTraceFilter(sections);

    return this;
  }

  logPassed() {
    Logger.logDetailedMessage(` ${Logger.colors.green(Utils.symbols.ok)} ${this.message}`);
    Reporter.incrementPassedNo();
  }

  logFailed() {
    //this.error.message = `${this.message} - ${this.failureMessage}`;

    if (this.expected !== undefined && this.actual !== undefined) {
      let expectedMsg = Logger.colors.green(`"${this.expected}"`);
      let receivedMsg = Logger.colors.red(`"${this.actual}"`);

      this.failureMessage = `Expected "${this.expected}" but got: "${this.actual}"`;
      this.message += ` - expected ${expectedMsg} but got: ${receivedMsg}`;
    }

    Logger.logDetailedMessage(` ${Logger.colors.red(Utils.symbols.fail)} ${this.message}`);

    let sections = this.error.stack.split('\n');
    Logger.logDetailedMessage(` ${Logger.colors.stack_trace(sections.join('\n'))} \n`);

    Reporter.setLastError(this.error);
    Reporter.incrementFailedNo();
  }

  logTestResult() {
    Reporter.addTestToResults({
      message : this.message,
      stackTrace : this.passed ? '' : this.error.stack,
      fullMsg : this.message,
      failure : this.failureMessage !== '' ? this.failureMessage : false
    });
  }

  captureStackTrace(calleeFn) {
    Error.captureStackTrace(this.error, calleeFn);

    return this.error.stack;
  }

  assert() {
    if (this.passed) {
      this.logPassed();
    } else {
      this.buildStackTrace();
      this.logFailed();
    }

    this.logTestResult();
  }
}

class NightwatchAssertion extends BaseCommand {
  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.assertion = null;
    this.retries = 0;
    this.startTime = new Date().getTime();
    this.globals = this.api.globals || {};
    this.timeout = this.globals.retryAssertionTimeout || 0; //ms
    this.rescheduleInterval = this.globals.waitForConditionPollInterval || 500; //ms
    this.shouldRetry = this.timeout > 0;
  }

  set abortOnFailure(val) {
    this.__abortOnFailure = val;
  }

  get abortOnFailure() {
    return this.__abortOnFailure;
  }

  static get interfaceMethods() {
    return {
      expected: '*',
      message: '*',
      pass: 'function',
      value: 'function',
      command: 'function'
    };
  }

  createInstance(AssertionModule, moduleArgs) {
    const nightwatchInstance = this.nightwatchInstance;

    util.inherits(AssertionModule, events.EventEmitter);

    class AssertionInstance extends AssertionModule {

      constructor() {
        super(...moduleArgs);

        events.EventEmitter.call(this);
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

      complete(...args) {
        args.unshift('complete');

        setImmediate(() => {
          this.emit.apply(this, args);
        });
      }
    }

    this.__instance = new AssertionInstance();
  }

  executeCommand() {
    Object.keys(NightwatchAssertion.interfaceMethods).forEach(method => {
      let type = NightwatchAssertion.interfaceMethods[method];
      if (!this.isTypeImplemented(method, type)) {
        throw new Error(`Assertion class must implement method/property ${method}`);
      }
    });

    return this.scheduleAssertion();
  }

  runAssertion(passed, value, calleeFn, message) {
    let expected = typeof this.instance.expected == 'function' ? this.instance.expected() : this.instance.expected;

    this.assertion = new Assertion(message);
    this.assertion.expected = expected;
    this.assertion.actual = value;
    this.assertion.passed = passed;
    this.assertion.stackTrace = this.stackTrace;
    this.assertion.calleeFn = calleeFn;
    this.assertion.abortOnFailure = this.abortOnFailure;
    this.assertion.stackTraceTitle = this.nightwatchInstance.startSessionEnabled;
    this.assertion.assert();

    return this;
  }

  scheduleAssertion() {
    this.instance.command(function commandCallback(result) {
      let passed;
      let value;

      if (typeof this.instance.failure == 'function' && this.instance.failure.call(this.instance, result)) {
        passed = false;
        value = null;
      } else {
        value = this.instance.value.call(this.instance, result);
        passed = this.instance.pass.call(this.instance, value);
      }

      let timeSpent = new Date().getTime() - this.startTime;
      if (!passed && timeSpent < this.timeout) {
        return this.reschedule();
      }

      let message = this.getFullMessage(passed, timeSpent);
      this.runAssertion(passed, value, commandCallback, message);

      if (!passed && this.abortOnFailure) {
        this.nightwatchInstance.terminate(true);
      }

      setImmediate(() => {
        this.emit('complete');
      });
    }.bind(this));

    return this.api;
  }

  getFullMessage(passed, timeSpent) {
    if (!this.shouldRetry) {
      return this.instance.message;
    }

    let timeLogged = passed ? timeSpent : this.timeout;

    return `${this.instance.message} after ${timeLogged} milliseconds.`;
  }

  reschedule() {
    setTimeout(() => {
      this.retries++;
      this.scheduleAssertion();
    }, this.rescheduleInterval);

    return this;
  }
}

module.exports = NightwatchAssertion;

