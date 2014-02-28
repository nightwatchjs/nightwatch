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
module.exports = function(selector, message) {
  var self = this;
  var msg = (message && message !== '') ? message : 'Testing if element <' + selector + '> is present.';

  return this.api.element(this.client.locateStrategy, selector, function(result) {
    var value = null;
    if (result.status === 0) {
      value = result.value.ELEMENT;
    }
    self.client.assertion(value !== null, value, true, msg, self.abortOnFailure);
  });
};
