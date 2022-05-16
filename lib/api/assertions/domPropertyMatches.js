/**
 * Check if specified DOM property value of a given element matches a regex. For all the available DOM element properties, consult the [Element doc at MDN](https://developer.mozilla.org/en-US/docs/Web/API/element).
 * 
 * 
 * @example
 * 
 * ```
 * this.demoTest = function (browser) {
 *   browser.assert.domPropertyMatches('#main', 'tagName', /^frame/);
 * }
 * ```
 * 
 * @method domPropertyMatches
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} domProperty The DOM property name.
 * @param {string|RegExp} regexExpression Regex to match against.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const {setElementSelectorProps} = require('../../utils');

exports.assertion = function (definition, domProperty, regexExpression, msg) {
  this.options = {
    elementSelector: true
  };

  this.expected = function() {
    return this.negate ? `does not matches '${regexExpression}'` : `matches '${regexExpression}'`;
  };


  this.formatMessage = function() {
    const message = msg || `Testing if dom property %s of element %s ${this.negate ? 'doesn\'t matches %s' : 'matches %s'}`;

    return {
      message,
      args: [`'${domProperty}'`, this.elementSelector, `'${regexExpression}'`]
    };
  };

  this.evaluate = function (value) {
    const regex = value instanceof RegExp ? value : new RegExp(regexExpression);

    if (!Array.isArray(value)) {
      return regex.test(value);
    } 

    return false;
  }; 

  this.value = function(result = {}) {
    return result.value || '';
  };

  this.command = function(callback) {
    this.api.getElementProperty(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), domProperty, callback);
  };
};
