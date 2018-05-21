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

const util = require('util');
exports.assertion = function(selector, expected, msg) {
  let DEFAULT_MSG = 'Testing if value of <%s> contains: "%s".';
  let MSG_ELEMENT_NOT_FOUND = DEFAULT_MSG + ' ' + 'Element could not be located.';
  let VALUE_ATTR_NOT_FOUND = DEFAULT_MSG + ' ' +  'Element does not have a value attribute.';

  this.message = msg || util.format(DEFAULT_MSG, selector, expected);
  this.expected = true;

  this.pass = function(value) {
    return value.indexOf(expected) > -1;
  };

  this.failure = function(result) {
    let failed = (result === false) ||
      // no such element
      result && (result.status === -1 || result.value === null);

    if (failed) {
      let defaultMsg = MSG_ELEMENT_NOT_FOUND;
      if (result && result.value === null) {
        defaultMsg = VALUE_ATTR_NOT_FOUND;
      }
      this.message = msg || util.format(defaultMsg, selector, expected);
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
