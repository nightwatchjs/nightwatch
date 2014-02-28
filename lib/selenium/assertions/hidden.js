/**
 * Checks if the given element is not visible on the page.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.hidden(".should_not_be_visible");
 *    };
 * ```
 *
 * @method hidden
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
      msg = msg || ('Testing if element <' + selector + '> is hidden. Element could not be located.');
    } else {
      passed = result.value === false;
      msg = msg || ('Testing if element <' + selector + '> is hidden.');
    }

    self.client.assertion(passed, passed, true, msg, self.abortOnFailure);
  });
};

