const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const Utils = require('../util/utils.js');

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

    this.nightwatchInstance = nightwatchInstance;
  }

  static getOriginalStrackTrace(commandFn) {
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

  static isFileNameValid(fileName) {
    return Utils.isFileNameValid(fileName);
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

  get transport() {
    return this.nightwatchInstance.transport;
  }

  get sessionId() {
    return this.nightwatchInstance.session.sessionId;
  }

  get module() {
    return this.__module;
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

  set ignoreUnderscoreLeadingNames(val) {
    this.__ignoreUnderscoreNames = val;
  }

  get ignoreUnderscoreLeadingNames() {
    return this.__ignoreUnderscoreNames;
  }

  setNamespace(val) {
    this.__namespace = val;

    return this;
  }

  isTypeImplemented(method, type) {
    if (type === '*') {
      return this.instance[method] !== undefined;
    }

    return typeof this.instance[method] == type;
  }

  loadModule(dirPath, fileName) {
    // TODO: add support for namespaces
    if (!this.loadSubDirectories && fs.lstatSync(path.join(dirPath, fileName)).isDirectory()) {
      return this;
    }

    if (!BaseLoader.isFileNameValid(fileName) || fileName.startsWith('_') && this.ignoreUnderscoreLeadingNames) {
      return this;
    }

    this.commandName = path.basename(fileName, VALID_FILENAME_EXT);

    try {
      this.__module = require(path.join(dirPath, fileName));
    } catch (err) {
      throw new Error(`There was an error while trying to load the file ${fileName}:\n${err.stack}`);
    }

    return this;
  }

  validateMethod(parent) {
    let namespace = this.getTargetNamespace(parent);

    if (this.nightwatchInstance.isApiMethodDefined(this.commandName, namespace)) {
      throw new Error(`The ${this.type} ${this.namespace || ''}.${this.commandName}() is already defined.`);
    }

    return this;
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

  define(parent = null) {
    if (!this.commandFn) {
      return this;
    }

    this.validateMethod(parent);

    const commandName = this.commandName;
    const originalCommandFn = this.commandFn;

    let args = [function commandFn(...args) {
      let originalStackTrace = BaseLoader.getOriginalStrackTrace(commandFn);

      this.commandQueue.add(commandName, originalCommandFn, this, args, originalStackTrace);

      return this.api;
    }.bind(this)];

    let namespace = this.getTargetNamespace(parent);

    if (namespace) {
      args.unshift(namespace);
    }

    this.nightwatchInstance.setApiMethod(this.commandName, ...args);

    return this;
  }
}

module.exports = BaseLoader;