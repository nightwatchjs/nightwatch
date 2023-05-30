/**
 * Checks if the specified css property of a given element has the expected value.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.assert.cssProperty('#main', 'display', 'block');
 * };
 *
 * @method assert.cssProperty
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} cssProperty The CSS property.
 * @param {string} expected The expected value of the css property to check.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
const {setElementSelectorProps} = require('../../utils');

exports.assertion = function(definition, cssProperty, expected, msg) {
  this.options = {
    elementSelector: true
  };

  this.formatMessage = function() {
    let message = msg || `Testing if element %s ${this.negate ? 'doesn\'t have css property %s: %s' : 'has css property %s: %s'}`;

    return {
      message,
      args: [this.elementSelector, `'${cssProperty}`, `${expected}'`]
    };
  };

  this.actual = function(passed) {
    const value = this.getValue();
    if (typeof value != 'string') {
      return `Element does not have a '${cssProperty}' css property`;
    }

    return value;
  };

  this.expected = function() {
    return this.negate ? `not ${expected}` : expected;
  };

  this.evaluate = function(value) {
    return value === expected;
  };

  this.command = function(callback) {
    this.api.getCssProperty(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), cssProperty, callback);
  };
};
