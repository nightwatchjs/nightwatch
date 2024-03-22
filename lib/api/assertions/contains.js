const Utils = require('../../utils/index.js');

exports.assertion = function (actual, expected, message) {
  this.options = {
    elementSelector: false
  };

  this.expected = function () {
    return this.negate
      ? `does not contain ${expected}`
      : `contains ${expected}`;
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
        this.negate ? 'does not contain %s' : 'contains %s'
      }`;

    this.message = finalMessage.includes('%s')
      ? Utils.Logger.formatMessage(finalMessage, value, expected)
      : finalMessage;
  };

  this.evaluate = function (value) {
    return value.includes(expected);
  };

  this.command = async function (callback) {
    return callback({value: await actual}, null);
  };
};
