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
module.exports = function(expected, msg) {
  var self = this;
  return this.api.title(function(result) {
    var passed = result.value === expected;
    msg = msg || ('Testing if the page title equals "' + expected + '".');
    self.client.assertion(passed, result.value, expected, msg, self.abortOnFailure);
  });
};
