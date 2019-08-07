/**
 * Checks if the given element is not visible on the page.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.hidden(".should_not_be_visible");
 *    };
 * ```
 *
 * @method hidden
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const util = require('util');
const MSG_ELEMENT_NOT_FOUND = 'Testing if element <%s> is hidden. ' +
  'Element could not be located.';

exports.assertion = function(selector, msg) {
  this.message = msg || util.format('Testing if element <%s> is hidden.', this.elementSelector);
  this.expected = true;

  this.pass = function(value) {
    return value === this.expected;
  };

  this.failure = function(result) {
    let failed = result === false || result && result.status === -1;
    if (failed) {
      this.message = msg || util.format(MSG_ELEMENT_NOT_FOUND, this.elementSelector);
    }

    return failed;
  };

  this.value = function(result) {
    return !result.value;
  };

  this.command = function(callback) {
    return this.api.isVisible(selector, callback);
  };

};
