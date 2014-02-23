var Protocol = require('../protocol.js'),
    util = require('util'),
    events = require('events');

function CommandAction() {
  events.EventEmitter.call(this);
  this.startTimer = null;
  this.cb = null;
  this.ms = null;
  this.abortOnFailure = true;
  this.selector = null;
}

util.inherits(CommandAction, events.EventEmitter);

CommandAction.prototype.command = function(cssSelector, milliseconds, callbackOrAbort) {
  if (typeof milliseconds != 'number') {
    throw new Error('waitForElementPresent expects second parameter to be number; ' +
      typeof (milliseconds) + ' given');
  }
  this.startTimer = new Date().getTime();

  if (typeof arguments[2] == 'boolean') {
    this.abortOnFailure = arguments[2];
    this.cb = arguments[3] || function() {};
  } else {
    this.cb = callbackOrAbort || function() {};
  }

  this.ms = milliseconds;
  this.selector = cssSelector;
  this.checkElement();
  return this;
};

CommandAction.prototype.checkElement = function() {
  var self = this;
  Protocol.actions.element.call(this.client, 'css selector', this.selector, function(result) {
    var now = new Date().getTime();
    var msg;
    if (result.status === 0) {
      self.cb(result.value);
      msg = "Element <" + self.selector + "> was present after " + (now - self.startTimer) + " milliseconds.";
      self.client.assertion(true, result.value, '!false', msg, true, false);
      return self.emit('complete');
    } else if (now - self.startTimer < self.ms) {
      setTimeout(function() {
        self.checkElement();
      }, 500);
    } else {
      self.cb(false);
      msg = "Timed out while waiting for element <" + self.selector + "> to be present for " + self.ms + " milliseconds.";
      self.client.assertion(false, false, false, msg, self.abortOnFailure, false);
      return self.emit('complete');
    }
  });
};

module.exports = CommandAction;
