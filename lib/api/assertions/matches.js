/**
 * Checks if the given element matches the specified regular expression.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.matches('#main', /^The Night Watch$/i);
 *    };
 * ```
 *
 * @method matches
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} pattern The regular expression to match against.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

var util = require('util');
exports.assertion = function(selector, pattern, msg) {

  var MSG_ELEMENT_NOT_FOUND = 'Testing if element <%s> matches pattern: "%s". ' +
    'Element could not be located.';

  this.message = msg || util.format('Testing if element <%s> matches pattern: "%s".', selector, pattern);

  this.expected = function() {
    return pattern.source || pattern;
  };

  this.pass = function(value) {
    var regex = pattern;
    if (typeof pattern === 'string') {
      regex = new RegExp(pattern);
    }
    return regex.test(value);
  };

  this.failure = function(result) {
    var failed = result === false || result && result.status === -1;
    if (failed) {
      this.message = msg || util.format(MSG_ELEMENT_NOT_FOUND, selector, pattern.source || pattern);
    }
    return failed;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    return this.api.getText(selector, callback);
  };

};
