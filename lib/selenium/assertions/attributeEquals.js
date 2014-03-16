/**
 * Checks if the given attribute of an element has the expected value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.attributeEquals('body', 'data-attr', 'some value');
 *    };
 * ```
 *
 * @method attributeEquals
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} attribute The attribute name
 * @param {string} expected The expected value of the attribute to check.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

var util = require('util');
exports.assertion = function(selector, attribute, expected, msg) {

  var MSG_ELEMENT_NOT_FOUND = 'Testing if element <%s> has attribute %s. ' +
    'Element or attribute could not be located.';

  this.message = msg || util.format('Testing if element <%s> has attribute: %s = "%s".', selector, attribute, expected);

  this.expected = function() {
    return expected;
  };

  this.pass = function(value) {
    return value === expected;
  };

  this.failure = function(result) {
    var failed = result === false || result && result.status === -1;
    if (failed) {
      this.message = msg || util.format(MSG_ELEMENT_NOT_FOUND, selector, attribute);
    }
    return failed;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    return this.api.getAttribute(selector, attribute, callback);
  };

};
