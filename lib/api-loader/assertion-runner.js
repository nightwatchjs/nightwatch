const Utils = require('../util/utils.js');
const NightwatchAssertion = require('../core/assertion.js');

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
  constructor(instance, opts) {
    this.assertion = null;
    this.retries = 0;
    this.deferred = Utils.createPromise();
    this.__instance = instance;
    this.__opts = opts;
    this.shouldRetry = this.opts.timeout > 0;
  }

  reschedule() {
    setTimeout(() => {
      this.retries++;
      this.schedule();
    }, this.opts.rescheduleInterval);

    return this;
  }

  createAssertion(passed, value, calleeFn, message) {
    const expected = Utils.isFunction(this.instance.expected) ? this.instance.expected() : this.instance.expected;

    return NightwatchAssertion.create(passed, {expected, actual: value}, calleeFn, message, this.opts.abortOnFailure, this.opts.stackTrace);
  }

  assert() {
    const callback = Utils.isFunction(this.instance.callback) ? this.instance.callback : function() {};

    return this.assertion.run(this.opts.reporter)
      .then(result => {
        callback.call(this.instance, result);

        return result;
      });
  }

  executeCommand() {
    this.startTime = new Date().getTime();

    try {
      this.schedule();
    } catch (err) {
      this.deferred.reject(err);
    }
  }

  schedule() {
    this.instance.command(function commandCallback(commandResult) {
      let passed;
      let value;
      let timeSpent = new Date().getTime() - this.startTime;

      if (Utils.isFunction(this.instance.failure) && this.instance.failure.call(this.instance, commandResult)) {
        passed = false;
        value = null;
      } else {
        value = this.instance.value.call(this.instance, commandResult);
        passed = this.instance.pass.call(this.instance, value);
      }

      if (!passed && timeSpent < this.opts.timeout) {
        return this.reschedule();
      }

      let message = this.getFullMessage(passed, timeSpent);
      this.assertion = this.createAssertion(passed, value, commandCallback, message);

      this.assert()
        .then(assertResult => {
          const isError = assertResult instanceof Error;

          if (isError) {
            assertResult.abortOnFailure = this.opts.abortOnFailure;
            this.deferred.reject(assertResult);
          } else {
            const promiseResult = Object.assign({}, commandResult);
            promiseResult.returned = 1;

            this.deferred.resolve(promiseResult);
          }
        });
    }.bind(this));
  }

  getFullMessage(passed, timeSpent) {
    if (!this.shouldRetry) {
      return this.instance.message;
    }

    let timeLogged = passed ? timeSpent : this.opts.timeout;

    if (this.instance.message.endsWith('.')) {
      this.instance.message = this.instance.message.substr(0, this.instance.message.length - 1);
    }

    return `${this.instance.message} ${(passed ? ' - ' : 'in ') + timeLogged} ms.`;
  }
}

module.exports = AssertionRunner;