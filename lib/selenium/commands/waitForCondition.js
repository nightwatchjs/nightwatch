var Protocol = require('../protocol.js'),
    util = require('util'),
    events = require('events');

function CommandAction() {
  events.EventEmitter.call(this);
  this.startTimer = null;
  this.cb = null;
  this.ms = null;
  this.selector = null;
};

util.inherits(CommandAction, events.EventEmitter);

CommandAction.prototype.command = function(condition, milliseconds, timeout, callback) {
  if (milliseconds && typeof milliseconds != 'number') {
    throw new Error('waitForCondition expects first parameter to be number; ' +
      typeof (milliseconds) + ' given')
  }

  var lastArgument = Array.prototype.slice.call(arguments, 0).pop();
  if (typeof (lastArgument) === 'function') {
    callback = lastArgument;
  }

  this.startTimer = new Date().getTime();
  this.cb = callback || function() {};
  this.ms = milliseconds || 1000;
  this.timeout = timeout && typeof (timeout) !== 'function' ? timeout : 0;
  this.condition = condition;
  this.check();
  return this;
}

CommandAction.prototype.check = function() {
  var self = this;

  Protocol.actions.execute.call(this.client, this.condition, function(result) {
    var now = new Date().getTime();

    if (result.status === 0) {
       setTimeout(function() {
        self.cb(result.value);
        var msg = "Condition satisfied after " + (now - self.startTimer) + " milliseconds.";
        self.client.assertion(true, result.value, true, msg, true);
        return self.emit('complete');
       }, self.timeout);
    } else if (now - self.startTimer < self.ms) {
      setTimeout(function() {
        self.check();
      }, 500);
    } else {
      self.cb(false);
      var msg = msg || "Timed out while waiting for condition after " + self.ms + " milliseconds.";
      self.client.assertion(false, false, false, msg, true);
      return self.emit('complete');
    }
  });
};

module.exports = CommandAction;
