/**
 * Checks if the given element has the specified CSS class.
 * 
 * @example
 * 
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.hasClass('#main', 'container');
 *      browser.assert.hasClass('#main', ['visible', 'container']);
 *      browser.assert.hasClass('#main', 'visible container');
 *    };
 * ```
 *
 * @method hasClass
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} className The CSS class to look for.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const classListRegexp = /\s/;
const classNameRegexp = /\w/;
const {containsMultiple, setElementSelectorProps} = require('../../utils');
 
exports.assertion = function(definition, expected, msg) {
  this.options = {
    elementSelector: true
  };

  this.expected = function() {
    return this.negate ? `has not ${expected}` : `has ${expected}`;
  };
 
  this.formatMessage = function() {
    let message = msg || `Testing if element %s ${this.negate ? 'doesn\'t have css class %s' : 'has css class %s'}`;
 
    return {
      message,
      args: [this.elementSelector, `'${Array.isArray(expected) ? expected.join(' ') : expected}'`]
    };
  };
 
 
  this.evaluate = function() {
    if (!this.classList) {
      return false;
    }
 
    return containsMultiple(this.classList, expected, ' ');
  };
 
  this.value = function(result) {
    if (!result || !result.value) {
      return '';
    }
 
    this.classList = result.value
      .split(classListRegexp)
      .filter(item => classNameRegexp.test(item));
 
    return result.value;
  };
 
  this.command = function(callback) {
    this.api.getAttribute(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), 'class', callback);
  };
};
 