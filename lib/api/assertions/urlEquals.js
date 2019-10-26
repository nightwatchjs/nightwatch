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
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(expected, msg) {
  this.expected = expected;
  this.message = msg || 'Testing if the URL equals %s';

  this.pass = function(value) {
    return value === this.expected;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    this.api.url(callback);
  };

};
