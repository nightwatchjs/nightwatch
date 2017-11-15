const events = require('events');

class BaseCommand extends events.EventEmitter {
  constructor(nightwatchInstance) {
    super();

    this.__instance = null;
    this.nightwatchInstance = nightwatchInstance;
    this.api = nightwatchInstance.api;
  }

  set stackTrace(val) {
    this.__stackTrace = val;
  }

  get stackTrace() {
    return this.__stackTrace;
  }

  get instance() {
    return this.__instance;
  }

  isTypeImplemented(method, type) {
    if (type === '*') {
      return this.instance[method] !== undefined;
    }

    return typeof this.instance[method] == type;
  }
}

module.exports = BaseCommand;
