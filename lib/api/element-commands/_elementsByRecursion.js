var events = require('events');
var Q = require('q');

module.exports = function(client) {
  var Protocol = require('../protocol.js')(client);

  function deferredElementIdElements(el, using, value) {
    var deferred = Q.defer();
    var req = Protocol.elementIdElements(el, using, value, function(result) {
      deferred.resolve(result);
    });
    req.on('error', function() {
      deferred.reject();
    });
    return deferred.promise;
  }

  function createResult(result, foundElements) {
    return {
      status: 0,
      sessionId: result.sessionId,
      value: foundElements.map(function(e) {
        return {
          ELEMENT: e
        };
      }),
      class: result.class,
      hCode: result.hCode
    };
  }

  function aggregateResults(results) {
    var result;
    var foundElements = [];
    for (var i = 0; i < results.length; i++) {
      result = results[i];
      if (result.status === 0 && result.value && result.value.length) {
        result.value.forEach(function(e) {
          if (foundElements.indexOf(e.ELEMENT) <= -1) {
            // In case we have multiple matches on the same element, only add once
            foundElements.push(e.ELEMENT);
          }
        });
      }
    }
    return createResult(result, foundElements);
  }

  /**
   * Search for multiple elements on the page, starting with the first element of the array, and where each element in the passed array is nested under the previous one. The located element will be returned as a WebElement JSON objects.
   *
   * @param {Array} elements An array of ancestor element objects containing selector and locateStrategy properties
   * @param {function} [callback] Optional callback function to be called when the command finishes.
   * @api protocol
   */
  function elementsByRecursion(elements, callback) {
    var allElements = elements.slice();
    var topElement = allElements.shift();
    var emitter = new events.EventEmitter();

    var handleHttpError = function (){
      emitter.emit('error', arguments);
    };

    var checkResult = function () {
      var result = aggregateResults(arguments);
      if (result.value.length === 0) {
        return callback(result);
      }

      var nextElement = allElements.shift();
      if (nextElement) {
        var promises = [];
        result.value.forEach(function(el) {
          var p = deferredElementIdElements(el.ELEMENT, nextElement.locateStrategy, nextElement.selector, checkResult);
          promises.push(p);
        });

        Q.all(promises).spread(checkResult).catch(handleHttpError);
      } else {
        callback(result);
        emitter.emit('complete');
      }
    };

    var req = Protocol.elements(topElement.locateStrategy, topElement.selector, checkResult);
    req.on('error', handleHttpError);
    return emitter;
  }

  return elementsByRecursion;
};