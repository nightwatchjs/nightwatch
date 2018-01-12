const Utils = require('../../util/utils.js');

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

  constructor(hookName, context, addtOpts) {
    this.context = context;
    this.addtOpts = addtOpts;
    this.key = hookName;
  }

  /**
   *
   * @param {Object} api The nightwatch main API object
   * @return {*}
   */
  run(api) {
    if (this.context.hasHook(this.key)) {
      let originalFn = this.context.getKey(this.key);
      let argsCount = originalFn.length;
      let hookTimeoutId;

      return new Promise((resolve, reject) => {
        try {
          let doneFn = this.createHookCallback(resolve, reject, function(timeoutId) {
            hookTimeoutId = timeoutId;
          });

          this.context.invokeHookMethod(this.key, api, argsCount, doneFn);
        } catch (err) {
          if (hookTimeoutId) {
            clearTimeout(hookTimeoutId);
          }
          reject(err);
        }
      });
    }

    return Promise.resolve();
  }

  /**
   *
   * @param {Function} resolve
   * @param {Function} reject
   * @param {Function} onTimerStarted
   * @return {Function}
   */
  createHookCallback(resolve, reject, onTimerStarted) {
    return Utils.setCallbackTimeout(function doneCallback(err) {
      if (Utils.isErrorObject(err)) {
        return reject(err);
      }

      resolve();
    }, this.key, this.addtOpts.asyncHookTimeout, function(err) {
      reject(err);
    }, onTimerStarted);
  }
}

module.exports = BaseHook;