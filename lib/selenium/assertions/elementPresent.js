/**
 * Checks if the given element exists in the DOM.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.elementPresent("#main");
 *    };
 * ```
 *
 * @method elementPresent
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

var util = require('util');
exports.assertion = function(selector, msg) {

  this.message = msg || util.format('Testing if element <%s> is present.', selector);
  this.expected = 'present';

  this.pass = function(value) {
    return value !== null;
  };

  this.value = function(result) {
    var value = null;
    if (result.status === 0) {
      value = result.value.ELEMENT;
    }
    return value;
  };

  this.command = function(callback) {
    return this.api.element(this.client.locateStrategy, selector, callback);
  };

};