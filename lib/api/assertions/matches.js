const Utils = require('../../utils/index.js');

exports.assertion = function (actual, expected, message) {
  this.options = {
    elementSelector: false
  };

  this.expected = function () {
    return this.negate ? `does not match ${expected}` : `matches ${expected}`;
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
      `Testing if a value %s ${
        this.negate ? 'does not match %s' : 'matches %s'
      }`;

    this.message = finalMessage.includes('%s')
      ? Utils.Logger.formatMessage(finalMessage, value, expected)
      : finalMessage;
  };

  this.evaluate = function (value) {
    const regexp = expected instanceof RegExp ? expected : new RegExp(expected);

    return regexp.test(value);
  };

  this.command = async function (callback) {
    return callback({ value: await actual }, null);
  };
};
