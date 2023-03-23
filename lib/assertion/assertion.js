const NightwatchAssertError = require('./assertion-error.js');
const Utils = require('../utils');
const {Logger, stringifyObject} = Utils;

class NightwatchAssertion {
  static getExpectedMessage({expected, actual}) {
    [expected, actual] = stringifyObject([expected, actual]);

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
    this.failure = false;
  }

  get error() {
    return this.__err;
  }

  set stackTraceTitle(val) {
    this.__stackTraceTitle = val ? null : `AssertionError: ${this.message}`;
  }

  set showTrace(value) {
    this.__err.showTrace = value;
  }

  set link(value) {
    this.__err.link = value;
  }

  set help(value) {
    this.__err.help = value;
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
    const result = {
      name: this.error.name,
      message: this.message,
      stackTrace: this.passed ? '' : this.error.stack,
      fullMsg: this.message,
      failure: this.failureMessage !== '' ? this.failureMessage : this.failure
    };

    if (Utils.isDefined(this.error.link)) {
      result.link = this.error.link;
    }

    if (Utils.isDefined(this.error.help)) {
      result.help = this.error.help;
    }

    return result;
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
