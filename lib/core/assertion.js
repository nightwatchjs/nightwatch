const Logger = require('../util/logger.js');
const Utils = require('../util/utils.js');
const Reporter = require('../core/reporter.js');

class AssertionError extends Error {
  constructor(...params) {
    super(...params);

    this.name = 'AssertionError';

    Error.captureStackTrace(this, AssertionError);
  }
}

class NightwatchAssertion {
  constructor(message) {
    this.__err = new AssertionError();
    this.__stackTraceTitle = message;

    this.failureMessage = '';

    this.message = message;
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

  /**
   *
   * @param {boolean} passed
   * @param {object} err
   * @param {function} calleeFn
   * @param {string} message
   * @param {string} stackTrace
   * @param {boolean} abortOnFailure
   * @return {*}
   */
  static runAssertion(passed, err, calleeFn = null, message = '', abortOnFailure = true, stackTrace = '') {
    let assertion = new NightwatchAssertion(message);
    assertion.expected = err.expected;
    assertion.actual = err.actual;
    assertion.passed = passed;
    assertion.stackTrace = stackTrace || calleeFn.stackTrace;
    assertion.calleeFn = calleeFn;
    assertion.abortOnFailure = abortOnFailure;
    assertion.stackTraceTitle = true;
    assertion.assert();

    return assertion.assert();
  }
}

module.exports = NightwatchAssertion;

