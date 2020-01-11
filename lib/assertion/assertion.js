const NightwatchAssertError = require('./assertion-error.js');
const Utils = require('../utils');
const {Logger} = Utils;

class NightwatchAssertion {
  static getExpectedMessage({expected, actual}) {
    const expectedMsg = Logger.colors.green(`"${expected}"`);
    const receivedMsg = Logger.colors.red(`"${actual}"`);

    return ` - expected ${expectedMsg} but got: ${receivedMsg}`;
  }

  constructor(message) {
    this.__err = new NightwatchAssertError(message);
    this.__stackTraceTitle = message;
    this.__abortOnFailure = true;

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

  set abortOnFailure(value) {
    this.__abortOnFailure = value;
    this.__err.abortOnFailure = value;
  }

  get abortOnFailure() {
    return this.__abortOnFailure;
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
      this.failureMessage = `Expected "${this.expected}" but got: "${this.actual}"`;
    }

    return this;
  }

  setMessage(needsExpected = true, elapsedTime) {
    const {actual, expected} = this;

    if (expected !== undefined && actual !== undefined && needsExpected) {
      this.message += NightwatchAssertion.getExpectedMessage({
        actual, expected
      }) + ' ' + Logger.colors.stack_trace(`(${elapsedTime}ms)`);
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
    return this.passed ?
      Promise.resolve() :
      Promise.reject();
  }
}

module.exports = NightwatchAssertion;
