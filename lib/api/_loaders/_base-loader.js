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

  static createQueuedCommandFn({parent, commandName, namespace, commandFn, context}) {
    //const commandFn = this.commandFn.bind(this);
    const redact = this.module.RedactParams || false;
    const {commandQueue, api, nightwatchInstance} = this;

    return function queuedCommandFn(...args) {
      const stackTrace = Utils.getOriginalStackTrace(queuedCommandFn);
      const deferred = Utils.createPromise();
      deferred.commandName = commandName;

      // if this command was called from another async (custom) command
      const isAsyncCommand = this.isES6Async;

      // if this command was called from an async test case
      const isES6Async = Utils.isUndefined(this.isES6Async) ? nightwatchInstance.isES6AsyncTestcase : isAsyncCommand;
      const options = {redact};

      const node = commandQueue.add({
        commandName,
        commandFn: commandFn(),
        context: this,
        args,
        stackTrace,
        namespace,
        options,
        deferred,
        isES6Async
      });

      if (isES6Async) {
        if (parent && parent.__pageObjectItem__) {
          Object.assign(node.deferred.promise, parent.__pageObjectItem__);
        } else {
          Object.assign(node.deferred.promise, api);
        }

        return node.deferred.promise;
      }

      return api;
    }.bind(context);
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

  isTypescriptDisabled() {
    return this.nightwatchInstance.settings.disable_typescript;
  }

  getTargetNamespace() {
    return null;
  }

  isFileNameValid(fileName) {
    if (fileName.startsWith('_') && this.ignoreUnderscoreLeadingNames) {
      return false;
    }

    return Utils.isFileNameValid(fileName);
  }

  setNamespace(val) {
    this.__namespace = val;

    return this;
  }

  defineArgs(parent) {
    const args = [this.getQueuedCommandFn(parent)];
    const namespace = this.getTargetNamespace(parent);
    if (namespace) {
      args.unshift(namespace);
    }

    return args;
  }

  define(parent = null) {
    if (!this.commandFn) {
      return this;
    }

    this.validateMethod(parent);

    const {commandName, nightwatchInstance} = this;
    const args = this.defineArgs(parent);

    nightwatchInstance.setApiMethod(commandName, ...args);
    if (this.module && this.module.AliasName) {
      nightwatchInstance.setApiMethod(this.module.AliasName, ...args);
    }

    return this;
  }

  loadDriverCommands({commands}) {
    commands.forEach(propertyName => {
      this.nightwatchInstance.setApiMethod(propertyName, this.namespace, (function (commandName) {
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
