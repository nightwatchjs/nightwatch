/**
 * Checks if the current url equals the given value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.urlEquals('https://www.google.com');
 *    };
 * ```
 *
 * @method urlEquals
 * @param {string} expected The expected url.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const util = require('util');
exports.assertion = function(expected, msg) {
  this.message = msg || util.format('Testing if the URL equals "%s".', expected);
  this.expected = expected;

  this.pass = function(value) {
    return value === this.expected;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    this.api.url(callback);

    return this;
  };

};
