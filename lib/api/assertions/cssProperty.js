/**
 * Checks if the specified css property of a given element has the expected value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.cssProperty('#main', 'display', 'block');
 *    };
 * ```
 *
 * @method cssProperty
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} cssProperty The CSS property.
 * @param {string} expected The expected value of the css property to check.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const util = require('util');
exports.assertion = function(selector, cssProperty, expected, msg) {
  const MSG_ELEMENT_NOT_FOUND = 'Testing if element <%s> has css property %s. ' +
    'Element or attribute could not be located.';

  this.message = msg || util.format('Testing if element <%s> has css property "%s: %s".', this.elementSelector, cssProperty, expected);
  this.expected = expected;

  this.pass = function(value) {
    return value === expected;
  };

  this.failure = function(result) {
    let failed = result === false || result && result.status === -1;
    if (failed) {
      this.message = msg || util.format(MSG_ELEMENT_NOT_FOUND, this.elementSelector, cssProperty);
    }

    return failed;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    return this.api.getCssProperty(selector, cssProperty, callback);
  };

};
