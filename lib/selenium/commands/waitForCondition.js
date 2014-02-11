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

CommandAction.prototype.command = function(condition, milliseconds, callback) {
  if (milliseconds && typeof milliseconds != 'number') {
    throw new Error('waitForCondition expects first parameter to be number; ' + 
      typeof (milliseconds) + ' given')
  }
  this.startTimer = new Date().getTime();
  this.cb = callback || function() {};
  this.ms = milliseconds || 1000;
  this.condition = condition;
  this.check();  
  return this;
}

CommandAction.prototype.check = function() {
  var self = this;
  Protocol.actions.execute.call(this.client, this.condition, function(result) {
    var now = new Date().getTime();
    if (result.status === 0) {
        self.cb(result.value);  
        var msg = "Condition satisfied after " + (now - self.startTimer) + " milliseconds.";
        self.client.assertion(true, result.value, true, msg, true);
        return self.emit('complete');
    } else if (now - self.startTimer < self.ms) {
      setTimeout(function() {
        self.check();
      }, 500);  
    } else {
      self.cb(false);
      var msg = "Timed out while waiting for condition after " + self.ms + " milliseconds.";
      self.client.assertion(false, false, false, msg, true);
      return self.emit('complete');  
    }
  });
};
    
module.exports = CommandAction;
