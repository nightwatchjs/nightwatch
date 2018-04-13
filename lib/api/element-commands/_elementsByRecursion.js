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
  static isErrorResult(result) {
    if (result instanceof Error) {
      return true;
    }

    if (!Array.isArray(result.value)) {
      return true;
    }

    return result.value.length === 0;
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

  locateElements(elements) {
    this.allElements = elements.slice();
    let topElement = this.getNextElement();

    return this.transport
      .locateMultipleElements(topElement)
      .then(result => {
        if (MultipleElementsByRecursion.isErrorResult(result)) {
          throw result;
        }

        // element ids need to be mapped only for the top parent element,
        // all the other recursive lookups will have the parent element id already mapped
        result = this.transport.mapWebElementIds(result);

        return this.recursiveMultipleElementsLookup(result);
      });
  }
}


module.exports = MultipleElementsByRecursion;
