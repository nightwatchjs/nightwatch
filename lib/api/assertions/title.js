/**
 * Checks if the page title equals the given value.
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.title('Nightwatch.js');
 *    };
 * ```
 *
 * @method title
 * @param {string} expected The expected page title.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 * @deprecated
 */
exports.assertion = function(expected, msg) {
  // eslint-disable-next-line no-console
  console.warn('DEPRECATED: the assertion .title() has been deprecated and will be ' +
    'removed from future versions. Use assert.titleEquals().');

  this.formatMessage = function() {
    const message = msg || `Testing if the page title ${this.negate ? 'doesn\'t equal %s' : 'equals %s'}`;

    return {
      message,
      args: [`'${expected}'`]
    };
  };

  this.expected = function() {
    return this.negate ? `is not '${expected}'` : `is '${expected}'`;
  };

  this.pass = function(value) {
    return value === expected;
  };

  this.value = function(result = {}) {
    return result.value || '';
  };

  this.command = function(callback) {
    this.api.title(callback);
  };

};
