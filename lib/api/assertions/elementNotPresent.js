/**
 * Checks if the given element exists in the DOM.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.elementNotPresent(".should_not_exist");
 *    };
 * ```
 *
 * @method elementNotPresent
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

const util = require('util');
const Element = require('../../element/element.js');

exports.assertion = function(selector, msg) {
  this.expected = 'not present';
  this.element = Element.createFromSelector(selector, this.client.locateStrategy);
  this.message = msg || util.format('Testing if element <%s> is not present.', selector);

  this.pass = function(value) {
    return value === 'not present';
  };

  this.value = function(result) {
    return result.value && result.value.length > 0 ? 'present' : 'not present';
  };

  this.command = function(callback) {
    return this.api.elements(this.client.locateStrategy, this.element, callback);
  };

};
