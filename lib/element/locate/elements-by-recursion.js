const RecursiveLookupBase = require('./recursive-lookup.js');

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

    this.createPromise();
  }

  recursiveElementsLookup(result) {
    let nextElement = this.getNextElement();

    if (nextElement) {
      this.findElementsFromParent(result, nextElement).then(response => {
        this.recursiveElementsLookup(response);
      }).catch(result => {
        this.deferred.reject(result);
      });
    } else {
      this.deferred.resolve(result);
    }
  }

  locateElements(elements) {
    this.allElements = elements.slice();
    const element = this.getNextElement();

    return this.elementLocator.findElement({element})
      .then(result => {
        // element ids need to be mapped only for the top parent element,
        // all the other recursive lookups will have the parent element id already mapped
        //result = this.transport.mapWebElementIds(result);
        if (result.value === null) {
          this.deferred.resolve(result);
        } else {
          this.recursiveElementsLookup(result);
        }

        return this.deferred.promise;
      });
  }

  /**
   * Used by recursive lookup command for multi elements (in page objects)
   *
   * @param {Object} result
   * @param {Element} element
   * @return {Promise}
   */
  findElementsFromParent(result, element) {
    return this.elementLocator.findElementFromParent(result.value, element);
  }
}


module.exports = MultipleElementsByRecursion;
