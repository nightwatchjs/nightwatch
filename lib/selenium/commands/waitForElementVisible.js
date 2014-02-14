var Protocol = require('../protocol.js'),
    util = require('util'),
    events = require('events');
    
function CommandAction() {
  events.EventEmitter.call(this);
  this.startTimer = null;
  this.cb = null;
  this.element = null;
  this.ms = null;
  this.msg = null;
  this.selector = null;
};

util.inherits(CommandAction, events.EventEmitter);

CommandAction.prototype.command = function(cssSelector, milliseconds, callback, msg) {
  this.startTimer = new Date().getTime();
  this.cb = callback || function() {};
  if (typeof milliseconds != 'number') {
    throw new Error('waitForElementVisible expects second parameter to be number; ' + 
      typeof (milliseconds) + ' given');
  }
  this.ms = milliseconds;
  
  this.selector = cssSelector;  
  this.checkElement();  
  return this;
};

CommandAction.prototype.isVisible = function() {
  var self = this;
  var el = Protocol.actions.elementIdDisplayed.call(this.client, this.element, function(result) {
    var now = new Date().getTime();
    if (result.status == 0 && result.value === true) {
      self.cb(result);  
      var msg = "Element <" + self.selector + "> was visible after " + (now - self.startTimer) + " milliseconds.";
      self.client.assertion(true, true, true, msg, true);
      return self.emit('complete');
    }
    
    if (now - self.startTimer < self.ms) {
      setTimeout(function() {
        self.isVisible();
      }, 500);  
    } else {
      self.cb(false);
      var msg = "Element <" + self.selector + "> was not visible in " + self.ms + " milliseconds.";  
      self.client.assertion(false, false, false, msg, true);
      return self.emit('complete');
    }
  });
};

CommandAction.prototype.checkElement = function() {
  var self = this;
  Protocol.actions.element.call(this.client, 'css selector', this.selector, function getElementCallback(result) {
    var now = new Date().getTime();
    if (result.status === 0) {
      self.element = result.value.ELEMENT;
      return self.isVisible();
    } else if (now - self.startTimer < self.ms) {
      setTimeout(function() {
        self.checkElement();
      }, 500);  
    } else {
      self.cb(false);
      var msg = "Element <" + self.selector + "> was not present in " + self.ms + " milliseconds.";
      self.client.assertion(false, false, false, msg, true);
      return self.emit('complete');  
    }
  });
};

module.exports = CommandAction;
