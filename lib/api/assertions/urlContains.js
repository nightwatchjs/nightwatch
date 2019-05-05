/**
 * Checks if the current URL contains the given value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.urlContains('google');
 *    };
 * ```
 *
 * @method urlContains
 * @param {string} expected The value expected to exist within the current URL.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const util = require('util');
exports.assertion = function(expected, msg) {
  this.message = msg || util.format('Testing if the URL contains "%s".', expected);
  this.expected = expected;

  this.pass = function(value) {
    return value.indexOf(this.expected) > -1;
  };

  this.value = function(result = {}) {
    return result.value || '';
  };

  this.command = function(callback) {
    this.api.url(callback);

    return this;
  };

};
