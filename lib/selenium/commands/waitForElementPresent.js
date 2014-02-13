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

CommandAction.prototype.command = function(cssSelector, milliseconds, callback) {
  if (typeof milliseconds != 'number') {
    throw new Error('waitForElementPresent expects second parameter to be number; ' + 
      typeof (milliseconds) + ' given');
  }
  this.startTimer = new Date().getTime();
  this.cb = callback || function() {};
  this.ms = milliseconds;
  this.selector = cssSelector;  
  this.checkElement();  
  return this;
};

CommandAction.prototype.checkElement = function() {
  var self = this;
  Protocol.actions.element.call(this.client, 'css selector', this.selector, function(result) {
    var now = new Date().getTime();
    if (result.status === 0) {
      self.cb(result.value);  
      var msg = "Element <" + self.selector + "> was present after " + (now - self.startTimer) + " milliseconds.";
      self.client.assertion(true, result.value, '!false', msg, true);
      return self.emit('complete');
    } else if (now - self.startTimer < self.ms) {
      setTimeout(function() {
        self.checkElement();
      }, 500);  
    } else {
      self.cb(false);
      var msg = "Timed out while waiting for element <" + self.selector + "> to be present for " + self.ms + " milliseconds.";
      self.client.assertion(false, false, false, msg, true);
      return self.emit('complete');  
    }
  });
};
    
module.exports = CommandAction;
