const events = require('events');
const Element = require('../../page-object/element.js');

/**
 * Search for an element on the page, starting with the first element of the array, and where each element in the passed array is nested under the previous one. The located element will be returned as a WebElement JSON object.
 *
 * @param {Array} elements An array of ancestor element objects containing selector and locateStrategy properties
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol
 */
class ElementByRecursion extends events.EventEmitter {
  constructor(client) {
    super();

    this.protocol = require('../protocol.js')(client);
  }

  command(elements, callback) {
    let allElements = elements.slice();

    let topElement = allElements.shift();
    let multipleElements = Element.requiresFiltering(topElement);
    let elementAction = multipleElements ? 'elements' : 'element';

    this.protocol[elementAction](null, topElement, function checkResult(result) {
      if (result.status !== 0) {
        callback(result);
        this.emit('complete');
      } else {

        if (multipleElements) {
          result.value = result.value[0];
        }

        let nextElement = allElements.shift();

        if (nextElement) {
          let parentId = result.value.ELEMENT;
          multipleElements = Element.requiresFiltering(nextElement);
          elementAction = multipleElements ? 'elementIdElements' : 'elementIdElement';
          this.protocol[elementAction](parentId, null, nextElement, checkResult);
        } else {
          callback(result);
          this.emit('complete');
        }
      }
    }.bind(this));
  }
}


module.exports = ElementByRecursion;
