/**
 * Checks if the page title equals the given value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.title('Nightwatch.js');
 *    };
 * ```
 *
 * @method title
 * @param {string} expected The expected page title.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(expected, msg) {
  this.message = msg || 'Testing if the page title equals %s';
  this.expected = expected;

  this.pass = function(value) {
    return value === this.expected;
  };

  this.command = function(callback) {
    this.api.title(callback);
  };

};
