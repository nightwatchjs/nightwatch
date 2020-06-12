const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const Utils = require('../../utils');
const Element = require('../../element');

const VALID_FILENAME_EXT = '.js';

class BaseLoader extends EventEmitter {
  constructor(nightwatchInstance) {
    super();

    this.type = 'command';
    this.__namespace = null;
    this.__module = null;
    this.__commandName = null;
    this.__commandFn = null;
    this.__instance = null;
    this.__isUserDefined = false;

    this.ignoreUnderscoreLeadingNames = true;
    this.nightwatchInstance = nightwatchInstance;
  }

  static isTypeImplemented(instance, method, type) {
    const methodTypes = method.split('|');

    if (type === '*') {
      return instance[method] !== undefined;
    }

    return methodTypes.some(method => (typeof instance[method] == type));
  }

  static getOriginalStackTrace(commandFn) {
    let originalStackTrace;

    if (commandFn.stackTrace) {
      originalStackTrace = commandFn.stackTrace;
    } else {
      let err = new Error;
      Error.captureStackTrace(err, commandFn);
      originalStackTrace = err.stack;
    }

    return originalStackTrace;
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

  get sessionId() {
    return this.nightwatchInstance.session.sessionId;
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

  get namespace() {
    return this.__namespace;
  }

  get commandFn() {
    return this.__commandFn;
  }

  get commandQueue() {
    return this.nightwatchInstance.session.commandQueue;
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

  set ignoreUnderscoreLeadingNames(val) {
    this.__ignoreUnderscoreNames = val;
  }

  get ignoreUnderscoreLeadingNames() {
    return this.__ignoreUnderscoreNames && !this.isUserDefined;
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
    if (!Utils.isFileNameValid(fileName) || fileName.startsWith('_') && this.ignoreUnderscoreLeadingNames) {
      return this;
    }

    this.commandName = path.basename(fileName, VALID_FILENAME_EXT);
    this.fileName = fullPath;

    try {
      this.module = require(fullPath);
    } catch (err) {
      throw new Error(`There was an error while trying to load the file ${fileName}: ${err.message}`);
    }
  }

  validateMethod(parent) {
    let namespace = this.getTargetNamespace(parent);

    if (this.nightwatchInstance.isApiMethodDefined(this.commandName, namespace)) {
      throw new Error(`The ${this.type} ${this.namespace || ''}.${this.commandName}() is already defined.`);
    }

    return this;
  }

  resolveElementSelector(args) {
    if ((args[0] instanceof Element) && this.isUserDefined) {
      const element = args[0];

      if (element.usingRecursion) {
        return this.elementLocator.resolveElementRecursively({element});
      }

      return Promise.resolve(element);
    }

    return Promise.resolve();
  }

  getTargetNamespace(parent) {
    let namespace = this.namespace;
    if (!parent) {
      return namespace;
    }

    if (!namespace) {
      return parent;
    }

    parent[namespace] = parent[namespace] || {};

    return parent[namespace];
  }

  getQueuedCommandFn() {
    const commandFn = this.commandFn.bind(this);
    const {commandQueue, commandName, namespace} = this;

    return function queuedCommandFn(...args) {
      const stackTrace = BaseLoader.getOriginalStackTrace(queuedCommandFn);

      commandQueue.add({
        commandName,
        commandFn,
        context: this,
        args,
        stackTrace,
        namespace
      });

      return this.api;
    }.bind(this);
  }

  define(parent = null) {
    if (!this.commandFn) {
      return this;
    }

    this.validateMethod(parent);

    const {commandName, nightwatchInstance} = this;

    const args = [this.getQueuedCommandFn()];
    const namespace = this.getTargetNamespace(parent);

    if (namespace) {
      args.unshift(namespace);
    }

    nightwatchInstance.setApiMethod(commandName, ...args);
    if (this.module && this.module.AliasName) {
      nightwatchInstance.setApiMethod(this.module.AliasName, ...args);
    }

    return this;
  }
}

module.exports = BaseLoader;
