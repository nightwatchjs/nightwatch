/**
 * Checks if the specified property of a given element has the expected value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.property('#main', 'href', 'https://nightwatchjs.org/');
 *    };
 * ```
 *
 * @method property
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} property The property.
 * @param {string} expected The expected value of the property to check.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const util = require('util');
exports.assertion = function(selector, property, expected, msg) {
  const MSG_ELEMENT_NOT_FOUND = 'Testing if element <%s> has property %s. ' +
    'Element or attribute could not be located.';

  this.message = msg || util.format('Testing if element <%s> has property "%s: %s".', this.elementSelector, property, expected);
  this.expected = expected;

  this.pass = function(value) {
    return value === expected;
  };

  this.failure = function(result) {
    let failed = result === false || result && result.status === -1;
    if (failed) {
      this.message = msg || util.format(MSG_ELEMENT_NOT_FOUND, this.elementSelector, property);
    }

    return failed;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    return this.api.getProperty(selector, property, callback);
  };

};
