/**
 * Checks if the given attribute of an element has the expected value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.attributeEquals('body', 'data-attr', 'some value');
 *    };
 * ```
 *
 * @method attributeEquals
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} attribute The attribute name
 * @param {string} expected The expected value of the attribute to check.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
module.exports = function(selector, attribute, expected, msg) {
  var self = this;

  return this.api.getAttribute(selector, attribute, function(result) {
    var passed, value = null;
    if (result === false || result && result.status === -1) {
      passed = false;
      msg = msg || ('Testing if element <' + selector + '> has attribute ' + attribute + '. Element or attribute could not be located.');
    } else {
      passed = result.value === expected;
      value = result.value;
      msg = msg || ('Testing if element <' + selector + '> has attribute: ' + attribute + ' = "' + expected + '"');
    }

    self.client.assertion(passed, value, expected, msg, self.abortOnFailure);
  });
};
