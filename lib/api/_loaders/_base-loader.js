const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const Utils = require('../../utils');

let __last_deferred__ = null;
class BaseLoader extends EventEmitter {
  static handleModuleError(err, fullPath) {
    const {message} = err;

    const showStackTrace = ['SyntaxError', 'TypeError'].includes(err.name);
    const error = new Error(`There was an error while trying to load the file ${fullPath}:`);
    error.detailedErr = `[${err.code || err.name}] ${message};`;
    error.extraDetail = `\n Current working directory is: ${process.cwd()}`;
    error.showTrace = showStackTrace;
    error.displayed = false;
    if (showStackTrace) {
      error.stack = err.stack;
    }

    throw error;
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

  static createDriverCommand(nightwatchInstance, commandName) {
    return function commandFn({args}) {
      return nightwatchInstance.transport.driver[commandName](...args).catch((error) => {
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

  static get lastDeferred() {
    return __last_deferred__;
  }

  static set lastDeferred(value) {
    __last_deferred__ = value;
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

  get module() {
    return this.__module;
  }

  set module(val) {
    this.__module = val;
  }

  get commandName() {
    return this.__commandName;
  }

  get commandFn() {
    return this.__commandFn;
  }

  set commandFn(val) {
    this.__commandFn = val;
  }

  set commandName(val) {
    this.__commandName = val;
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

  get isUserDefined() {
    return this.__isUserDefined;
  }

  set isUserDefined(val) {
    this.__isUserDefined = val;
  }

  get addedInsideCallback() {
    return this.__addedInsideCallback;
  }

  set addedInsideCallback(val) {
    this.__addedInsideCallback = val;
  }

  set ignoreUnderscoreLeadingNames(val) {
    this.__ignoreUnderscoreNames = val;
  }

  get ignoreUnderscoreLeadingNames() {
    return this.__ignoreUnderscoreNames && !this.isUserDefined;
  }

  constructor(nightwatchInstance) {
    super();

    BaseLoader.lastDeferred = null;
    this.nightwatchInstance = nightwatchInstance;
  }

  isTypescriptDisabled() {
    return this.nightwatchInstance.settings.disable_typescript;
  }

  get settings() {
    return this.nightwatchInstance.settings;
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

  loadModule(dirPath, fileName) {
    const fullPath = path.join(dirPath, fileName);
    if (!this.loadSubDirectories && fs.lstatSync(fullPath).isDirectory()) {
      return this;
    }

    this.requireModule(fullPath, fileName);

    return this;
  }

  requireModule(fullPath, fileName) {
    if (!this.isFileNameValid(fileName)) {
      return this;
    }

    if (this.isTypescriptDisabled() && Utils.isTsFile(fileName)) {
      return this;
    }

    this.commandName = path.parse(fullPath).name;
    this.fileName = fullPath;

    try {
      this.module = Utils.requireModule(fullPath);
    } catch (err) {
      BaseLoader.handleModuleError(err, fullPath);
    }
  }

  async loadModuleAsync(dirPath, fileName) {
    const fullPath = path.join(dirPath, fileName);
    if (!this.loadSubDirectories && fs.lstatSync(fullPath).isDirectory()) {
      return this;
    }

    await this.requireModuleAsync(fullPath, fileName);
  }

  async requireModuleAsync(fullPath, fileName) {
    if (!this.isFileNameValid(fileName)) {
      return this;
    }

    if (this.isTypescriptDisabled() && Utils.isTsFile(fileName)) {
      return this;
    }

    this.commandName = path.parse(fullPath).name;
    this.fileName = fullPath;

    try {
      this.module = await Utils.requireModule(fullPath);
    } catch (err) {
      BaseLoader.handleModuleError(err, fullPath);
    }
  }

  validateMethod() {}

  defineArgs(parent) {
    const {commandName} = this;
    const commandFn = this.commandFn.bind(this);
    const args = [this.createQueuedCommandFn({
      parent,
      commandName,
      commandFn,
      context: this
    })];

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

  getCommandOptions() {
    return {};
  }

  createQueuedCommandFn({parent, commandName, namespace, commandFn, context}) {
    const {commandQueue, api, nightwatchInstance} = this;

    return function queuedCommandFn(...args) {
      const stackTrace = Utils.getOriginalStackTrace(queuedCommandFn);
      const deferred = Utils.createPromise();
      deferred.commandName = commandName;

      // if this command was called from another async (custom) command
      const isAsyncCommand = this.isES6Async;

      const options = this.getCommandOptions();


      if (args && args.length > 0 && Utils.isFunction(args[args.length-1])) {
        const callback = args.pop();
        
        const userCallbackWrapper = (function(context) {
          
          const proxyFn = new Proxy(callback, {
            apply: function(target, thisArg, argumentsList) {
              context.addedInsideCallback = true;
          
              return target.apply(thisArg, argumentsList);
            }
          });
          proxyFn.originalTarget = callback;
          
          return  proxyFn;
        })(this);

        args.push(userCallbackWrapper);
      }

      // if this command was called from an async test case
      let isES6Async = options.alwaysAsync || nightwatchInstance.settings.always_async_commands;

      if (!isES6Async) {
        isES6Async = Utils.isUndefined(this.isES6Async) ? (
          nightwatchInstance.isES6AsyncTestcase || nightwatchInstance.isES6AsyncCommand
        ) : isAsyncCommand;
      }

      if (!Utils.isUndefined(nightwatchInstance.isES6AsyncTestHook)) {
        isES6Async = nightwatchInstance.isES6AsyncTestHook;
      }

      const node = commandQueue.add({
        commandName,
        commandFn,
        context: this,
        args,
        stackTrace,
        namespace,
        options,
        deferred,
        isES6Async
      });

      if (this.module && this.module.autoInvoke) {
        const result = node.execute(true);

        return result;
      }

      if (isES6Async || options.alwaysAsync || node.isES6Async) {
        BaseLoader.lastDeferred = node.deferred;
        if (parent && parent.__pageObjectItem__) {
          Object.assign(node.deferred.promise, parent.__pageObjectItem__);
        } else {
          Object.assign(node.deferred.promise, api);
        }

        //prevent unhandled rejection.
        node.deferred.promise.catch(err => {
          BaseLoader.lastDeferred.reject(err);
        });

        return node.deferred.promise;
      }

      return api;
    }.bind(context);
  }

  loadDriverCommands({commands, namespace}) {
    commands.forEach(propertyName => {
      const commandFn = BaseLoader.createDriverCommand(this, propertyName);

      this.nightwatchInstance.setApiMethod(propertyName, namespace, (function (commandName) {
        return this.createQueuedCommandFn({
          commandName,
          commandFn,
          context: this,
          namespace
        });
      }.bind(this))(propertyName));
    });
  }
}

module.exports = BaseLoader;
