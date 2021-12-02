
/**
 * The .assert.value() command, which will become an alias of this and will be deprecated
 *
 */

const {setElementSelectorProps} = require('../../utils');


exports.assertion = function(definition, expected, msg) {
  this.options = {
    elementSelector: true
  };

  this.expected = function() {
    return this.negate ? `not equals '${expected}'` : `equals '${expected}'`;
  };

  this.formatMessage = function() {
    const message = msg || `Testing if value of element %s ${this.negate ? 'doesn\'t equal %s' : 'equals %s'}`;

    return {
      message,
      args: [this.elementSelector, `'${expected}'`]
    };
  };

  this.pass = function(value) {
    return value === expected;
  };

  this.value = function(result = {}) {
    return result.value || '';
  };

  this.command = function(callback) {
    this.api.getValue(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), callback);
  };
};
