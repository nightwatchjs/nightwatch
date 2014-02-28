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
module.exports = function(selector, message) {
  var self = this;
  var msg = (message && message !== '') ? message : 'Testing if element <' + selector + '> is not present.';
  return this.api.element(this.client.locateStrategy, selector, function(result) {
    var value = null;
    if (result.status === 0) {
      value = result.value.ELEMENT;
    }
    self.client.assertion(value === null, value, false, msg, self.abortOnFailure);
  });
};
