const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const Utils = require('../util/utils.js');
const Element = require('../page-object/element.js');

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

    this.nightwatchInstance = nightwatchInstance;
  }

  static isTypeImplemented(instance, method, type) {
    if (type === '*') {
      return instance[method] !== undefined;
    }

    return typeof instance[method] == type;
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

  static serializePageObjectElement(element) {
    if (!(element instanceof Element)) {
      return {};
    }

    const result = {
      selector: element.selector,
      locateStrategy: element.locateStrategy,
      name: element.name
    };

    if (Element.requiresFiltering(element)) {
      result.index = element.index;
    }

    return result;
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
    // TODO: add support for namespaces
    if (!this.loadSubDirectories && fs.lstatSync(path.join(dirPath, fileName)).isDirectory()) {
      return this;
    }

    if (!BaseLoader.isFileNameValid(fileName) || fileName.startsWith('_') && this.ignoreUnderscoreLeadingNames) {
      return this;
    }

    const extension = Utils.VALID_FILENAME_EXTS.find(extension => {
      return fileName.endsWith(extension);
    });

    this.commandName = path.basename(fileName, extension);

    try {
      this.__module = Utils.requireModule(path.join(dirPath, fileName));
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

  updateElementSelector(args) {
    if ((args[0] instanceof Element) && this.isUserDefined) {
      if (args[0].usingRecursion) {
        return this.transport.locateElement(args[0]).then(response => {
          const element = args[0].selector[args[0].selector.length - 1];
          const result = BaseLoader.serializePageObjectElement(element);
          result.response = response;

          return result;
        });
      }

      return Promise.resolve(BaseLoader.serializePageObjectElement(args[0]));
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

  define(parent = null) {
    if (!this.commandFn) {
      return this;
    }

    this.validateMethod(parent);

    const commandName = this.commandName;
    const args = [function commandFn(...args) {
      let originalStackTrace = BaseLoader.getOriginalStrackTrace(commandFn);

      this.commandQueue.add(commandName, this.commandFn, this, args, originalStackTrace, namespace);

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