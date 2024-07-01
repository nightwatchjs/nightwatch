/**
 * Checks if the given element has child elements.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.assert.hasDescendants('#main');
 *   browser.assert.hasDescendants('#main', 'element has child elements');
 * };
 *
 * @method assert.hasDescendants
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {string} className The CSS class to look for.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */


const {setElementSelectorProps} = require('../../utils');

exports.assertion = function (definition, message) {
  this.options = {
    elementSelector: true
  };

  this.expected = function () {
    return `has ${this.negate ? 'not ' : ''}descendants`;
  };

  this.formatMessage = function () {
    const finalMessage =
      message ||
      `Testing if an element %s has ${this.negate ? 'not ' : ''}descendants`;

    return {
      args: [this.elementSelector],
      message: finalMessage
    };
  };

  this.evaluate = function (value) {
    return Boolean(value);
  };

  this.command = function (callback) {
    this.api.hasDescendants(
      setElementSelectorProps(definition, {
        suppressNotFoundErrors: true
      }),
      callback
    );
  };
};
