/**
 * Checks if the given form element's value equals the expected value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.value("form.login input[type=text]", "username");
 *    };
 * ```
 *
 * @method value
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} expectedText The expected text.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const util = require('util');
exports.assertion = function(selector, expected, msg) {

  let MSG_ELEMENT_NOT_FOUND = 'Testing if value of <%s> equals: "%s". ' +
    'Element or attribute could not be located.';

  this.message = msg || util.format('Testing if value of <%s> equals: "%s".', selector, expected);
  this.expected = expected;

  this.pass = function(value) {
    return value === this.expected;
  };

  this.failure = function(result) {
    let failed = (result === false) ||
      // no such element
      result && result.status === -1 ||
      // element doesn't have a value attribute
      result && result.value === null;
    if (failed) {
      this.message = msg || util.format(MSG_ELEMENT_NOT_FOUND, selector, expected);
    }

    return failed;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    return this.api.getValue(selector, callback);
  };

};
