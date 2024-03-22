
/**
 * Checks if the given form element's value equals the expected value.
 *
 * The existing .assert.value() command.
 *
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.assert.valueEquals("form.login input[type=text]", "username");
 * };
 *
 * @method assert.valueEquals
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} expected The expected text.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const {setElementSelectorProps} = require('../../utils');


exports.assertion = function(definition, expected, msg) {
  this.options = {
    elementSelector: true
  };

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

  this.evaluate = function(value) {
    return value === expected;
  };

  this.value = function(result = {}) {
    return result.value || '';
  };

  this.command = function(callback) {
    this.api.getValue(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), callback);
  };
};
