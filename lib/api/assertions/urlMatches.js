/**
 * Checks if the current url matches the given regular expression.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.urlMatches(/google\.com/);
 *    };
 * ```
 *
 * @method urlEquals
 * @param {RegExp} expected The expected regexp.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

var util = require('util');
exports.assertion = function(expected, msg) {

  this.message = msg || util.format('Testing if the URL matches "%s".', expected);
  this.expected = expected;

  this.pass = function(value) {
    return this.expected.test(value);
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    this.api.url(callback);
    return this;
  };

};
