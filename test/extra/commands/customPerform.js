var util = require('util');
var events = require('events');

function Command() {
  events.EventEmitter.call(this);
}
util.inherits(Command, events.EventEmitter);

Command.prototype.command = function(callback) {
  var self = this;
  this.api.perform(function() {
    setTimeout(function() {
      if (callback) {
        callback();
      }
      self.emit('complete');
    }, 10);
  });

  return this;
};

module.exports = Command;
