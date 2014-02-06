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

CommandAction.prototype.command = function(milliseconds, callback) {
  if (milliseconds && typeof milliseconds != 'number') {
    throw new Error('waitForPageToBeMobified expects first parameter to be number; ' + 
      typeof (milliseconds) + ' given')
  }
  this.startTimer = new Date().getTime();
  this.cb = callback || function() {};
  this.ms = milliseconds || 1000;
  this.check();  
  return this;
}

CommandAction.prototype.check = function() {
  var self = this;
  Protocol.actions.execute.call(this.client, 'return Mobify.evaluatedData', function(result) {
    var now = new Date().getTime();
    if (result.status === 0) {
      self.cb(result.value);  
      self.client.assertion(true, result.value, result.value, 'EvaluatedData, true');
      var msg = "Page was Mobified after " + (now - self.startTimer) + " milliseconds.";
      self.client.assertion(true, !!result.value, false, msg, true);
      return self.emit('complete');
    } else if (now - self.startTimer < self.ms) {
      setTimeout(function() {
        self.check();
      }, 500);  
    } else {
      self.cb(false);
      var msg = "Timed out while waiting for page to be Mobified after " + self.ms + " milliseconds.";
      self.client.assertion(false, false, false, msg, true);
      return self.emit('complete');  
    }
  });
};
    
module.exports = CommandAction;
