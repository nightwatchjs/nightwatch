const EventEmitter = require('events');
const Utils = require('../../util/utils.js');

/**
 * Search for an element on the page, starting with the first element of the array, and where each element in the passed array is nested under the previous one. The located element will be returned as a WebElement JSON object.
 *
 * @param {Array} elements An array of ancestor element objects containing selector and locateStrategy properties
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol
 */
class RecursiveLookupBase extends EventEmitter {
  constructor(nightwatchInstance) {
    super();

    this.elementLocator = nightwatchInstance.elementLocator;
    this.transport = nightwatchInstance.transport;
    this.deferred = null;
  }

  getNextElement() {
    return this.allElements.shift();
  }

  createPromise() {
    this.deferred = Utils.createPromise();

    return this;
  }

  recursiveElementLookup(result) {
    let element = this.getNextElement();
    if (!this.deferred) {
      this.createPromise();
    }

    if (element) {
      this.elementLocator
        .findElementFromParent({
          id: result.value,
          element,
          transportAction: this.transportAction,
          commandName: this.commandName
        })
        .then(result => {
          this.recursiveElementLookup(result);
        })
        .catch(result => {
          this.deferred.reject(result);
        });
    } else {
      this.deferred.resolve(result);
    }

    return this.deferred.promise;
  }

  /**
   *
   * @param {string|object} result
   * @param {function} callback
   * @return {Promise}
   */
  complete(result, callback) {
    callback(result);
    this.emit('complete');

    return result;
  }
}


module.exports = RecursiveLookupBase;
