/**
 * Check if an element's attribute value matches a regular expression.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.assert.attributeMatches('body', 'data-attr', '(value)');
 * };
 *
 * @method assert.attributeMatches
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html#postdoc-element-properties).
 * @param {string} attribute The attribute name
 * @param {string|RegExp} regexExpression Regex expression to match attribute value.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
const {setElementSelectorProps} = require('../../utils');

exports.assertion = function(definition, attribute, regexExpression, msg) {
  this.options = {
    elementSelector: true
  };

  this.expected = function() {
    return this.negate ? `does not matches '${regexExpression}'` : `matches '${regexExpression}'`;
  };

  this.formatMessage = function() {
    const message = msg || `Testing if attribute %s of element %s ${this.negate ? 'doesn\'t matches %s' : 'matches %s'}`;

    return {
      message,
      args: [`'${attribute}'`, this.elementSelector, `'${regexExpression}'`]
    };
  };

  this.evaluate = function(value) {
    const regex = value instanceof RegExp ? value : new RegExp(regexExpression);

    return regex.test(value);
  };

  this.value = function(result = {}) {
    return result.value || '';
  };

  this.command = function(callback) {
    this.api.getAttribute(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), attribute, callback);
  };
};
