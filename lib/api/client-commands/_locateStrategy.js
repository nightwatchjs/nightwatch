const EventEmitter = require('events');

class Command extends EventEmitter {
  command(callback) {
    this.client.locateStrategy = this.strategy;

    process.nextTick(() => {
      if (typeof callback == 'function') {
        callback.call(this.api);
      }
      this.emit('complete');
    });

    return this;
  }
}

module.exports = Command;
