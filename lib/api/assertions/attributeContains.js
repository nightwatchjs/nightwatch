/**
 * Checks if the given attribute of an element contains the expected value.
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.attributeContains('#someElement', 'href', 'google.com');
 *    };
 * ```
 *
 * @method attributeContains
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} attribute The attribute name
 * @param {string} expected The expected contained value of the attribute to check.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(definition, attribute, expected, msg) {
  this.options = {
    elementSelector: true
  };

  this.formatMessage = function() {
    const message = msg || `Testing if attribute %s of element %s ${this.negate ? 'doesn\'t contain %s' : 'contains %s'}`;

    return {
      message,
      args: [`'${attribute}'`, this.elementSelector, `'${expected}'`]
    }
  };

  this.evaluate = function(value) {
    value = value || '';

    return value.includes(expected);
  };

  this.actual = function() {
    const value = this.getValue();
    if (typeof value != 'string') {
      return `Element does not have a '${attribute}' attribute`;
    }

    return value;
  };

  this.expected = function() {
    return this.negate ? `not contains '${expected}'` : `contains '${expected}'`;
  };

  this.command = function(callback) {
    return this.api.getAttribute(definition, attribute, callback);
  };
};
