const RecursiveLookupBase = require('./recursive-lookup.js');

/**
 * Search for an element on the page, starting with the first element of the array, and where each element in the passed array is nested under the previous one. The located element will be returned as a WebElement JSON object.
 *
 * @param {Array} elements An array of ancestor element objects containing selector and locateStrategy properties
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol
 */
class SingleElementByRecursion extends RecursiveLookupBase {
  get transportAction() {
    return 'locateSingleElementByElementId';
  }

  get commandName() {
    return 'elementIdElement';
  }
  /**
   *
   * @param {Array} elements
   * @return {Promise}
   */
  locateElement(elements) {
    this.allElements = elements.slice();
    const element = this.getNextElement();

    this.elementLocator
      .findElement({element})
      .then(result => {
        this.recursiveElementLookup({result});
      });

    return this.deferred.promise;
  }
}


module.exports = SingleElementByRecursion;
