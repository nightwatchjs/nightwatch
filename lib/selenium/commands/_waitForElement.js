var util = require('util');
var events = require('events');

var formatRegExp = /%[sdj%]/g;

/*!
 * Base class for waitForElement commands. It provides a command
 * command method and element* methods to be overwritten by subclasses
 *
 * @constructor
 */
function WaitForElement() {
  events.EventEmitter.call(this);
  this.startTimer = null;
  this.cb = null;
  this.ms = null;
  this.element = null;
  this.abortOnFailure = true;
  this.selector = null;
  this.locateStrategy = this.client.locateStrategy || 'css selector';
  this.rescheduleInterval = 500; //ms
  this.protocol = require('../protocol.js')(this.client);
}

util.inherits(WaitForElement, events.EventEmitter);

/*!
 * The public command function which will be called by the test runner. Arguments can be passed in a variety of ways:
 *
 *  waitForElement('body', 500)
 *  waitForElement('body', 500, 'test message)
 *  waitForElement('body', 500, function() { .. });
 *  waitForElement('body', 500, true);
 *  waitForElement('body', 500, true, 'test message');
 *  waitForElement('body', 500, true, function() { .. });
 *  waitForElement('body', 500, true, function() { .. }, 'test message');
 *
 * @param {string} selector
 * @param {number} milliseconds
 * @param {function|boolean|string} callbackOrAbort
 * @returns {WaitForElement}
 */
WaitForElement.prototype.command = function(selector, milliseconds, callbackOrAbort) {
  if (typeof milliseconds !== 'number') {
    throw new Error('waitForElement expects second parameter to be number; ' +
      typeof (milliseconds) + ' given');
  }
  this.startTimer = new Date().getTime();

  if (typeof arguments[2] === 'boolean') {
    this.abortOnFailure = arguments[2];
    this.cb = arguments[3] || function() {};
  } else if (typeof arguments[2] === 'number') {
    this.rescheduleInterval = arguments[2];
    if (typeof arguments[3] === 'boolean') {
      this.abortOnFailure = arguments[3];
      this.cb = arguments[4] || function() {};
    } else {
      this.cb = arguments[3] || function() {};
    }
  } else {
    this.cb = (typeof callbackOrAbort === 'function' && callbackOrAbort) || function() {};
  }

  // support for a custom message
  this.message = null;
  var lastArgument = arguments[arguments.length - 1];
  if (typeof lastArgument === 'string') {
    this.message = lastArgument;
  }

  this.ms = milliseconds;
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
  this.client.assertion(false, actual, expected, this.message, this.abortOnFailure);
  return this.complete(result);
};

/*!
 * Will start checking if the element exists and if not re-schedule the check
 * until the timeout expires or the condition has been met
 */
WaitForElement.prototype.checkElement = function() {
  var self = this;
  this.protocol.element(this.locateStrategy, this.selector, function(result) {
    var now = new Date().getTime();
    if (result.status === 0) {
      self.element = result.value.ELEMENT;
      return self.elementFound(result, now);
    }

    return self.elementNotFound(result, now);
  });
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
  return format(this.message || defaultMsg, this.selector, timeMs || this.ms);
};

/**
 * A smaller version of util.format that doesn't support json and
 * if a placeholder is missing, it is omitted instead of appended
 *
 * @param f
 * @returns {string}
 */
function format(f) {
  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') {
      return '%';
    }
    if (i >= len) {
      return x;
    }
    switch (x) {
    case '%s':
      return String(args[i++]);
    case '%d':
      return Number(args[i++]);
    default:
      return x;
    }
  });

  return str;
}


module.exports = WaitForElement;
