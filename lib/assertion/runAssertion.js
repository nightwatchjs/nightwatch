const Utils = require('../utils');
const Element = require('../element');
const {Logger} = Utils;

class AssertionRunner {
  get instance() {
    return this.__instance;
  }

  get opts() {
    return this.__opts;
  }

  /**
   * @param {AssertionLoader} instance
   * @param {{rescheduleInterval, abortOnFailure, stackTrace, timeout, reporter}} opts
   */
  constructor(instance, opts = {}) {
    this.retries = 0;
    this.deferred = Utils.createPromise();
    this.__instance = instance;
    this.__opts = opts;
    this.shouldRetry = this.opts.timeout > 0;
    this.setOptsFromSelector();
  }

  reschedule() {
    setTimeout(() => {
      this.retries++;
      this.schedule();
    }, this.opts.rescheduleInterval);

    return this;
  }

  setOptsFromSelector() {
    if (this.instance.element instanceof Element) {
      const {timeout, retryInterval} = this.instance.element;
      if (!Utils.isUndefined(timeout)) {
        this.__opts.timeout = timeout;
      }

      if (!Utils.isUndefined(retryInterval)) {
        this.__opts.rescheduleInterval = retryInterval;
      }
    }
  }

  createAssertion(passed, value, calleeFn, message) {
    const expected = Utils.isFunction(this.instance.expected) ? this.instance.expected() : this.instance.expected;
    const NightwatchAssertion = require('./index.js');

    return NightwatchAssertion.create(passed, {expected, actual: value}, calleeFn, message, this.opts.abortOnFailure, this.opts.stackTrace);
  }

  async runAssertion({assertion, commandResult}) {
    const {reporter} = this.opts;
    let assertResult;
    let isError = false;

    try {
      await assertion.assert();
      reporter.registerPassed(assertion.message);
    } catch (e) {
      const {error} = assertion;
      error.abortOnFailure = this.opts.abortOnFailure;
      isError = true;

      assertion.buildStackTrace().setFailedMessage();

      reporter.logFailedAssertion(error);
      reporter.registerFailed(error);

      assertResult = error;
    }

    reporter.logAssertResult(assertion.getAssertResult());

    if (isError) {
      this.deferred.reject(assertResult);
    } else {
      const promiseResult = Object.assign({}, commandResult);
      promiseResult.returned = 1;

      this.deferred.resolve(promiseResult);
    }
  }

  verifyCommandArgs() {
    if (this.instance.command.length === 0) {
      throw new Error(`Assertion "command" methods require one "callback" parameter. Check the command method in: ${this.instance.fileName}.`);
    }

    return this;
  }

  executeCommand() {
    this.startTime = new Date().getTime();

    try {
      this.schedule();
    } catch (err) {
      this.deferred.reject(err);
    }

    return this.deferred.promise;
  }

  schedule() {
    this.instance.command(async function commandCallback(commandResult) {
      const timeSpent = new Date().getTime() - this.startTime;
      const {instance} = this;
      let passed;
      let value;

      try {
        if (instance.hasFailure(commandResult)) {
          passed = false;
          value = null;
        } else {
          value = instance.getValue(commandResult);
          passed = instance.isOk(value);
        }
      } catch (err) {
        this.deferred.reject(err);

        return;
      }

      if (!passed && timeSpent < this.opts.timeout) {
        return this.reschedule();
      }

      const message = this.getFullMessage(passed, timeSpent);
      const assertion = this.createAssertion(passed, value, commandCallback, message);
      assertion.actual = instance.getActual(commandResult);

      await this.runAssertion({assertion, commandResult});
    }.bind(this), this.instance);
  }

  getFullMessage(passed, timeSpent) {
    if (!this.shouldRetry) {
      return this.instance.message;
    }

    let timeLogged = passed ? timeSpent : this.opts.timeout;

    if (this.instance.message.endsWith('.')) {
      this.instance.message = this.instance.message.substr(0, this.instance.message.length - 1);
    }

    return `${this.instance.message} ${(passed ? Logger.colors.stack_trace('(' + timeLogged + 'ms)') : 'in ' + timeLogged + 'ms')}`;
  }
}

module.exports = function(instance, opts) {
  const assertionRun = new AssertionRunner(instance, opts);

  assertionRun.verifyCommandArgs();

  return assertionRun.executeCommand();
};
