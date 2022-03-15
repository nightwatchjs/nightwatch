/**
 * Check if an element's inner text equals the expected text.
 *
 * @example
 * 
 * ```
 *   this.demoTest = function (browser) {
 *     browser.assert.textEquals('#main', 'The Night Watch');
 *   };
 * ```
 * 
 * @method textEquals 
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} expected text to match text.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const {setElementSelectorProps} = require('../../utils');

exports.assertion = function(definition, expected, msg) {
  this.options = {
    elementSelector: true
  };
 
  this.formatMessage = function() {
    const message = msg || `Testing if element's %s inner text ${this.negate ? 'doesn\'t equal %s' : 'equals %s'}`;
 
    return {
      message,
      args: [this.elementSelector, `'${expected}'`]
    };
  };
 
  this.expected = function() {
    return this.negate ? `doesn't equal '${expected}'` : `equals '${expected}'`;
  };
 
  this.evaluate = function(value) {
    if (typeof value != 'string') {
      return false;
    }

    return value === expected;
  };

  this.failure = function(result) {
    return result === false || result && result.status === -1;
  };

  this.actual = function(passed) {
    const value = this.getValue();
    if (typeof value != 'string') {
      return 'Element does not have an innerText attribute';
    }

    return value;
  };

  this.value = function(result) {
    if (result.status === -1) {
      return null;
    }

    return result.value;
  };

  this.command = function(callback) {
    this.api.getText(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), callback);
  };
};