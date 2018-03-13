const RecursiveLookupBase = require('./_RecursiveLookup.js');

/**
 * Search for multiple elements on the page, starting with the first element of the array,
 *  and where each element in the passed array is nested under the previous one.
 * The located element will be returned as a WebElement JSON object.
 *
 * @param {Array} elements An array of ancestor element objects containing selector and locateStrategy properties
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol
 */

class MultipleElementsByRecursion extends RecursiveLookupBase {
  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.deferred = null;
  }

  recursiveMultipleElementsLookup(result) {
    let nextElement = this.getNextElement();

    if (!this.deferred) {
      this.createPromise();
    }

    if (nextElement) {
      this.transport.locateMultipleElementsFromParent(result, nextElement).then(result => {
        this.recursiveMultipleElementsLookup(result);
      }).catch(result => {
        this.deferred.reject(result);
      });
    } else {
      this.deferred.resolve(result);
    }

    return this.deferred.promise;
  }

  createPromise() {
    this.deferred = {};
    this.deferred.promise = new Promise((resolve, reject) => {
      this.deferred.resolve = resolve;
      this.deferred.reject = reject;
    });

    return this;
  }

  locateElements(elements) {
    this.allElements = elements.slice();
    let topElement = this.getNextElement();

    return this.transport
      .locateMultipleElements(topElement)
      .then(result => {
        return this.recursiveMultipleElementsLookup(result);
      });
  }
}


module.exports = MultipleElementsByRecursion;
