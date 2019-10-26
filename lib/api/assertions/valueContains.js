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
 * @param {string} definition The selector (CSS / Xpath) used to locate the element.
 * @param {string} expected The expected text.
 * @param {string} [msg] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */
exports.assertion = function(definition, expected, msg) {
  const DEFAULT_MSG = 'Testing if value of %s contains: %s.';
  const MSG_ELEMENT_NOT_FOUND = DEFAULT_MSG + ' ' + 'Element could not be located.';
  const VALUE_ATTR_NOT_FOUND = DEFAULT_MSG + ' ' +  'Element does not have a value attribute.';

  this.options = {
    elementSelector: true
  };
  this.expected = true;
  this.message = msg || DEFAULT_MSG;

  this.pass = function(value) {
    return value.indexOf(expected) > -1;
  };

  this.failure = function(result) {
    let failed = (result === false) ||
      // no such element
      result && (result.status === -1 || result.value === null);

    if (failed) {
      let defaultMsg = MSG_ELEMENT_NOT_FOUND;
      if (result && result.value === null) {
        defaultMsg = VALUE_ATTR_NOT_FOUND;
      }
      this.message = msg || defaultMsg;
    }

    return failed;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    this.api.getValue(definition, callback);
  };
};
