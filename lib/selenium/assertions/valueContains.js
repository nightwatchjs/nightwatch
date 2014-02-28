/**
 * Checks if the given form element's value contains the expected value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.valueContains("form.login input[type=text]", "username");
 *    };
 * ```
 *
 * @method valueContains
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} expectedText The expected text.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
module.exports = function(selector, expectedText, msg) {
  var self = this;
  return this.api.getValue(selector, function(result) {
    var passed, value = null;
    if (result === false || result && result.status === -1) {
      passed = false;
      msg = msg || ('Testing if element <' + selector + '> contains text: ' + expectedText + '. Element could not be located.');
    } else {
      passed = result.value.indexOf(expectedText) !== -1;
      value = result.value;
      msg = msg || ('Testing if element <' + selector + '> contains text: ' + expectedText);
    }

    self.client.assertion(passed, value, expectedText, msg, self.abortOnFailure);
  });
};
