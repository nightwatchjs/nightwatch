/**
 * Checks if the given element is visible on the page.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.visible(".should_be_visible");
 *    };
 * ```
 *
 * @method visible
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
module.exports = function(selector, msg) {
  var self = this;
  return this.api.isVisible(selector, function(result) {
    var passed;
    if (result === false || result && result.status === -1) {
      passed = false;
      msg = msg || ('Testing if element <' + selector + '> is visible. Element could not be located.');
    } else {
      passed = result.value === true;
      msg = msg || ('Testing if element <' + selector + '> is visible.');
    }

    self.client.assertion(passed, passed, true, msg, self.abortOnFailure);
  });
};

