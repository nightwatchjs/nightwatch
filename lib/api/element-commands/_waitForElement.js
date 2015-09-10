var util = require('util');
var events = require('events');
var Logger = require('../../util/logger.js');
var Utils = require('../../util/utils.js');

/*!
 * Base class for waitForElement commands. It provides a command
 * method and element* methods to be overwritten by subclasses
 *
 * @constructor
 */
function WaitForElement() {
  events.EventEmitter.call(this);
  this.startTimer = null;
  this.cb = null;
  this.ms = null;
  this.element = null;
  this.abortOnFailure = typeof this.client.api.globals.abortOnAssertionFailure == 'undefined' || this.client.api.globals.abortOnAssertionFailure;
  this.selector = null;
  this.locateStrategy = this.client.locateStrategy || 'css selector';
  this.rescheduleInterval = this.client.api.globals.waitForConditionPollInterval || this.client.options.waitForConditionPollInterval || 500; //ms
  this.throwOnMultipleElementsReturned = this.client.api.globals.throwOnMultipleElementsReturned || this.client.options.throwOnMultipleElementsReturned || false;
  this.protocol = require('../protocol.js')(this.client);
}

util.inherits(WaitForElement, events.EventEmitter);

/*!
 * The public command function which will be called by the test runner. Arguments can be passed in a variety of ways.
 *
 * The custom message always is last and the callback is always before the message or last if a message is not passed.
 *
 * The second argument is always the time in milliseconds. The third argument can be either of:
 * - abortOnFailure: this can overwrite the default behaviour of aborting the test if the condition is not met within the specified time
 * - rescheduleInterval: this can overwrite the default polling interval (currently 500ms)
 * The above can be supplied also together, in which case the rescheduleInterval is specified before the abortOnFailure.
 *
 * Some of the multiple usage possibilities:
 * ---------------------------------------------------------------------------
 * - with no arguments; in this case a global default timeout is expected
 *  waitForElement('body');
 *
 * - with a global default timeout and a callback
 *  waitForElement('body', function() {});
 *
 * - with a global default timeout, a callback and a custom message
 *  waitForElement('body', function() {}, 'test message');
 *
 * - with only the timeout
 *  waitForElement('body', 500);
 *
 * - with a timeout and a custom message
 *  waitForElement('body', 500, 'test message);
 *
 * - with a timeout and a callback
 *  waitForElement('body', 500, function() { .. });
 *
 * - with a timeout and a custom abortOnFailure
 *  waitForElement('body', 500, true);
 *
 * - with a timeout, a custom abortOnFailure and a custom message
 *  waitForElement('body', 500, true, 'test message');
 *
 * - with a timeout, a custom abortOnFailure and a callback
 *  waitForElement('body', 500, true, function() { .. });
 *
 * - with a timeout, a custom abortOnFailure, a callback and a custom message
 *  waitForElement('body', 500, true, function() { .. }, 'test message');
 *
 * - with a timeout, a custom reschedule interval and a callback
 *  waitForElement('body', 500, 100, function() { .. });
 *
 * - with a timeout, a custom rescheduleInterval and a custom abortOnFailure
 *  waitForElement('body', 500, 100, false);
 *
 *
 * @param {string} selector
 * @param {number|function|string} milliseconds
 * @param {function|boolean|string|number} callbackOrAbort
 * @returns {WaitForElement}
 */
WaitForElement.prototype.command = function commandFn(selector, milliseconds, callbackOrAbort) {
  this.startTimer = new Date().getTime();
  this.ms = this.setMilliseconds(milliseconds);
  this._stackTrace = commandFn.stackTrace;

  if (typeof arguments[1] === 'function') {
    ////////////////////////////////////////////////
    // The command was called with an implied global timeout:
    //
    // waitForElement('body', function() {});
    // waitForElement('body', function() {}, 'custom message');
    ////////////////////////////////////////////////
    this.cb = arguments[1];
  } else if (typeof arguments[2] === 'boolean') {
    ////////////////////////////////////////////////
    // The command was called with a custom abortOnFailure:
    //
    // waitForElement('body', 500, false);
    ////////////////////////////////////////////////
    this.abortOnFailure = arguments[2];

    // The optional callback is the 4th argument now
    this.cb = arguments[3] || function() {};
  } else if (typeof arguments[2] === 'number') {
    ////////////////////////////////////////////////
    // The command was called with a custom rescheduleInterval:
    //
    // waitForElement('body', 500, 100);
    ////////////////////////////////////////////////
    this.rescheduleInterval = arguments[2];

    if (typeof arguments[3] === 'boolean') {
      ////////////////////////////////////////////////
      // The command was called with a custom rescheduleInterval and custom abortOnFailure:
      //
      // waitForElement('body', 500, 100, false);
      ////////////////////////////////////////////////
      this.abortOnFailure = arguments[3];

      // The optional callback is the 5th argument now
      this.cb = arguments[4] || function() {};
    } else {
      // The optional callback is the 4th argument now
      this.cb = arguments[3] || function() {};
    }
  } else {
    // The optional callback is the 3th argument now
    this.cb = (typeof callbackOrAbort === 'function' && callbackOrAbort) || function() {};
  }

  // support for a custom message
  this.message = null;
  if (arguments.length > 1) {
    var lastArgument = arguments[arguments.length - 1];
    if (typeof lastArgument === 'string') {
      this.message = lastArgument;
    }
  }

  this.selector = selector;
  this.checkElement();
  return this;
};

/*!
 * @override
 */
WaitForElement.prototype.elementFound = function(result, now) {};

/*!
 * @override
 */
WaitForElement.prototype.elementNotFound = function(result, now) {};

/*!
 * @override
 */
WaitForElement.prototype.elementVisible = function(result, now) {};

/*!
 * @override
 */
WaitForElement.prototype.elementNotVisible = function(result, now) {};

/*!
 * Reschedule the checkElement
 */
WaitForElement.prototype.reschedule = function(method) {
  var self = this;
  method = method || 'checkElement';

  setTimeout(function() {
    self[method]();
  }, this.rescheduleInterval);
};

WaitForElement.prototype.complete = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.push(this);
  this.cb.apply(this.client.api, args);
  this.emit('complete');
  return this;
};

WaitForElement.prototype.pass = function(result, defaultMsg, timeMs) {
  this.message = this.formatMessage(defaultMsg, timeMs);
  this.client.assertion(true, null, null, this.message, this.abortOnFailure);
  return this.complete(result);
};

WaitForElement.prototype.fail = function(result, actual, expected, defaultMsg) {
  this.message = this.formatMessage(defaultMsg);
  this.client.assertion(false, actual, expected, this.message, this.abortOnFailure, this._stackTrace);
  return this.complete(result);
};

/*!
 * Will start checking if the element exists and if not re-schedule the check
 * until the timeout expires or the condition has been met
 */
WaitForElement.prototype.checkElement = function() {
  var self = this;
  this.getProtocolCommand(function(result) {
    var now = new Date().getTime();

    if (result.value && result.value.length > 0) {
      if (result.value.length > 1) {
        var message = 'WaitForElement found ' + result.value.length + ' elements for selector "' + self.selector + '".';
        if (self.throwOnMultipleElementsReturned) {
          throw new Error(message);
        } else if (self.client.options.output) {
          console.log(Logger.colors.green('  Warn: ' + message + ' Only the first one will be checked.'));
        }
      }

      self.element = result.value[0].ELEMENT;
      return self.elementFound(result, now);
    }

    return self.elementNotFound(result, now);
  });
};

WaitForElement.prototype.getProtocolCommand = function(callback) {
  return this.protocol.elements(this.locateStrategy, this.selector, callback);
};

/*!
 * Will start checking if the element is visible and if not re-schedule the check
 * until the timeout expires or the condition has been met
 */
WaitForElement.prototype.isVisible = function() {
  var self = this;
  this.protocol.elementIdDisplayed(this.element, function(result) {
    var now = new Date().getTime();
    if (result.status === 0 && result.value === true) {
      // element was visible
      return self.elementVisible(result, now);
    }

    return self.elementNotVisible(result, now);
  });
};

/**
 * @param {string} defaultMsg
 * @param {number} [timeMs]
 * @returns {string}
 */
WaitForElement.prototype.formatMessage = function (defaultMsg, timeMs) {
  return Utils.format(this.message || defaultMsg, this.selector, timeMs || this.ms);
};

/**
 * Set the time in milliseconds to wait for the condition, accepting a given value or a globally defined default
 *
 * @param {number} [timeoutMs]
 * @throws Will throw an error if the global default is undefined or a non-number
 * @returns {number}
 */
WaitForElement.prototype.setMilliseconds = function (timeoutMs) {
  if (timeoutMs && typeof timeoutMs === 'number') {
    return timeoutMs;
  }

  var globalTimeout = this.client.api.globals.waitForConditionTimeout;
  if (typeof globalTimeout !== 'number') {
    throw new Error('waitForElement expects second parameter to have a global default ' +
      '(waitForConditionTimeout) to be specified if not passed as the second parameter ');
  }

  return globalTimeout;
};

module.exports = WaitForElement;
