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
  var DEFAULT_MSG = 'Testing if attribute %s of <%s> equals "%s".';
  var MSG_ELEMENT_NOT_FOUND = DEFAULT_MSG + ' ' + 'Element could not be located.';
  var MSG_ATTR_NOT_FOUND = DEFAULT_MSG + ' ' + 'Element does not have a ' + attribute + ' attribute.';

  this.message = msg || util.format(DEFAULT_MSG, attribute, selector, expected);

  this.expected = function() {
    return expected;
  };

  this.pass = function(value) {
    return value === expected;
  };

  this.failure = function(result) {
    var failed = (result === false) ||
      // no such element
      result && (result.status === -1 || result.value === null);

    if (failed) {
      var defaultMsg = MSG_ELEMENT_NOT_FOUND;
      if (result && result.value === null) {
        defaultMsg = MSG_ATTR_NOT_FOUND;
      }
      this.message = msg || util.format(defaultMsg, attribute, selector, expected);
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
