/**
 * Checks if the given form element's value contains the expected value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.valueContains("form.login input[type=text]", "username");
 *    };
 * ```
 *
 * @method valueContains
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} expectedText The expected text.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

var util = require('util');
exports.assertion = function(selector, expected, msg) {

  var MSG_ELEMENT_NOT_FOUND = 'Testing if value of <%s> contains: "%s". ' +
    'Element or attribute could not be located.';

  this.message = msg || util.format('Testing if value of <%s> contains: "%s".', selector, expected);
  this.expected = true;

  this.pass = function(value) {
    if (value == null)
      return false;
    return value.indexOf(expected) > -1;
  };

  this.failure = function(result) {
    var failed = result === false || result && result.status === -1;
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
