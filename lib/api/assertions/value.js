/**
 * Checks if the given form element's value equals the expected value.
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.value("form.login input[type=text]", "username");
 *    };
 * ```
 *
 * @method value
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {string} expected The expected text.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 * @deprecated
 */
const {setElementSelectorProps} = require('../../utils');

exports.assertion = function(definition, expected, msg) {
  this.options = {
    elementSelector: true
  };

  // eslint-disable-next-line no-console
  console.warn('DEPRECATED: the assertion .value() has been deprecated and will be ' +
    'removed from future versions. Use assert.valueEquals() instead.');

  this.expected = function() {
    return this.negate ? `not equals '${expected}'` : `equals '${expected}'`;
  };

  this.formatMessage = function() {
    const message = msg || `Testing if value of element %s ${this.negate ? 'doesn\'t equal %s' : 'equals %s'}`;

    return {
      message,
      args: [this.elementSelector, `'${expected}'`]
    };
  };

  this.actual = function(passed) {
    const value = this.getValue();
    if (typeof value != 'string') {
      return 'Element does not have a value attribute';
    }

    return this.getValue();
  };

  this.evaluate = function(value) {
    return value === expected;
  };

  this.command = function(callback) {
    this.api.getValue(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), callback);
  };
};
