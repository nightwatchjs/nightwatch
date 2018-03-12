const Utils = require('../../util/utils.js');
const TimedCallback = require('../../util/timed-callback.js');

class BaseHook {
  static get beforeAll() {
    return 'before';
  }

  static get beforeEach() {
    return 'beforeEach';
  }

  static get afterAll() {
    return 'after';
  }

  static get afterEach() {
    return 'afterEach';
  }

  constructor(hookName, context, addtOpts = {}) {
    this.context = context;
    this.addtOpts = addtOpts;
    this.key = hookName;
    this.hookTimeoutId = null;
  }

  get isGlobal() {
    return this.addtOpts.isGlobal || false;
  }

  /**
   *
   * @param {Object} api The nightwatch main API object
   * @param {function} [originalFn]
   * @return {*}
   */
  run(api = null, originalFn = null) {
    originalFn = originalFn || this.verifyMethod();

    if (originalFn) {
      let argsCount = originalFn.length;

      return new Promise((resolve, reject) => {
        try {
          let timedCallback = this.createCallbackWrapper(resolve, reject);
          let doneFn = timedCallback.getWrapper();

          this.context.invokeMethod(this.key, api, argsCount, this.isGlobal, doneFn);

          // For global hooks (and unit tests), when we have only one argument, the argument is the "done" callback;
          //  for normal test hooks, the 1st argument is the 'api' object and the "done" callback is optional,
          //  and thus the callback called implicitly if it's not passed explicitly
          if (this.onlyApiArgPassed(argsCount)) {
            this.implicitlyCallDoneCallback(doneFn);
          }
        } catch (err) {
          if (this.hookTimeoutId) {
            clearTimeout(this.hookTimeoutId);
          }
          reject(err);
        }
      });
    }

    return Promise.resolve();
  }

  verifyMethod() {
    if (this.context.hasHook(this.key)) {
      return this.context.getKey(this.key);
    }

    return null;
  }

  /**
   *
   * @param {Function} resolve
   * @param {Function} reject
   * @return {TimedCallback}
   */
  createCallbackWrapper(resolve, reject) {
    let timedCallback = new TimedCallback(function doneCallback(err) {
      if (Utils.isErrorObject(err)) {
        return reject(err);
      }

      resolve();
    }, this.key, this.addtOpts.asyncHookTimeout);

    timedCallback.onTimeoutExpired = function(err) {
      reject(err);
    };

    timedCallback.onTimerStarted = timeoutId => {
      this.hookTimeoutId = timeoutId;
    };

    return timedCallback;
  }

  onlyApiArgPassed(argsCount) {
    return argsCount === 1 && !this.isGlobal;
  }

  implicitlyCallDoneCallback(doneFn) {
    if (this.hookTimeoutId) {
      clearTimeout(this.hookTimeoutId);
    }

    process.nextTick(() => {
      if (this.context.currentRunnable) {
        this.context.currentRunnable.queue.once('queue:finished', _ => {
          doneFn();
        });
      }
    });
  }
}

module.exports = BaseHook;