const RecursiveLookupBase = require('./recursive-lookup.js');

/**
 * Search for an element on the page, starting with the first element of the array, and where each element in the passed array is nested under the previous one. The located element will be returned as a WebElement JSON object.
 *
 * @param {Array} elements An array of ancestor element objects containing selector and locateStrategy properties
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol
 */
class SingleElementByRecursion extends RecursiveLookupBase {
  recursiveElementLookup(result) {
    let nextElement = this.getNextElement();
    if (!this.deferred) {
      this.createPromise();
    }

    if (nextElement) {
      this.elementLocator.findElementFromParent(result.value, nextElement).then(result => {
        this.recursiveElementLookup(result);
      }).catch(result => {
        this.deferred.reject(result);
      });
    } else {
      this.deferred.resolve(result);
    }

    return this.deferred.promise;
  }

  /**
   *
   * @param {Array} elements
   * @return {Promise}
   */
  locateElement(elements) {
    this.allElements = elements.slice();
    const element = this.getNextElement();

    return this.elementLocator.findElement({element})
      .then(result => {
        return this.recursiveElementLookup(result);
      });
  }
}


module.exports = SingleElementByRecursion;
