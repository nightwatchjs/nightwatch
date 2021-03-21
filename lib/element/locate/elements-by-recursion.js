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
  get transportAction() {
    return 'locateMultipleElementsByElementId';
  }

  get commandName() {
    return 'elementIdElements';
  }

  locateElements({element, returnSingleElement}) {
    this.allElements = Array.isArray(element.selector) ? element.selector.slice() : [
      element
    ];
    const nextElement = this.getNextElement();

    this.elementLocator
      .findElement({element: nextElement, returnSingleElement: this.shouldReturnSingleElement(returnSingleElement)})
      .then(result => {
        if (result.value === null) {
          this.deferred.resolve(result);
        } else {
          this.recursiveElementLookup({result, returnSingleElement});
        }
      });

    return this.deferred.promise
      .then((result) => {
        // backward compatibility: keep the "result" on the result object
        if (!result.result) {
          result.result = {
            value: result.value,
          };

          if (Array.isArray(result.value) && result.value.length > 0) {
            result.result.WebdriverElementId = this.transport.getElementId(result.value[0]);
          } else if (result.value) {
            result.result.WebdriverElementId = this.transport.getElementId(result.value);
          }
        }

        return result;
      });
  }
}


module.exports = MultipleElementsByRecursion;
