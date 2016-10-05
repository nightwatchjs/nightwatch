var util = require('util');
var events = require('events');
var Q = require('q');

/**
 * Search for multiple elements on the page, starting with the first element of the array, and where each element in the passed array is nested under the previous one. The located element will be returned as a WebElement JSON objects.
 *
 * @param {Array} elements An array of ancestor element objects containing selector and locateStrategy properties
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @api protocol
 */

function ElementsByRecursion(client) {
  events.EventEmitter.call(this);
  this.protocol = require('../protocol.js')(client);
}

util.inherits(ElementsByRecursion, events.EventEmitter);

ElementsByRecursion.prototype.command = function(elements, callback) {
  var self = this;

  function deferredElementIdElements(el, using, value) {
    var deferred = Q.defer();
    var req = self.protocol.elementIdElements(el, using, value, function(result) {
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

  var allElements = elements.slice();
  var topElement = allElements.shift();

  var el = this.protocol.elements(null, topElement, function checkResult() {
    var result = aggregateResults(arguments);
    if (result.value.length === 0) {
      callback(result);
      self.emit('complete', el, self);
      return;
    }

    var nextElement = allElements.shift();
    if (nextElement) {
      var promises = [];
      result.value.forEach(function(el) {
        var p = deferredElementIdElements(el.ELEMENT, null, nextElement, checkResult);
        promises.push(p);
      });

      Q.all(promises).spread(checkResult);
    } else {
      callback(result);
      self.emit('complete', el, self);
    }
  });

  return this;
};

module.exports = ElementsByRecursion;
