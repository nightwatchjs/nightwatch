const Utils = require('../../utils');
const {TimedCallback} = Utils;

class BaseHook {
  static get beforeAll() {
    return 'before';
  }

  static get beforeEach() {
    return 'beforeEach';
  }

  static get beforeChildProcess() {
    return 'beforeChildProcess';
  }

  static get afterAll() {
    return 'after';
  }

  static get afterEach() {
    return 'afterEach';
  }

  static get afterChildProcess() {
    return 'afterChildProcess';
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

  get isUnitTest() {
    return false;
  }

  /**
   *
   * @param {Object} client The nightwatch main instance
   * @param {function} [originalFn]
   * @return {*}
   */
  run(client = null, originalFn = null) {
    originalFn = originalFn || this.verifyMethod();

    if (originalFn) {
      const argsCount = originalFn.length;
      let expectedCount;
      let runnableDone;

      return new Promise((resolve, reject) => {
        try {
          const timedCallback = this.createCallbackWrapper(resolve, reject, err => {
            err.skipTestCases = this.skipTestcasesOnError;
            runnableDone && runnableDone(err);
            reject(err);
          });

          const doneFn = timedCallback.getWrapper();
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

          const invocationResult = this.context.invokeMethod(this.key, client, argsCount, result => {
            if (result instanceof Error) {
              result.skipTestCases = this.skipTestcasesOnError;
            }

            if (this.context.queue && this.context.queue.inProgress) {
              this.context.queue.once('queue:finished', _ => {
                runnableDone && runnableDone(result);
                doneFn(result);
              });
            } else {
              runnableDone && runnableDone(result);
              doneFn(result);
            }
          });

          if (argsCount <= 1 && (invocationResult instanceof Promise)) {
            invocationResult.catch(err => {
              return err;
            }).then(result => {
              if (result instanceof Error) {
                result.skipTestCases = this.skipTestcasesOnError;
              }
              runnableDone && runnableDone(result);
              doneFn(result);

              return result;
            });
          } else if (this.onlyApiArgPassed(argsCount)) {
            // For global hooks (and unit tests), when we have only one argument, the argument is the "done" callback:
            //  E.g.: (global) afterEach(done) {}
            //
            // For normal test hooks, the 1st argument is the 'client' object and the "done" callback is optional,
            //  and thus the callback is called implicitly if it's not passed explicitly, e.g.: after(client) {}
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
    }, ((this.isGlobal && !this.isUnitTest) ? 'global ' : '') + this.key, this.addtOpts.asyncHookTimeout);

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
    if (!this.context.queueStarted) {
      this.context.queue.run();
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
