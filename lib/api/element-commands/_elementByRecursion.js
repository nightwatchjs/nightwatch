var events = require('events');

module.exports = function(client) {
  var Protocol = require('../protocol.js')(client);

  /**
   * Search for an element on the page, starting with the first element of the array, and where each element in the passed array is nested under the previous one. The located element will be returned as a WebElement JSON object.
   *
   * @param {Array} elements An array of ancestor element objects containing selector and locateStrategy properties
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  function elementByRecursion(elements, callback) {
    var allElements = elements.slice();
    var emitter = new events.EventEmitter();

    var handleHttpError = function (){
      emitter.emit('error', arguments);
    };

    var checkResult = function(result) {
      if (result.status !== 0) {
        callback(result);
      } else {
        var nextElement = allElements.shift();
        var parentId = result.value.ELEMENT;
        if (nextElement) {
          var req = Protocol.elementIdElement(parentId, nextElement.locateStrategy, nextElement.selector, checkResult);
          req.on('error', handleHttpError);
        } else {
          callback(result);
          emitter.emit('complete');
        }
      }
    };

    var topElement = allElements.shift();
    var req = Protocol.element(topElement.locateStrategy, topElement.selector, checkResult);
    req.on('error', handleHttpError);
    return emitter;
  }

  return elementByRecursion;
};