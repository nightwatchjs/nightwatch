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

var util = require('util');
exports.assertion = function(selector, msg) {

  this.message = msg || util.format('Testing if element <%s> is not present.', selector);
  this.expected = 'not present';

  this.pass = function(value) {
    return value === 'not present';
  };

  this.value = function(result) {
    return (result.status !== 0 || result.value.length === 0) ? 'not present' : 'present';
  };

  this.command = function(callback) {
    return this.api.elements(this.client.locateStrategy, selector, callback);
  };

};
