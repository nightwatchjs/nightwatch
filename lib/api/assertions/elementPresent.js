/**
 * Checks if the given element exists in the DOM.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.assert.elementPresent("#main");
 * };
 *
 * @method assert.elementPresent
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
const Element = require('../../element');

exports.assertion = function(selector, msg) {
  this.options = {
    elementSelector: true
  };

  this.element = Element.createFromSelector(selector, this.client.locateStrategy);
  this.formatMessage = function() {
    const message = msg || `Testing if element %s ${this.negate ? 'is not present' : 'is present'}`;

    return {
      message,
      args: [this.elementSelector]
    };
  };

  this.pass = function(value) {
    return value === 'present';
  };

  this.expected = function() {
    return this.negate ? 'is not present' : 'is present';
  };

  this.value = function(result) {
    return result.value && result.value.length > 0 ? 'present' : 'not present';
  };

  this.command = function(callback) {
    this.api.elements(this.client.locateStrategy, this.element, callback);
  };
};
