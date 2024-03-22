/**
 * Checks if the current title matches a regular expression.
 *
 * @example
 * this.demoTest = function (client) {
 *   browser.assert.titleMatches('^Nightwatch');
 * };
 *
 * @method assert.titleMatches
 * @param {string|RegExp} regexExpression Regex expression to match current title of a page
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(regexExpression, msg) {
  this.expected = function() {
    return this.negate ? `does not matches '${regexExpression}'` : `matches '${regexExpression}'`;
  };

  this.formatMessage = function() {
    const message = msg || `Testing if the page title ${this.negate ? 'doesn\'t matches %s' : 'matches %s'}`;

    return {
      message,
      args: [`'${regexExpression}'`]
    };
  };

  this.evaluate = function(value) {
    const regex = value instanceof RegExp ? value : new RegExp(regexExpression);

    return regex.test(value);
  };

  this.value = function(result = {}) {
    return result.value || '';
  };

  this.command = function(callback) {
    this.api.title(callback);
  };
};
