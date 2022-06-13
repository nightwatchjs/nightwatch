/**
 * Checks if the given element does not exist in the DOM.
 *
 * ```
 *    this.demoTest = function (browser) {
 *      browser.assert.elementNotPresent(".should_not_exist");
 *    };
 * ```
 *
 * @method elementNotPresent
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 * @deprecated
 */
const Element = require('../../element');

exports.assertion = function(selector, msg) {
  this.options = {
    elementSelector: true
  };

  // eslint-disable-next-line no-console
  console.warn('DEPRECATED: the assertion .elementNotPresent() has been deprecated and will be ' +
    'removed from future versions. Use assert.not.elementPresent().');

  this.element = Element.createFromSelector(selector, this.client.locateStrategy);
  this.formatMessage = function() {
    const message = msg || 'Testing if element %s is not present';

    return {
      message,
      args: [this.elementSelector]
    };
  };

  this.pass = function(value) {
    return value === 'not present';
  };

  this.expected = function() {
    return 'is not present';
  };

  this.value = function(result) {
    return result.value && result.value.length > 0 ? 'present' : 'not present';
  };

  this.command = function(callback) {
    this.api.elements(this.client.locateStrategy, this.element, callback);
  };
};
