const Logger = require('../../util/logger.js');

module.exports = class ClientCommand {
  /**
   *
   * @param {function} performAction Function to run which contains the command, passing a callback containing the result object
   * @param {function} userSuppliedCallback
   * @param {boolean} fullResultObject Weather to call the user-supplied callback with the entire result object or just the value
   * @return {Promise}
   */
  static makePromise({performAction, userSuppliedCallback = function() {}, fullResultObject = true}) {
    return new Promise(function(resolve, reject) {
      performAction(function(result) {
        try {
          if (result.error && (typeof result.error == 'string')) {
            Logger.error(new Error(result.error));
          }

          let promise = userSuppliedCallback.call(this, fullResultObject ? result : result.value);
          if (!(promise instanceof Promise)) {
            promise = Promise.resolve(promise);
          }

          promise.then(_ => resolve(result)).catch(err => reject(err));
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  get returnsFullResultObject() {
    return false;
  }

  command(userSuppliedCallback) {
    const {performAction} = this;

    return ClientCommand.makePromise({
      performAction: performAction.bind(this),
      userSuppliedCallback,
      fullResultObject: this.returnsFullResultObject
    });
  }
};
