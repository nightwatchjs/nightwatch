var util = require('util');
var events = require('events');

function Command() {
  events.EventEmitter.call(this);
}

util.inherits(Command, events.EventEmitter);

Command.prototype.command = function(callback) {
  var self = this;

  this.client.locateStrategy = this.strategy;
  process.nextTick(function() {
    if (typeof callback == 'function') {
      callback.call(self.client.api);
    }
    self.emit('complete');
  });

  return this;
};

module.exports = Command;
