/**
 * Checks if the given form element's value contains the expected value.
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.valueContains("form.login input[type=text]", "username");
 *    };
 * ```
 *
 * @method valueContains
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} expected The expected text.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(definition, expected, msg) {
  this.options = {
    elementSelector: true
  };

  this.expected = function() {
    return this.negate ? `not contains '${expected}'` : `contains '${expected}'`;
  };

  this.formatMessage = function() {
    const message = msg || `Testing if value of element %s ${this.negate ? 'doesn\'t contain %s' : 'contains %s'}`;

    return {
      message,
      args: [this.elementSelector, `'${expected}'`]
    }
  };

  this.actual = function(passed) {
    const value = this.getValue();
    if (typeof value != 'string') {
      return 'Element does not have a value attribute';
    }

    return this.getValue();
  };

  this.evaluate = function(value) {
    value = value || '';

    return value.includes(expected);
  };

  this.command = function(callback) {
    this.api.getValue(definition, callback);
  };
};
