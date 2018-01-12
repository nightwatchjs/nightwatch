const RecursiveLookupBase = require('./_RecursiveLookup.js');

/**
 * Search for an element on the page, starting with the first element of the array, and where each element in the passed array is nested under the previous one. The located element will be returned as a WebElement JSON object.
 *
 * @param {Array} elements An array of ancestor element objects containing selector and locateStrategy properties
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol
 */
class SingleElementByRecursion extends RecursiveLookupBase {
  /**
   *
   * @param {string} elementId
   * @return {Promise}
   */
  recursiveElementLookup(elementId) {
    let nextElement = this.getNextElement();

    return new Promise((resolve, reject) => {
      if (nextElement) {
        this.transport.locateElementFromParent(elementId, nextElement).then(elementId => {
          this.recursiveElementLookup(elementId);
        }).catch(result => {
          reject(result);
        });
      } else {
        resolve(elementId);
      }
    });
  }

  /**
   *
   * @param {Array} elements
   * @return {Promise}
   */
  command(elements) {
    this.allElements = elements.slice();
    let topElement = this.getNextElement();

    return this.transport
      .locateElement(topElement)
      .then(elementId => {
        return this.recursiveElementLookup(elementId);
      });
  }
}


module.exports = SingleElementByRecursion;
