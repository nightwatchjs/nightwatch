/**
 * Checks if the given element has the specified CSS class. Multiple css classes can be specified either as an array or a space-delimited string.
 *
 * In case the expected value is a space delimited string, the order is not taken into account - each value will individually be checked against.
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.cssClassPresent('#main', 'container');
 *      browser.assert.cssClassPresent('#main', ['visible', 'container']);
 *      browser.assert.cssClassPresent('#main', 'visible container');
 *    };
 * ```
 *
 * @method assert.cssClassPresent
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} className The CSS class to look for.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 * @deprecated
 */
const classListRegexp = /\s/;
const classNameRegexp = /\w/;
const {containsMultiple, setElementSelectorProps} = require('../../utils');

exports.assertion = function(definition, expected, msg) {
  this.options = {
    elementSelector: true
  };

  // eslint-disable-next-line no-console
  console.warn('DEPRECATED: the assertion .cssClassPresent() has been deprecated and will be ' +
    'removed from future versions. Use assert.hasClass().');

  this.formatMessage = function() {
    let message = msg || `Testing if element %s ${this.negate ? 'doesn\'t have css class %s' : 'has css class %s'}`;

    return {
      message,
      args: [this.elementSelector, `'${Array.isArray(expected) ? expected.join(' ') : expected}'`]
    };
  };

  this.expected = function() {
    return this.negate ? `has not ${expected}` : `has ${expected}`;
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
