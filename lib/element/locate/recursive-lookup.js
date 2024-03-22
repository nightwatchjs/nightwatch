const EventEmitter = require('events');
const Utils = require('../../utils');

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
    this.createPromise();
  }

  getNextElement() {
    return this.allElements.shift();
  }

  createPromise() {
    this.deferred = Utils.createPromise();

    return this;
  }

  /**
   * In case we need a collection of elements, we only need to retrieve it if it's the last request from
   *  the recursive locate chain
   * @param {Boolean} returnSingleElement
   * @return {Boolean}
   */
  shouldReturnSingleElement(returnSingleElement) {
    if (!returnSingleElement && this.allElements.length > 0) {
      return true;
    }

    return returnSingleElement;
  }

  recursiveElementLookup({result, returnSingleElement}) {
    let element = this.getNextElement();

    if (element) {
      this.elementLocator.findElement({
        id: this.transport.getElementId(Utils.isDefined(result.value) ? result.value : result),
        element,
        transportAction: this.transportAction,
        commandName: this.commandName,
        returnSingleElement: this.shouldReturnSingleElement(returnSingleElement),
        cacheElementId: false
      })
        .then(result => {
          this.recursiveElementLookup({
            result,
            returnSingleElement
          });
        })
        .catch(result => {
          this.deferred.reject(result);
        });
    } else {
      if (result.error instanceof Error) {
        this.deferred.reject(result.error);

        return;
      }

      this.deferred.resolve(result);
    }
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
