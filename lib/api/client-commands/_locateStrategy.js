const EventEmitter = require('events');

class Command extends EventEmitter {
  command(callback = function() {}) {
    this.client.setLocateStrategy(this.strategy);

    process.nextTick(() => {
      callback.call(this.api);

      this.emit('complete');
    });

    return this;
  }
}

module.exports = Command;
