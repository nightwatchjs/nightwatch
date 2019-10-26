/**
 * Checks if the given form element's value equals the expected value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.value("form.login input[type=text]", "username");
 *    };
 * ```
 *
 * @method value
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} expected The expected text.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(selector, expected, msg) {
  const MSG_ELEMENT_NOT_FOUND = 'Testing if value of %s equals: %s. ' +
    'Element or attribute could not be located.';

  this.options = {
    elementSelector: true
  };
  this.expected = expected;
  this.message = msg || 'Testing if value of %s equals: %s.';

  this.pass = function(value) {
    return value === this.expected;
  };

  this.failure = function(result) {
    let failed = (result === false) ||
      // no such element
      result && result.status === -1 ||
      // element doesn't have a value attribute
      result && result.value === null;

    if (failed) {
      this.message = msg || MSG_ELEMENT_NOT_FOUND;
    }

    return failed;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    this.api.getValue(selector, callback);
  };
};
