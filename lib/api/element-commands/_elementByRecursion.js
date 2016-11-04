var util = require('util');
var events = require('events');
var Element = require('../../page-object/element.js');

/**
 * Search for an element on the page, starting with the first element of the array, and where each element in the passed array is nested under the previous one. The located element will be returned as a WebElement JSON object.
 *
 * @param {Array} elements An array of ancestor element objects containing selector and locateStrategy properties
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol
 */

function ElementByRecursion(client) {
  events.EventEmitter.call(this);
  this.protocol = require('../protocol.js')(client);
}

util.inherits(ElementByRecursion, events.EventEmitter);

ElementByRecursion.prototype.command = function(elements, callback) {
  var self = this;
  var allElements = elements.slice();

  var topElement = allElements.shift();
  var multipleElements = Element.requiresFiltering(topElement);
  var elementAction = multipleElements ? 'elements' : 'element';

  var el = this.protocol[elementAction](null, topElement, function checkResult(result) {
    if (result.status !== 0) {
      callback(result);
      self.emit('complete', el, self);
    } else {

      if (multipleElements) {
        result.value = result.value[0];
      }

      var nextElement = allElements.shift();

      if (nextElement) {
        var parentId = result.value.ELEMENT;
        multipleElements = Element.requiresFiltering(nextElement);
        elementAction = multipleElements ? 'elementIdElements' : 'elementIdElement';
        self.protocol[elementAction](parentId, null, nextElement, checkResult);
      } else {
        callback(result);
        self.emit('complete', el, self);
      }
    }
  });

  return this;
};

module.exports = ElementByRecursion;
