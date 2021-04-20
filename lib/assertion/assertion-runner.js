const NightwatchAssertion = require('./assertion.js');
const {Logger, Screenshots} = require('../utils');

module.exports = class AssertionRunner {
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
  constructor(opts = {}, nightwatchInstance) {
    this.opts = opts;
    this.nightwatchApi = nightwatchInstance.api;
    this.nightwatchInstance = nightwatchInstance;
    this.create();
  }

  create() {
    const {passed, err, calleeFn = null, message = '', abortOnFailure = true, stackTrace = ''} = this.opts;

    this.assertion = new NightwatchAssertion(message);
    this.assertion.expected = err.expected;
    this.assertion.actual = err.actual;
    this.assertion.passed = passed;
    this.assertion.stackTrace = stackTrace || calleeFn && calleeFn.stackTrace;
    this.assertion.calleeFn = calleeFn;
    this.assertion.abortOnFailure = abortOnFailure;
    this.assertion.stackTraceTitle = true;
  }

  shouldTakeScreenshot() {
    return this.nightwatchApi.options.screenshots.enabled && this.nightwatchApi.options.screenshots.on_failure;
  }

  takeScreenshot() {
    return new Promise((resolve, ) => {
      Logger.info(`Failures in "${this.nightwatchApi.currentTest.name}". Taking screenshot...`);
      const fileNamePath = Screenshots.getFileName({
        testSuite: this.nightwatchApi.currentTest.module,
        testCase: this.nightwatchApi.currentTest.name
      }, this.nightwatchInstance.options.screenshots);

      this.nightwatchApi.saveScreenshot(fileNamePath, (result, err) => {
        if (!err && this.nightwatchInstance.transport.isResultSuccess(result))  {
          const assertions = this.nightwatchApi.currentTest.results.assertions || [];
          if (assertions.length > 0) {
            const currentAssertion = assertions[assertions.length-1];
            if (currentAssertion) {
              currentAssertion.screenshots = currentAssertion.screenshots || [];
              currentAssertion.screenshots.push(fileNamePath);
            }
          }
        } else {
          Logger.warn('Error saving screenshot...', err || result);
        }
        resolve();
      });
    }); 
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

      reporter.logFailedAssertion(error);
      reporter.registerFailed(error);

      assertResult = error;
    }

    reporter.logAssertResult(this.assertion.getAssertResult());

    if (isError) {
      if(this.nightwatchApi.sessionId && this.shouldTakeScreenshot()){
        await this.takeScreenshot();
      }
      return Promise.reject(assertResult);
    }

    const promiseResult = Object.assign({}, commandResult);
    promiseResult.returned = 1;

    return Promise.resolve(promiseResult);
  }
};
