/**
 * Checks if the given element has the specified CSS class.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.cssClassPresent('#main', 'container');
 *    };
 * ```
 *
 * @method cssClassPresent
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} className The CSS class to look for.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

var util = require('util');
exports.assertion = function(selector, className, msg) {
  var DEFAULT_MSG = 'Testing if element <%s> has css class: "%s".';
  var MSG_ELEMENT_NOT_FOUND = DEFAULT_MSG + ' ' + 'Element could not be located.';
  var MSG_ATTR_NOT_FOUND = DEFAULT_MSG + ' ' + 'Element does not have a class attribute.';

  this.message = msg || util.format('Testing if element <%s> has css class: "%s".', selector, className);

  this.expected = function() {
    return 'has ' + className;
  };

  this.pass = function(value) {
    var classes = value.split(' ');
    return classes.indexOf(className) > -1;
  };

  this.failure = function(result) {
    var failed = (result === false) ||
        // no such element or class attribute
        result && (result.status === -1 || result.value === null);

    if (failed) {
      var defaultMsg = MSG_ELEMENT_NOT_FOUND;
      if (result && result.value === null) {
        defaultMsg = MSG_ATTR_NOT_FOUND;
      }
      this.message = msg || util.format(defaultMsg, selector, className);
    }
    return failed;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    return this.api.getAttribute(selector, 'class', callback);
  };

};