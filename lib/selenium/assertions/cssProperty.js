/**
 * Checks if the specified css property of a given element has the expected value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.cssProperty('#main', 'display', 'block');
 *    };
 * ```
 *
 * @method cssProperty
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} cssProperty The CSS property.
 * @param {string} expected The expected value of the css property to check.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
module.exports = function(selector, cssProperty, expected, msg) {
  var self = this;
  return this.api.getCssProperty(selector, cssProperty, function(result) {
    var passed, value = null;
    if (result === false || result && result.status === -1) {
      passed = false;
      msg = msg || ('Testing if element <' + selector + '> has css property ' + cssProperty + '. Element or attribute could not be located.');
    } else {
      passed = result.value === expected;
      value = result.value;
      msg = msg || ('Testing if element <' + selector + '> has css property: ' + cssProperty + ' = "' + expected + '"');
    }

    self.client.assertion(passed, value, expected, msg, self.abortOnFailure);
  });
};
