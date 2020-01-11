const Utils = require('../../utils');
const Element = require('../../element');
const {AssertionRunner} = require('../../assertion');
const {Logger} = Utils;

class AssertionScheduler {
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
    this.__instance = instance;
    this.__opts = opts;
    this.retries = 0;
    this.deferred = Utils.createPromise();
    this.shouldRetry = this.opts.timeout > 0;
    this.setOptsFromSelector();
  }

  reschedule() {
    setTimeout(() => {
      this.retries++;
      this.schedule();
    }, this.opts.rescheduleInterval);
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

  createAssertionRunner({passed, actual, commandCallback, message, elapsedTime}) {
    const expected = Utils.isFunction(this.instance.expected) ? this.instance.expected() : this.instance.expected;
    const {abortOnFailure, stackTrace, reporter} = this.opts;

    this.runner = new AssertionRunner({
      passed, err: {
        expected,
        actual
      },
      calleeFn: commandCallback,
      message,
      abortOnFailure,
      stackTrace,
      reporter,
      elapsedTime
    });
  }

  verifyCommandArgs() {
    if (this.instance.command.length === 0) {
      throw new Error(`Assertion "command" methods require one "callback" parameter. Check the command method in: ${this.instance.fileName}.`);
    }

    return this;
  }

  start() {
    this.startTime = new Date().getTime();
    this.schedule();

    return this.deferred.promise;
  }

  schedule() {
    this.instance.command(function commandCallback(commandResult) {
      const {instance, startTime} = this;
      const elapsedTime = new Date().getTime() - startTime;

      let passed;
      let value;
      instance.elapsedTime = elapsedTime;
      instance.setResult(commandResult);

      if (instance.hasFailure()) {
        passed = false;
        value = null;
      } else {
        value = instance.getValue();
        passed = instance.isOk(value);
      }

      if (!passed && elapsedTime < this.opts.timeout) {
        this.reschedule();

        return null;
      }

      const message = this.getFullMessage(passed, elapsedTime);
      const actual = instance.getActual();

      this.createAssertionRunner({passed, actual, commandCallback, message, elapsedTime});

      // FIXME: Returning the promise here in the event the it's needed in the assertion callback,
      // throws an unhandledRejection when using es6 async because there's no catch in the assertion callback
      // - adding the catch should be done when breaking changes are going to be introduced.
      this.runner.run(commandResult)
        .then(result => {
          this.deferred.resolve(result);

          return true;
        })
        .catch(err => {
          this.deferred.reject(err);

          return err;
        })
        .then(cbResult => {
          Utils.makePromise(this.instance.doneCallback, this, [cbResult, this.instance])
        });
    }.bind(this), this.instance);
  }

  getFullMessage(passed, elapsedTime) {
    if (!this.shouldRetry) {
      return this.instance.message;
    }

    let timeLogged = passed ? elapsedTime : this.opts.timeout;

    if (this.instance.message.endsWith('.')) {
      this.instance.message = this.instance.message.substr(0, this.instance.message.length - 1);
    }

    return `${this.instance.message} ${(passed ? Logger.colors.stack_trace(`(${timeLogged}ms)`) : `in ${timeLogged}ms`)}`;
  }
}

module.exports.create = function(instance, opts) {
  const scheduler = new AssertionScheduler(instance, opts);
  scheduler.verifyCommandArgs();

  return scheduler.start();
};
