/**
 * Checks if the number of elements specified by a selector is equal to a given value.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.assert.elementsCount('div', 10);
 *   browser.assert.not.elementsCount('div', 10);
 * }
 *
 * @method assert.elementsCount
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {string} count expected number of elements to be present.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const Element = require('../../element');

exports.assertion = function (definition, count, msg) {
  this.options = {
    elementSelector: true
  };

  this.expected = function() {
    return this.negate ? `does not count ${count}` : `counts ${count}`;
  };

  this.formatMessage = function() {
    const message = msg || `Testing if the element count for %s ${this.negate ? 'is not %s' : 'is %s'}`;

    return {
      message,
      args: [this.elementSelector, count]
    };
  };

  this.evaluate = function(value) {
    return value === count;
  };

  this.value = function(result = {}) {
    if (!result || !result.value) {
      return '';
    }

    return result.value.length;

  };



  this.command = async function(callback) {

    await this.api.findElements(definition, callback);
  };
};
