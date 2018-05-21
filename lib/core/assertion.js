const Logger = require('../util/logger.js');
const Utils = require('../util/utils.js');
const AssertionError = require('assertion-error');

class NightwatchAssertError extends AssertionError {}

class NightwatchAssertion {
  constructor(message) {
    this.__err = new NightwatchAssertError(message);
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

  setFailedMessage() {
    if (this.expected !== undefined && this.actual !== undefined) {
      let expectedMsg = Logger.colors.green(`"${this.expected}"`);
      let receivedMsg = Logger.colors.red(`"${this.actual}"`);

      this.failureMessage = `Expected "${this.expected}" but got: "${this.actual}"`;
      this.message += ` - expected ${expectedMsg} but got: ${receivedMsg}`;
    }

    this.error.message = this.message;

    return this;
  }

  getAssertResult() {
    return {
      message : this.message,
      stackTrace : this.passed ? '' : this.error.stack,
      fullMsg : this.message,
      failure : this.failureMessage !== '' ? this.failureMessage : false
    };
  }

  captureStackTrace(calleeFn) {
    Error.captureStackTrace(this.error, calleeFn);

    return this.error.stack;
  }

  assert() {
    return new Promise((resolve, reject) => {
      if (this.passed) {
        resolve();
      } else {
        reject();
      }
    });
  }

  run(reporter, emitter) {
    return this.assert()
      .then(_ => {
        reporter.registerPassed(this.message);

        return true;
      })
      .catch(_ => {
        this.buildStackTrace().setFailedMessage();

        reporter.logFailedAssertion(this.error);
        reporter.registerFailed(this.error);

        return this.error;
      })
      .then(result => {
        let isError = result instanceof Error;

        reporter.logAssertResult(this.getAssertResult());

        if (isError) {
          emitter.emit('error', result, this.abortOnFailure);
        } else {
          emitter.emit('complete');
        }
      });
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
  static create(passed, err, calleeFn = null, message = '', abortOnFailure = true, stackTrace = '') {
    let assertion = new NightwatchAssertion(message);
    assertion.expected = err.expected;
    assertion.actual = err.actual;
    assertion.passed = passed;
    assertion.stackTrace = stackTrace || calleeFn && calleeFn.stackTrace;
    assertion.calleeFn = calleeFn;
    assertion.abortOnFailure = abortOnFailure;
    assertion.stackTraceTitle = true;

    return assertion;
  }
}

module.exports = NightwatchAssertion;
module.exports.AssertionError = NightwatchAssertError;

