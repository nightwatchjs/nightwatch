/**
 * Checks if the page title equals the given value.
 * 
 * @example
 * 
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.titleEquals('https://www.google.com');
 *    };
 * ```
 *
 * @method titleEquals
 * @param {string} expected The expect page title
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(expected, msg) {
  this.expected = function() {
    return this.negate ? `is not '${expected}'` : `is '${expected}'`;
  };

  this.formatMessage = function() {
    const message = msg || `Testing if the page title ${this.negate ? 'doesn\'t equal %s' : 'equals %s'}`;

    return {
      message,
      args: [`'${expected}'`]
    };
  };

  this.evaluate = function(value) {
    return value === expected;
  };

  this.value = function(result = {}) {
    return result.value || '';
  };

  this.command = function(callback) {
    this.api.title(callback);
  };
};
