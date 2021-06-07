const EventEmitter = require('events');
const Utils = require('../../utils');

class BaseLoader extends EventEmitter {
  constructor(nightwatchInstance) {
    super();

    this.nightwatchInstance = nightwatchInstance;
  }

  static unflattenNamespace(target, namespace, value) {
    const key = namespace.shift();
    if (key) {
      target[key] = target[key] || {};
      value = target[key];

      return BaseLoader.unflattenNamespace(target[key], namespace, value);
    }

    return value;
  }

  static createQueuedCommandFn({commandName, namespace, commandFn, context}) {
    return function queuedCommandFn(...args) {
      const {api, commandQueue} = this;
      const stackTrace = Utils.getOriginalStackTrace(queuedCommandFn);
      const deferred = Utils.createPromise();
      deferred.commandName = commandName;

      // if this command was called from another async (custom) command
      const isAsyncCommand = this.isES6Async;

      // if this command was called from an async test case
      const isES6Async = Utils.isUndefined(this.isES6Async) ? this.nightwatchInstance.isES6AsyncTestcase : isAsyncCommand;

      const node = commandQueue.add({
        commandName,
        commandFn: commandFn(),
        context: api,
        args,
        stackTrace,
        namespace,
        deferred,
        isES6Async
      });

      if (isES6Async) {
        Object.assign(node.deferred.promise, api);

        return node.deferred.promise;
      }

      return api;
    }.bind(context);
  }

  static executeDriverCommand(transport, commandName) {
    return function commandFn({args}) {
      return transport.driver[commandName](...args).catch((error) => {
        if (error.remoteStacktrace) {
          delete error.remoteStacktrace;
        }

        return {
          value: null,
          error
        };
      });
    };
  }

  get commandQueue() {
    return this.nightwatchInstance.queue;
  }

  get loadSubDirectories() {
    return false;
  }

  get reporter() {
    return this.nightwatchInstance.reporter;
  }

  get api() {
    return this.nightwatchInstance.api;
  }

  get elementLocator() {
    return this.nightwatchInstance.elementLocator;
  }

  get transport() {
    return this.nightwatchInstance.transport;
  }

  get namespace() {
    return this.__namespace;
  }

  setNamespace(val) {
    this.__namespace = val;

    return this;
  }

  loadDriverCommands({commands}) {
    commands.forEach(propertyName => {
      this.nightwatchInstance.setApiMethod(propertyName, this.namespace, (function(commandName) {
        return BaseLoader.createQueuedCommandFn({
          commandName,
          commandFn: BaseLoader.executeDriverCommand(this.transport, commandName),
          context: this,
          namespace: 'firefox'
        });
      }.bind(this))(propertyName));
    });
  }
}

module.exports = BaseLoader;
