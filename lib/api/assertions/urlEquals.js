/**
 * Checks if the current url equals the given value.
 *
 * @example
 * this.demoTest = function (client) {
 *   browser.assert.urlEquals('https://www.google.com');
 * };
 *
 * @method assert.urlEquals
 * @param {string} expected The expected url.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(expected, msg) {
  this.expected = function() {
    return this.negate ? `is not '${expected}'` : `is '${expected}'`;
  };

  this.formatMessage = function() {
    const message = msg || `Testing if the URL ${this.negate ? 'is not %s' : 'is %s'}`;

    return {
      message,
      args: [`'${expected}'`]
    };
  };

  this.pass = function(value) {
    return value === expected;
  };

  this.value = function(result = {}) {
    return result.value || '';
  };

  this.command = function(callback) {
    this.api.url(callback);
  };

};
