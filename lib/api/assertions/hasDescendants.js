const {setElementSelectorProps} = require('../../utils');

exports.assertion = function (definition, message) {
  this.options = {
    elementSelector: true
  };

  this.expected = function () {
    return `has ${this.negate ? 'not ' : ''}descendants`;
  };

  this.formatMessage = function () {
    const finalMessage =
      message ||
      `Testing if an element %s has ${this.negate ? 'not ' : ''}descendants`;

    return {
      args: [this.elementSelector],
      message: finalMessage
    };
  };

  this.evaluate = function (value) {
    return Boolean(value);
  };

  this.command = function (callback) {
    this.api.hasDescendants(
      setElementSelectorProps(definition, {
        suppressNotFoundErrors: true
      }),
      callback
    );
  };
};
