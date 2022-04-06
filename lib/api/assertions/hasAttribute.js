
/**
 * Checks if the given element contains the specified DOM attribute.
 *
 * Equivalent of: https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute
 * 
 * @example
 * 
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.hasAttribute('#main', 'data-track');
 *    };
 * ```
 * 
 * @method hasAttribute
 * @param {string|object} definition The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies [element properties](https://nightwatchjs.org/guide#element-properties).
 * @param {string} expectedAttribute The DOM attribute to look for.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const {setElementSelectorProps, containsMultiple} = require('../../utils');

exports.assertion = function(definition, expectedAttribute, msg) {
  this.options = {
    elementSelector: true
  };

  this.expected = function() {
    return this.negate ? `has not ${expectedAttribute}` : `has ${expectedAttribute}`;
  };
 

  this.formatMessage = function() {
    let message = msg || `Testing if element %s ${this.negate ? 'doesn\'t have attribute %s' : 'has attribute %s'}`;
 
    return {
      message,
      args: [this.elementSelector, `'${Array.isArray(expectedAttribute) ? expectedAttribute.join(' ') : expectedAttribute}'`]
    };
  };

  this.evaluate = function() {
    if (!this.attributeList) {
      return false;
    }
 
    return containsMultiple(this.attributeList, expectedAttribute, ' ');
  };

  this.value = function(result) {
    if (!result || !result.value) {
      return '';
    }

    this.attributeList = result.value.map(attribute =>  attribute.name);

    return this.attributeList;
  };

  this.command = function(callback) {
    this.api.getAttribute(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), 'attributes', callback);
  };
};
