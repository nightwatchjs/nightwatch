/**
 * Checks if the given attribute of an element has the expected value.
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.attributeEquals('body', 'data-attr', 'some value');
 *    };
 * ```
 *
 * @method attributeEquals
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} attribute The attribute name
 * @param {string} expected The expected value of the attribute to check.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(definition, attribute, expected, msg) {
  this.options = {
    elementSelector: true
  };

  this.formatMessage = function() {
    const message = msg || `Testing if attribute %s of element %s ${this.negate ? 'doesn\'t equal %s' : 'equals %s'}`;

    return {
      message,
      args: [`'${attribute}'`, this.elementSelector, `'${expected}'`]
    }
  };

  this.evaluate = function(value) {
    return value === expected;
  };

  this.actual = function(passed) {
    const value = this.getValue();
    if (typeof value != 'string') {
      return `Element does not have a '${attribute}' attribute`;
    }

    return value;
  };

  this.expected = function() {
    return this.negate ? `not equals '${expected}'` : `equals '${expected}'`;
  };

  this.command = function(callback) {
    this.api.getAttribute(definition, attribute, callback);
  };
};
