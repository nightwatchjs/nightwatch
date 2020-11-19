/**
 * Checks if the given attribute of an element is present
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.attributePresent('#someElement', 'href');
 *    };
 * ```
 *
 * @method attributePresent
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} attribute The attribute name
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(definition, attribute, msg) {
  this.options = { elementSelector: true };

  this.formatMessage = function() {
    const message = msg || `Testing if attribute %s of element %s ${this.negate ? 'is not present' : 'is present'}`;

    return {
      message,
      args: [`'${attribute}'`, this.elementSelector]
    };
  };

  this.evaluate = function(value) {
    return value;
  };

  this.actual = function() {
    return typeof this.getValue() === 'string';
  };

  this.expected = function() {
    return this.negate ? 'is not present' : 'is present';
  };

  this.command = function(callback) {
    return this.api.getAttribute(definition, attribute, callback);
  };
};
