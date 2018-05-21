const util = require('util');

exports.assertion = function(selector, attribute, expected, msg) {
  let DEFAULT_MSG = 'Testing if attribute %s of <%s> contains "%s".';
  let MSG_ELEMENT_NOT_FOUND = `${DEFAULT_MSG} Element could not be located.`;
  let MSG_ATTR_NOT_FOUND = `${DEFAULT_MSG} Element does not have a ${attribute} attribute.`;

  this.message = msg || util.format(DEFAULT_MSG, attribute, selector, expected);

  this.expected = function() {
    return expected;
  };

  this.pass = function(value) {
    return value === expected;
  };

  this.failure = function(result) {
    let failed = (result === false) ||
      // no such element
      result && (result.status === -1 || result.value === null);

    if (failed) {
      let defaultMsg = MSG_ELEMENT_NOT_FOUND;
      if (result && result.value === null) {
        defaultMsg = MSG_ATTR_NOT_FOUND;
      }
      this.message = msg || util.format(defaultMsg, attribute, selector, expected);
    }

    return failed;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
    return this.api.getAttribute(selector, attribute, callback);
  };

};
