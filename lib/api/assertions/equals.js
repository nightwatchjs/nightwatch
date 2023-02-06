const Utils = require('../../utils/index.js');

exports.assertion = function (actual, expected, message) {
  this.options = {
    elementSelector: false
  };

  this.expected = function () {
    return this.negate ? `not equals to ${expected}` : `equals to ${expected}`;
  };

  this.formatMessage = function () {
    return {
      args: [],
      message: ''
    };
  };

  this.refineFormattedMessage = function (value) {
    const finalMessage =
      message ||
      `Testing if a value %s ${this.negate ? "doesn't equal to %s" : 'equals to %s'}`;

    this.message = finalMessage.includes('%s')
      ? Utils.Logger.formatMessage(finalMessage, value, expected)
      : finalMessage;
  };

  this.evaluate = function (value) {
    return value === expected;
  };

  this.command = async function (callback) {
    return callback({ value: await actual }, null);
  };
};
