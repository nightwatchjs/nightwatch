/**
 * Checks if the current URL contains the given value.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.assert.urlContains('nightwatchjs.org');
 * };
 *
 * @method assert.urlContains
 * @param {string} expected The value expected to exist within the current URL.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(expected, msg) {
  this.expected = function() {
    return this.negate ? `not contains '${expected}'` : `contains '${expected}'`;
  };

  this.formatMessage = function() {
    const message = msg || `Testing if the URL ${this.negate ? 'doesn\'t contain %s' : 'contains %s'}`;

    return {
      message,
      args: [`'${expected}'`]
    };
  };

  this.pass = function(value) {
    return value.includes(expected);
  };

  this.value = function(result = {}) {
    if (!result) {
      return '';
    }

    return result.value || '';
  };

  this.command = function(callback) {
    this.api.url(function(result) {
      return callback.call(this, result);
    });
  };

};
