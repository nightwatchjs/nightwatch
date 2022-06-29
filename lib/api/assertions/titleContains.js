/**
 * Checks if the page title contains the given value.
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.titleContains('Nightwatch.js');
 *    };
 * ```
 *
 * @method titleContains
 * @param {string} value The value to look for.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(expected, msg) {
  this.expected = function() {
    return this.negate ? `not contains '${expected}'` : `contains '${expected}'`;
  };

  this.formatMessage = function() {
    const message = msg || `Testing if the page title ${this.negate ? 'doesn\'t contain %s' : 'contains %s'}`;

    return {
      message,
      args: [`'${expected}'`]
    };
  };

  this.pass = function(value) {
    value = value || '';

    return value.includes(expected);
  };

  this.value = function(result = {}) {
    if (!result) {
      return '';
    }

    return result.value || '';
  };

  this.command = function(callback) {
    this.api.title(callback);
  };
};
