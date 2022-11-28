const NightwatchAssertion = require('./assertion.js');
const Utils = require('../utils/');
const {Logger} = Utils;

module.exports = class AssertionRunner {
  /**
   * This is deprecated. No longer possible to check the httpStatusCode of the command.
   *
   * @deprecated
   * @param result
   * @returns {boolean|boolean|*}
   */
  static isServerError(result = {}) {
    if (!result) {
      return false;
    }

    const {status, error, httpStatusCode} = result;

    return (status === -1 && error && httpStatusCode && httpStatusCode.toString().startsWith('5'));
  }

  /**
   * @param opts = {passed, err, calleeFn, message, stackTrace, abortOnFailure, reporter, addExpected = true}
   */
  constructor(opts = {}) {
    this.opts = opts;
    this.create();
  }

  create() {
    const {passed, err, calleeFn = null, message = '', abortOnFailure = true, stackTrace = '', showTrace, link, help} = this.opts;

    this.assertion = new NightwatchAssertion(message);
    if (Utils.isDefined(showTrace)) {
      this.assertion.showTrace = showTrace;
    }

    if (Utils.isDefined(help)) {
      this.assertion.help = help;
    }

    if (Utils.isDefined(link)) {
      this.assertion.link = link;
    }

    this.assertion.failure = !passed && !err.actual;
    this.assertion.expected = err.expected;
    this.assertion.actual = err.actual;
    this.assertion.passed = passed;
    this.assertion.stackTrace = stackTrace || calleeFn && calleeFn.stackTrace;
    this.assertion.calleeFn = calleeFn;
    this.assertion.abortOnFailure = abortOnFailure;
    this.assertion.stackTraceTitle = true;
  }

  async run(commandResult = {value: null}) {
    const {reporter} = this.opts;
    let assertResult;
    let isError = false;

    if (commandResult && AssertionRunner.isServerError(commandResult)) {
      const errorMessage = commandResult.error || 'Unknown server error';
      this.assertion.passed = false;
      this.assertion.actual = `Server Error: ${errorMessage}`;
    }

    try {
      await this.assertion.assert();
      reporter.registerPassed(this.assertion.message);
    } catch (e) {
      const {error} = this.assertion;
      error.abortOnFailure = this.opts.abortOnFailure;
      isError = true;
      const {addExpected = true, elapsedTime} = this.opts;
      this.assertion.buildStackTrace().setMessage(addExpected, elapsedTime).setFailedMessage();

      Logger.error(error);
      reporter.registerFailed(error);

      assertResult = error;
    }

    reporter.logAssertResult(this.assertion.getAssertResult());

    if (isError) {
      return Promise.reject(assertResult);
    }

    const promiseResult = Object.assign({}, commandResult);
    promiseResult.returned = 1;

    return Promise.resolve(promiseResult);
  }
};
