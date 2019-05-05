/**
 * Checks if the page title equals the given value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.title("Nightwatch.js");
 *    };
 * ```
 *
 * @method title
 * @param {string} expected The expected page title.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const util = require('util');
exports.assertion = function(expected, msg) {
  this.message = msg || util.format('Testing if the page title equals "%s".', expected);
  this.expected = expected;

  this.pass = function(value) {
    return value === this.expected;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    this.api.title(callback);

    return this;
  };

};
