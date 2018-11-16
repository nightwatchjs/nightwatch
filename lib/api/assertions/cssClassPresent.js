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

const util = require('util');
exports.assertion = function(selector, className, msg) {

  let MSG_ELEMENT_NOT_FOUND = 'Testing if element <%s> has css class: "%s". ' +
    'Element could not be located.';

  this.message = msg || util.format('Testing if element <%s> has css class: "%s".', selector, className);

  this.expected = function() {
    return 'has ' + className;
  };

  this.pass = function(value) {
    let classes = value.split(' ');

    return classes.indexOf(className) > -1;
  };

  this.failure = function(result) {
    let failed = result === false || result && result.status === -1;
    if (failed) {
      this.message = msg || util.format(MSG_ELEMENT_NOT_FOUND, selector, className);
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