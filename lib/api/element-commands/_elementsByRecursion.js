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
  recursiveMultipleElementsLookup(elementsIdsNormalized) {
    let nextElement = this.getNextElement();

    return new Promise((resolve, reject) => {
      if (nextElement) {
        this.transport.locateMultipleElementsFromParent(elementsIdsNormalized, nextElement).then(elementIds => {
          this.recursiveMultipleElementsLookup(elementIds);
        }).catch(result => {
          reject(result);
        });
      } else {
        resolve(elementsIdsNormalized);
      }
    });
  }

  command(elements, callback) {
    this.allElements = elements.slice();
    let topElement = this.getNextElement();

    this.transport
      .locateMultipleElements(topElement)
      .then(elementsIdsNormalized => {
        return this.recursiveMultipleElementsLookup(elementsIdsNormalized);
      })
      .then(elementIds => {
        return this.complete(elementIds, callback);
      })
      .catch(result => {
        return this.complete(result, callback);
      });
  }
}


module.exports = MultipleElementsByRecursion;
