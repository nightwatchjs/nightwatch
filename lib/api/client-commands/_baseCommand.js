const Logger = require('../../util/logger.js');

module.exports = class ClientCommand {
  /**
   *
   * @param {function} performAction Function to run which contains the command, passing a callback containing the result object
   * @param {function} userSuppliedCallback
   * @param {boolean} fullResultObject Weather to call the user-supplied callback with the entire result object or just the value
   * @return {Promise}
   */
  static makePromise({performAction, userSuppliedCallback = function() {}, fullResultObject = true, fullPromiseResolve = true}) {
    return new Promise(function(resolve, reject) {
      performAction(function(result) {
        try {
          if (result.error && (typeof result.error == 'string')) {
            Logger.error(new Error(result.error));
          }

          const resultValue = fullResultObject ? result : result.value;
          let promise = userSuppliedCallback.call(this, resultValue);
          if (!(promise instanceof Promise)) {
            promise = Promise.resolve(promise);
          }

          const resolveValue = fullPromiseResolve ? result : result.value;
          promise.then(_ => resolve(resolveValue)).catch(err => reject(err));
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  get returnsFullResultObject() {
    return true;
  }

  get resolvesWithFullResultObject() {
    return true;
  }

  command(userSuppliedCallback) {
    const {performAction} = this;

    return ClientCommand.makePromise({
      performAction: performAction.bind(this),
      userSuppliedCallback,
      fullResultObject: this.returnsFullResultObject,
      fullPromiseResolve: this.resolvesWithFullResultObject
    });
  }
};
