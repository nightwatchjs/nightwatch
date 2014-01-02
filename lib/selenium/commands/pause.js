var util = require('util'),
    events = require('events');
    
function CommandAction() {
  events.EventEmitter.call(this);
};

util.inherits(CommandAction, events.EventEmitter);
CommandAction.prototype.command = function(ms, cb) {
  var self = this;
  if (!ms) {
    return this;
  }
  var timer = setTimeout(function() {
    if (cb) {
      cb.call(self.client);  
    }

    self.emit('complete');
  }, ms);
  
  return this;
}
      
module.exports = CommandAction;
