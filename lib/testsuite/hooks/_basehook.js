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

  get skipTestcasesOnError() {
    return false;
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
      let expectedCount;
      let runnableDone;

      return new Promise((resolve, reject) => {
        try {
          let timedCallback = this.createCallbackWrapper(resolve, reject, err => {
            err.skipTestCases = this.skipTestcasesOnError;
            runnableDone && runnableDone(err);
            reject(err);
          });

          let doneFn = timedCallback.getWrapper();
          if (!this.isGlobal) {
            expectedCount = 2;
          }

          if (this.context.currentRunnable && argsCount === 2) {
            // Set the runnable resolve function to be called from the inside the done callback of the hook
            //  - necessary for the case when the callback starts a different async operation
            runnableDone = this.context.currentRunnable.setDoneCallback();
            this.context.currentRunnable.deffered.promise.catch(err => {
              if (this.hookTimeoutId) {
                clearTimeout(this.hookTimeoutId);
              }
              runnableDone(err);
            });
          }

          this.context.invokeMethod(this.key, api, argsCount, result => {
            if (result instanceof Error) {
              result.skipTestCases = this.skipTestcasesOnError;
            }
            runnableDone && runnableDone(result);
            doneFn(result);
          });

          // For global hooks (and unit tests), when we have only one argument, the argument is the "done" callback:
          //  E.g.: (global) afterEach(done) {}
          //
          // For normal test hooks, the 1st argument is the 'api' object and the "done" callback is optional,
          //  and thus the callback is called implicitly if it's not passed explicitly, e.g.: after(client) {}
          if (this.onlyApiArgPassed(argsCount)) {
            this.implicitlyCallDoneCallback(doneFn);
          }
        } catch (err) {
          if (this.hookTimeoutId) {
            clearTimeout(this.hookTimeoutId);
          }

          runnableDone && runnableDone(err);

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
   * @param {Function} timeoutExpired
   * @return {TimedCallback}
   */
  createCallbackWrapper(resolve, reject, timeoutExpired) {
    let timedCallback = new TimedCallback(function doneCallback(err) {
      if (Utils.isErrorObject(err)) {
        return reject(err);
      }

      resolve();
    }, this.key, this.addtOpts.asyncHookTimeout);

    timedCallback.onTimeoutExpired = timeoutExpired;

    timedCallback.onTimerStarted = timeoutId => {
      this.hookTimeoutId = timeoutId;
    };

    return timedCallback;
  }

  onlyApiArgPassed(argsCount) {
    return argsCount === 1 && !this.isGlobal;
  }

  startQueueIfNeeded() {
    if (this.context.queue && !this.context.queueStarted) {
      this.context.queue.traverse();
    }
  }

  implicitlyCallDoneCallback(doneFn) {
    if (this.hookTimeoutId) {
      clearTimeout(this.hookTimeoutId);
    }

    process.nextTick(() => {
      if (this.context.queue) {
        this.context.queue.once('queue:finished', _ => {
          doneFn();
        });

        this.startQueueIfNeeded();
      }
    });
  }
}

module.exports = BaseHook;